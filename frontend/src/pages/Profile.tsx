import {
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    Code as CodeIcon,
    Edit as EditIcon,
    GitHub as GitHubIcon,
    History as HistoryIcon,
    LinkedIn as LinkedInIcon,
    PlayArrow as PlayArrowIcon,
    Save as SaveIcon,
    Schedule as ScheduleIcon,
    TrendingUp as TrendingUpIcon,
    EmojiEvents as TrophyIcon,
    Language as WebsiteIcon,
} from '@mui/icons-material';
import {
    Alert,
    alpha,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    Paper,
    Tab,
    Tabs,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Submission, UserAchievement, UserProgress } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const theme = useTheme();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    bio: user?.profile?.bio || '',
    github_url: user?.profile?.github_url || '',
    linkedin_url: user?.profile?.linkedin_url || '',
    website_url: user?.profile?.website_url || '',
  });
  
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would fetch from the API
        // const progressResponse = await progressService.getUserProgress();
        // setUserProgress(progressResponse.results || []);
        
        // For now, use mock data
        setUserProgress([]);
        setUserAchievements([]);
        setSubmissions([]);
        
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleEditToggle = () => {
    if (editMode) {
      // Cancel edit mode, reset form data
      setFormData({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        bio: user?.profile?.bio || '',
        github_url: user?.profile?.github_url || '',
        linkedin_url: user?.profile?.linkedin_url || '',
        website_url: user?.profile?.website_url || '',
      });
    }
    setEditMode(!editMode);
    setError('');
    setSuccess('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // In a real app, we would update the profile
      // await updateProfile(formData);
      
      // For now, just simulate success
      setTimeout(() => {
        setSuccess('Profile updated successfully');
        setEditMode(false);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      setLoading(false);
    }
  };
  
  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography variant="h5" color="error">
          User not found
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Your Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your personal information and track your progress.
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Typography variant="h5" fontWeight={600}>
                Personal Info
              </Typography>
              
              {editMode ? (
                <Box>
                  <IconButton
                    color="primary"
                    type="submit"
                    disabled={loading}
                    sx={{ mr: 1 }}
                  >
                    <SaveIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={handleEditToggle}
                    disabled={loading}
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>
              ) : (
                <IconButton
                  color="primary"
                  onClick={handleEditToggle}
                  disabled={loading}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: 48,
                  fontWeight: 'bold',
                }}
              >
                {user.first_name[0]}
              </Avatar>
              
              {editMode ? (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      required
                    />
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {user.first_name} {user.last_name}
                </Typography>
              )}
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                @{user.username}
              </Typography>
              
              <Chip
                label={`Joined ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Bio
              </Typography>
              
              {editMode ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="About yourself"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {user.profile?.bio || 'No bio provided yet.'}
                </Typography>
              )}
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Social Links
              </Typography>
              
              {editMode ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="GitHub URL"
                      name="github_url"
                      value={formData.github_url}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      placeholder="https://github.com/username"
                      InputProps={{
                        startAdornment: <GitHubIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="LinkedIn URL"
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      placeholder="https://linkedin.com/in/username"
                      InputProps={{
                        startAdornment: <LinkedInIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Website URL"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                      placeholder="https://example.com"
                      InputProps={{
                        startAdornment: <WebsiteIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Box>
                  {user.profile?.github_url ? (
                    <Button
                      startIcon={<GitHubIcon />}
                      href={user.profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textTransform: 'none', mr: 1, mb: 1 }}
                    >
                      GitHub
                    </Button>
                  ) : null}
                  
                  {user.profile?.linkedin_url ? (
                    <Button
                      startIcon={<LinkedInIcon />}
                      href={user.profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textTransform: 'none', mr: 1, mb: 1 }}
                    >
                      LinkedIn
                    </Button>
                  ) : null}
                  
                  {user.profile?.website_url ? (
                    <Button
                      startIcon={<WebsiteIcon />}
                      href={user.profile.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textTransform: 'none', mr: 1, mb: 1 }}
                    >
                      Website
                    </Button>
                  ) : null}
                  
                  {!user.profile?.github_url && !user.profile?.linkedin_url && !user.profile?.website_url && (
                    <Typography variant="body2" color="text.secondary">
                      No social links provided yet.
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Activity Tabs */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="profile tabs"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 100,
                },
              }}
            >
              <Tab label="Progress" icon={<TrendingUpIcon />} iconPosition="start" {...a11yProps(0)} />
              <Tab label="Achievements" icon={<TrophyIcon />} iconPosition="start" {...a11yProps(1)} />
              <Tab label="Submissions" icon={<HistoryIcon />} iconPosition="start" {...a11yProps(2)} />
            </Tabs>
            
            <TabPanel value={tabValue} index={0}>
              {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : userProgress.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CodeIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No progress yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Start completing challenges to track your progress
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/challenges"
                    sx={{ mt: 2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                  >
                    Explore Challenges
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {userProgress.map((progress) => (
                    <Grid item xs={12} key={progress.id}>
                      <Card
                        elevation={0}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Typography variant="h6" fontWeight={600}>
                                {progress.challenge.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                {progress.challenge.description}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Chip
                                  label={progress.challenge.difficulty}
                                  size="small"
                                  sx={{
                                    mr: 1,
                                    backgroundColor: alpha(
                                      progress.challenge.difficulty === 'beginner'
                                        ? theme.palette.success.main
                                        : progress.challenge.difficulty === 'intermediate'
                                        ? theme.palette.primary.main
                                        : theme.palette.error.main,
                                      0.1
                                    ),
                                    color:
                                      progress.challenge.difficulty === 'beginner'
                                        ? theme.palette.success.main
                                        : progress.challenge.difficulty === 'intermediate'
                                        ? theme.palette.primary.main
                                        : theme.palette.error.main,
                                    fontWeight: 600,
                                    borderRadius: 1,
                                  }}
                                />
                                <Chip
                                  icon={
                                    progress.status === 'completed' ? (
                                      <CheckCircleIcon />
                                    ) : progress.status === 'started' ? (
                                      <ScheduleIcon />
                                    ) : (
                                      <PlayArrowIcon />
                                    )
                                  }
                                  label={progress.status}
                                  color={
                                    progress.status === 'completed'
                                      ? 'success'
                                      : progress.status === 'submitted'
                                      ? 'warning'
                                      : 'default'
                                  }
                                  size="small"
                                  sx={{ fontWeight: 500, borderRadius: 1 }}
                                />
                              </Box>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Chip
                                icon={<TrophyIcon fontSize="small" />}
                                label={`${progress.points_earned} pts`}
                                size="small"
                                color={progress.points_earned > 0 ? 'primary' : 'default'}
                                variant={progress.points_earned > 0 ? 'filled' : 'outlined'}
                                sx={{ fontWeight: 600, borderRadius: 1 }}
                              />
                              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                                {progress.attempts} attempts
                              </Typography>
                              {progress.completed_at && (
                                <Typography variant="caption" display="block" color="text.secondary">
                                  Completed on {new Date(progress.completed_at).toLocaleDateString()}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : userAchievements.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <TrophyIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No achievements yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Complete challenges to earn achievements
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/achievements"
                    sx={{ mt: 2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                  >
                    View All Achievements
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {userAchievements.map((userAchievement) => (
                    <Grid item xs={12} sm={6} key={userAchievement.id}>
                      <Card
                        elevation={0}
                        sx={{
                          border: '1px solid',
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          borderRadius: 2,
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 50,
                                height: 50,
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: theme.palette.primary.main,
                                color: 'white',
                                mr: 2,
                              }}
                            >
                              <TrophyIcon />
                            </Box>
                            <Box>
                              <Typography variant="h6" fontWeight={600}>
                                {userAchievement.achievement.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {userAchievement.achievement.description}
                              </Typography>
                              <Typography variant="caption" color="primary">
                                Earned on {new Date(userAchievement.earned_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : submissions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <HistoryIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No submissions yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Submit solutions to challenges to see your history
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/challenges"
                    sx={{ mt: 2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                  >
                    Explore Challenges
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {submissions.map((submission) => (
                    <Grid item xs={12} key={submission.id}>
                      <Card
                        elevation={0}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Typography variant="h6" fontWeight={600}>
                                {submission.challenge.title}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Chip
                                  label={submission.status}
                                  color={
                                    submission.status === 'correct'
                                      ? 'success'
                                      : submission.status === 'incorrect'
                                      ? 'error'
                                      : 'default'
                                  }
                                  size="small"
                                  sx={{ fontWeight: 500, borderRadius: 1, mr: 1 }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  Submitted on {new Date(submission.submitted_at).toLocaleString()}
                                </Typography>
                              </Box>
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              component={Link}
                              to={`/challenges/${submission.challenge.id}`}
                              sx={{ borderRadius: 2, textTransform: 'none' }}
                            >
                              View Challenge
                            </Button>
                          </Box>
                          {submission.feedback && (
                            <Box sx={{ mt: 2, p: 2, backgroundColor: alpha(theme.palette.grey[500], 0.1), borderRadius: 1 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Feedback:
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {submission.feedback}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile; 