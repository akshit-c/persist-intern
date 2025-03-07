import axios from 'axios';

// Use environment variable for API URL with fallback to local development URL
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Try to refresh the token
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/users/login/', { username, password });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/users/register/', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/users/profile/');
    return response.data;
  },
  
  updateProfile: async (profileData: any) => {
    const response = await api.put('/users/profile/', profileData);
    return response.data;
  },
};

// Challenge services
export const challengeService = {
  getAllChallenges: async (params?: any) => {
    const response = await api.get('/challenges/', { params });
    return response.data;
  },
  
  getChallengeById: async (id: number) => {
    const response = await api.get(`/challenges/${id}/`);
    return response.data;
  },
  
  getCategories: async () => {
    const response = await api.get('/challenges/categories/');
    return response.data;
  },
  
  submitChallenge: async (challengeId: number, content: string) => {
    const response = await api.post(`/challenges/${challengeId}/submit/`, { content });
    return response.data;
  },
  
  getSubmissions: async () => {
    const response = await api.get('/challenges/submissions/');
    return response.data;
  },
};

// Progress services
export const progressService = {
  getUserProgress: async () => {
    const response = await api.get('/progress/');
    return response.data;
  },
  
  getChallengeProgress: async (challengeId: number) => {
    const response = await api.get(`/progress/${challengeId}/`);
    return response.data;
  },
  
  getLeaderboard: async () => {
    const response = await api.get('/progress/leaderboard/');
    return response.data;
  },
  
  getAchievements: async () => {
    const response = await api.get('/progress/achievements/');
    return response.data;
  },
};

export default api; 