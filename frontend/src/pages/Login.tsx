import {
    LockOutlined as LockOutlinedIcon,
    Person as PersonIcon,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    Link,
    Paper,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(90deg, #3a86ff, #8fb8ff)',
            },
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: 'primary.main',
              width: 56,
              height: 56,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mt: 2,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #3a86ff 30%, #4dabf5 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome Back
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
            Sign in to continue your learning journey
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%', 
                mb: 2,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: 'error.main'
                }
              }}
            >
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              sx={{ mt: 1 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(58, 134, 255, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(58, 134, 255, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                <Link component={RouterLink} to="#" variant="body2" color="primary.main">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: isMobile ? 'center' : 'right' }}>
                <Link component={RouterLink} to="/register" variant="body2" color="primary.main">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Createathon. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login; 