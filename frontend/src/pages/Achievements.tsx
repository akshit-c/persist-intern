import {
    Lock as LockIcon,
    Star as StarIcon,
    EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import {
    alpha,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Grid,
    LinearProgress,
    Paper,
    Typography,
    useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Achievement, UserAchievement } from '../types';

const Achievements: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would fetch from the API
        // const response = await progressService.getAchievements();
        // setUserAchievements(response.results || []);
        
        // For now, use mock data
        const mockAchievements: Achievement[] = [
          { id: 1, name: 'First Steps', description: 'Complete your first challenge', icon: 'baby', points: 10, created_at: new Date().toISOString() },
          { id: 2, name: 'Code Warrior', description: 'Complete 5 challenges', icon: 'sword', points: 25, created_at: new Date().toISOString() },
          { id: 3, name: 'Problem Solver', description: 'Complete 10 challenges', icon: 'puzzle', points: 50, created_at: new Date().toISOString() },
          { id: 4, name: 'Algorithm Master', description: 'Complete all algorithm challenges', icon: 'algorithm', points: 100, created_at: new Date().toISOString() },
          { id: 5, name: 'Speed Demon', description: 'Complete a challenge in under 5 minutes', icon: 'timer', points: 30, created_at: new Date().toISOString() },
          { id: 6, name: 'Perfect Score', description: 'Get 100% on a challenge', icon: 'star', points: 20, created_at: new Date().toISOString() },
          { id: 7, name: 'Night Owl', description: 'Complete a challenge after midnight', icon: 'owl', points: 15, created_at: new Date().toISOString() },
          { id: 8, name: 'Early Bird', description: 'Complete a challenge before 8 AM', icon: 'bird', points: 15, created_at: new Date().toISOString() },
        ];
        
        setAllAchievements(mockAchievements);
        
        // Mock user achievements (first 3 are earned)
        const mockUserAchievements: UserAchievement[] = [
          { id: 1, user: { id: 1, username: user?.username || '', first_name: user?.first_name || '', last_name: user?.last_name || '' }, achievement: mockAchievements[0], earned_at: new Date().toISOString() },
          { id: 2, user: { id: 1, username: user?.username || '', first_name: user?.first_name || '', last_name: user?.last_name || '' }, achievement: mockAchievements[4], earned_at: new Date().toISOString() },
          { id: 3, user: { id: 1, username: user?.username || '', first_name: user?.first_name || '', last_name: user?.last_name || '' }, achievement: mockAchievements[6], earned_at: new Date().toISOString() },
        ];
        
        setUserAchievements(mockUserAchievements);
        
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError('Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }
  
  // Calculate progress
  const earnedCount = userAchievements.length;
  const totalCount = allAchievements.length;
  const progressPercentage = (earnedCount / totalCount) * 100;
  
  // Get total points earned
  const totalPoints = userAchievements.reduce((sum, ua) => sum + ua.achievement.points, 0);
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Your Achievements
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your progress and earn badges as you complete challenges.
        </Typography>
      </Box>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {/* Progress Overview */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Achievement Progress
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                You've earned {earnedCount} out of {totalCount} achievements
              </Typography>
              <Box sx={{ position: 'relative', mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={progressPercentage}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'text.secondary',
                    fontWeight: 600,
                  }}
                >
                  {Math.round(progressPercentage)}%
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 4,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <TrophyIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {totalPoints}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Achievement Points
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Achievements Grid */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        All Achievements
      </Typography>
      
      <Grid container spacing={3}>
        {allAchievements.map((achievement) => {
          const isEarned = userAchievements.some(ua => ua.achievement.id === achievement.id);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={achievement.id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: isEarned ? alpha(theme.palette.primary.main, 0.3) : 'divider',
                  backgroundColor: isEarned ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: isEarned ? 'translateY(-5px)' : 'none',
                    boxShadow: isEarned ? '0 8px 20px rgba(0, 0, 0, 0.1)' : 'none',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: isEarned ? theme.palette.primary.main : alpha(theme.palette.grey[500], 0.1),
                        color: isEarned ? 'white' : theme.palette.grey[500],
                        boxShadow: isEarned ? '0 4px 12px rgba(58, 134, 255, 0.3)' : 'none',
                      }}
                    >
                      {isEarned ? (
                        <TrophyIcon sx={{ fontSize: 32 }} />
                      ) : (
                        <LockIcon sx={{ fontSize: 28 }} />
                      )}
                    </Box>
                    
                    <Chip
                      icon={<StarIcon fontSize="small" />}
                      label={`${achievement.points} pts`}
                      size="small"
                      color={isEarned ? 'primary' : 'default'}
                      variant={isEarned ? 'filled' : 'outlined'}
                      sx={{ fontWeight: 600, borderRadius: 1 }}
                    />
                  </Box>
                  
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{
                      color: isEarned ? 'text.primary' : theme.palette.grey[500],
                    }}
                  >
                    {achievement.name}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      color: isEarned ? 'text.secondary' : theme.palette.grey[500],
                      mb: 2,
                    }}
                  >
                    {achievement.description}
                  </Typography>
                  
                  {isEarned && (
                    <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 2 }}>
                      Earned on {new Date(userAchievements.find(ua => ua.achievement.id === achievement.id)?.earned_at || '').toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Achievements; 