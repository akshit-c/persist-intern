import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Achievements from './pages/Achievements';
import ChallengeDetail from './pages/ChallengeDetail';
import Challenges from './pages/Challenges';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3a86ff', // Vibrant blue
      light: '#8fb8ff',
      dark: '#0057cc',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff006e', // Vibrant pink
      light: '#ff5c9d',
      dark: '#c50053',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    error: {
      main: '#ff5252',
    },
    warning: {
      main: '#ffb74d',
    },
    info: {
      main: '#64b5f6',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #3a86ff 30%, #4dabf5 90%)',
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #ff006e 30%, #ff5c9d 90%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

function App() {
  // Test connection to backend
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/admin/');
        console.log('Backend connection successful:', response.status);
      } catch (error) {
        console.error('Backend connection failed:', error);
      }
    };

    testBackendConnection();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/challenges/:id" element={<ChallengeDetail />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>
            
            {/* Redirect to dashboard if logged in, otherwise to login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
