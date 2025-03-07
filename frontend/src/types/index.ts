// User types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile?: UserProfile;
}

export interface UserProfile {
  bio: string;
  avatar: string | null;
  github_url: string;
  linkedin_url: string;
  website_url: string;
}

// Challenge types
export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  created_at: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  category: Category;
  content?: string;
  code_template?: string;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Submission {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  challenge: {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    points: number;
    category: Category;
    created_at: string;
  };
  content: string;
  status: 'pending' | 'correct' | 'incorrect';
  feedback: string;
  submitted_at: string;
}

// Progress types
export interface UserProgress {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  challenge: {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    points: number;
    category: Category;
    created_at: string;
  };
  status: 'started' | 'submitted' | 'completed';
  attempts: number;
  completed_at: string | null;
  points_earned: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  points: number;
  created_at: string;
}

export interface UserAchievement {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  achievement: Achievement;
  earned_at: string;
}

export interface LeaderboardEntry {
  id: number;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  total_points: number;
  challenges_completed: number;
  rank: number;
  updated_at: string;
}

// API response types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
} 