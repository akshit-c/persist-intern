import {
    CheckCircle as CheckCircleIcon,
    Code as CodeIcon,
    Leaderboard as LeaderboardIcon,
    MoreVert as MoreVertIcon,
    PlayArrow as PlayArrowIcon,
    Schedule as ScheduleIcon,
    Star as StarIcon,
    TrendingUp as TrendingUpIcon,
    EmojiEvents as TrophyIcon,
    Whatshot as WhatshotIcon,
} from '@mui/icons-material';
import {
    alpha,
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    Paper,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { challengeService, progressService } from '../services/api';
import { Challenge, LeaderboardEntry, UserProgress } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [recentChallenges, setRecentChallenges] = useState<Challenge[]>([]);
  const [topUsers, setTopUsers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch user progress
        const progressResponse = await progressService.getUserProgress();
        setUserProgress(progressResponse.results || []);
        
        // Fetch recent challenges
        const challengesResponse = await challengeService.getAllChallenges({ limit: 5 });
        setRecentChallenges(challengesResponse.results || []);
        
        // Fetch top users
        const leaderboardResponse = await progressService.getLeaderboard();
        setTopUsers(leaderboardResponse.results?.slice(0, 5) || []);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Calculate completion stats
  const completedChallenges = userProgress.filter((p) => p.status === 'completed').length;
  const totalChallenges = recentChallenges.length;
  const completionRate = totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;
  
  // Get total points earned
  const totalPoints = userProgress.reduce((sum, p) => sum + p.points_earned, 0);
  
  // Get user rank
  const userRank = topUsers.find((u) => u.user.id === user?.id)?.rank || 'N/A';
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return theme.palette.success.main;
      case 'intermediate':
        return theme.palette.primary.main;
      case 'advanced':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon />;
      case 'started':
        return <ScheduleIcon />;
      case 'submitted':
        return <TrendingUpIcon />;
      default:
        return <PlayArrowIcon />;
    }
  };
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'submitted':
        return 'warning';
      case 'started':
        return 'info';
      default:
        return 'default';
    }
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome back, {user?.first_name || user?.username}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Continue your learning journey and track your progress.
        </Typography>
      </Box>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 20px rgba(58, 134, 255, 0.2)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <CodeIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
            <Typography variant="h4" component="div" fontWeight={700}>
              {completedChallenges} / {totalChallenges}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              Challenges Completed
            </Typography>
            <Box sx={{ width: '100%', position: 'relative', mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={completionRate}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 6,
                    backgroundColor: 'white',
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontWeight: 600,
                }}
              >
                {Math.round(completionRate)}%
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.9)} 0%, ${alpha(theme.palette.success.dark, 0.9)} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 20px rgba(76, 175, 80, 0.2)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <StarIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
            <Typography variant="h4" component="div" fontWeight={700}>
              {totalPoints}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Total Points Earned
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <WhatshotIcon sx={{ mr: 0.5 }} />
              <Typography variant="body2">Keep going!</Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.9)} 0%, ${alpha(theme.palette.secondary.dark, 0.9)} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 20px rgba(255, 0, 110, 0.2)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <LeaderboardIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
            <Typography variant="h4" component="div" fontWeight={700}>
              {userRank}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Your Rank
            </Typography>
            <Button
              variant="outlined"
              size="small"
              component={Link}
              to="/leaderboard"
              sx={{
                mt: 2,
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              View Leaderboard
            </Button>
          </Paper>
        </Grid>
        
        {/* Recent Challenges */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight={600}>
                Recent Challenges
              </Typography>
              <Button
                variant="outlined"
                component={Link}
                to="/challenges"
                endIcon={<CodeIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            {recentChallenges.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CodeIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No challenges available yet.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Check back soon for new challenges!
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {recentChallenges.map((challenge) => {
                  const progress = userProgress.find((p) => p.challenge.id === challenge.id);
                  
                  return (
                    <Grid item xs={12} key={challenge.id}>
                      <Card
                        elevation={0}
                        sx={{
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                            borderColor: 'primary.main',
                          },
                        }}
                      >
                        <CardContent sx={{ pb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Chip
                                  label={challenge.difficulty}
                                  size="small"
                                  sx={{
                                    mr: 1,
                                    backgroundColor: alpha(getDifficultyColor(challenge.difficulty), 0.1),
                                    color: getDifficultyColor(challenge.difficulty),
                                    fontWeight: 600,
                                    borderRadius: 1,
                                  }}
                                />
                                <Chip
                                  icon={getStatusIcon(progress?.status)}
                                  label={progress?.status || 'Not Started'}
                                  color={getStatusColor(progress?.status) as any}
                                  size="small"
                                  sx={{ fontWeight: 500, borderRadius: 1 }}
                                />
                                <Box sx={{ flexGrow: 1 }} />
                                <Tooltip title="Challenge points">
                                  <Chip
                                    icon={<StarIcon fontSize="small" />}
                                    label={challenge.points}
                                    size="small"
                                    variant="outlined"
                                    sx={{ ml: 1, borderRadius: 1 }}
                                  />
                                </Tooltip>
                              </Box>
                              <Typography variant="h6" fontWeight={600}>
                                {challenge.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                                {challenge.description}
                              </Typography>
                            </Box>
                            <IconButton size="small">
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                        <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                          <Button
                            variant={progress?.status === 'completed' ? 'outlined' : 'contained'}
                            size="medium"
                            component={Link}
                            to={`/challenges/${challenge.id}`}
                            startIcon={getStatusIcon(progress?.status)}
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                            }}
                          >
                            {progress?.status === 'completed'
                              ? 'View Solution'
                              : progress?.status === 'started'
                              ? 'Continue'
                              : 'Start Challenge'}
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Paper>
        </Grid>
        
        {/* Leaderboard */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight={600}>
                Top Performers
              </Typography>
              <Button
                variant="text"
                component={Link}
                to="/leaderboard"
                endIcon={<LeaderboardIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            {topUsers.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <LeaderboardIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No leaderboard data available yet.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Complete challenges to appear on the leaderboard!
                </Typography>
              </Box>
            ) : (
              <Box>
                {topUsers.map((entry, index) => {
                  const isCurrentUser = entry.user.id === user?.id;
                  const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
                  
                  return (
                    <Box
                      key={entry.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        p: 2,
                        borderRadius: 3,
                        backgroundColor: isCurrentUser ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                        border: isCurrentUser ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : '1px solid transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        },
                      }}
                    >
                      {index < 3 ? (
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: medalColors[index],
                            color: index === 0 ? 'black' : 'white',
                            fontWeight: 'bold',
                            mr: 2,
                          }}
                        >
                          {entry.rank}
                        </Avatar>
                      ) : (
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: 'action.selected',
                            fontWeight: 'bold',
                            mr: 2,
                          }}
                        >
                          {entry.rank}
                        </Avatar>
                      )}
                      
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" fontWeight={isCurrentUser ? 700 : 600}>
                          {entry.user.first_name} {entry.user.last_name}
                          {isCurrentUser && (
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{
                                ml: 1,
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                              }}
                            >
                              You
                            </Typography>
                          )}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TrophyIcon
                            fontSize="small"
                            sx={{ mr: 0.5, color: theme.palette.text.secondary, fontSize: 16 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {entry.total_points} points
                          </Typography>
                          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 12, my: 'auto' }} />
                          <CodeIcon
                            fontSize="small"
                            sx={{ mr: 0.5, color: theme.palette.text.secondary, fontSize: 16 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {entry.challenges_completed} challenges
                          </Typography>
                        </Box>
                      </Box>
                      
                      {index < 3 && (
                        <TrophyIcon
                          sx={{
                            color: medalColors[index],
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 