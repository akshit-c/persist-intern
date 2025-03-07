import {
    ArrowUpward as ArrowUpwardIcon,
    Code as CodeIcon,
    Search as SearchIcon,
    Star as StarIcon,
    Whatshot as WhatshotIcon
} from '@mui/icons-material';
import {
    alpha,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Grid,
    InputAdornment,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LeaderboardEntry } from '../types';

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
      id={`leaderboard-tabpanel-${index}`}
      aria-labelledby={`leaderboard-tab-${index}`}
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
    id: `leaderboard-tab-${index}`,
    'aria-controls': `leaderboard-tabpanel-${index}`,
  };
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would fetch from the API
        // const response = await progressService.getLeaderboard();
        // setLeaderboard(response.results || []);
        
        // For now, use mock data
        const mockLeaderboard: LeaderboardEntry[] = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          user: {
            id: i + 1,
            username: `user${i + 1}`,
            first_name: `User ${i + 1}`,
            last_name: `Last ${i + 1}`,
          },
          total_points: Math.floor(Math.random() * 500) + 100,
          challenges_completed: Math.floor(Math.random() * 20) + 1,
          rank: i + 1,
          updated_at: new Date().toISOString(),
        }));
        
        // Add current user
        if (user) {
          const userRank = Math.floor(Math.random() * 5) + 5; // Random rank between 5-10
          mockLeaderboard[userRank - 1] = {
            id: 999,
            user: {
              id: 999,
              username: user.username,
              first_name: user.first_name,
              last_name: user.last_name,
            },
            total_points: Math.floor(Math.random() * 300) + 200,
            challenges_completed: Math.floor(Math.random() * 15) + 5,
            rank: userRank,
            updated_at: new Date().toISOString(),
          };
        }
        
        // Sort by rank
        mockLeaderboard.sort((a, b) => a.rank - b.rank);
        
        setLeaderboard(mockLeaderboard);
        
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return theme.palette.grey[300];
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }
  
  // Filter leaderboard based on search query
  const filteredLeaderboard = leaderboard.filter(entry => 
    entry.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Find current user's entry
  const currentUserEntry = user ? filteredLeaderboard.find(entry => entry.user.username === user.username) : null;
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Leaderboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          See how you rank against other learners in the community.
        </Typography>
      </Box>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {/* Top 3 Users */}
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={3} justifyContent="center">
          {leaderboard.slice(0, 3).map((entry, index) => (
            <Grid item key={entry.id} xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  border: '1px solid',
                  borderColor: alpha(getMedalColor(entry.rank), 0.5),
                  backgroundColor: alpha(getMedalColor(entry.rank), 0.05),
                  transform: index === 0 ? 'scale(1.05)' : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': index === 0 ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '5px',
                    background: `linear-gradient(90deg, ${getMedalColor(entry.rank)}, ${alpha(getMedalColor(entry.rank), 0.5)})`,
                  } : {},
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: getMedalColor(entry.rank),
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: entry.rank === 1 ? 'black' : 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {entry.rank}
                </Box>
                
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    border: '3px solid',
                    borderColor: getMedalColor(entry.rank),
                    boxShadow: `0 0 15px ${alpha(getMedalColor(entry.rank), 0.5)}`,
                    fontSize: 32,
                    bgcolor: entry.rank === 1 ? 'primary.main' : entry.rank === 2 ? 'secondary.main' : 'warning.main',
                  }}
                >
                  {entry.user.first_name[0]}
                </Avatar>
                
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {entry.user.first_name} {entry.user.last_name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  @{entry.user.username}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={700} color="primary.main">
                      {entry.total_points}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Points
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={700} color="primary.main">
                      {entry.challenges_completed}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Challenges
                    </Typography>
                  </Box>
                </Box>
                
                {entry.rank === 1 && (
                  <Chip
                    icon={<WhatshotIcon />}
                    label="Leader"
                    color="primary"
                    sx={{ mt: 2, fontWeight: 600 }}
                  />
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Leaderboard Table */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="leaderboard tabs"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                minWidth: 100,
              },
            }}
          >
            <Tab label="All Time" {...a11yProps(0)} />
            <Tab label="This Month" {...a11yProps(1)} />
            <Tab label="This Week" {...a11yProps(2)} />
          </Tabs>
          
          <TextField
            placeholder="Search users..."
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 250,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell align="center">Challenges</TableCell>
                  <TableCell align="center">Points</TableCell>
                  <TableCell align="right">Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeaderboard.map((entry) => {
                  const isCurrentUser = user && entry.user.username === user.username;
                  
                  return (
                    <TableRow
                      key={entry.id}
                      sx={{
                        backgroundColor: isCurrentUser ? alpha(theme.palette.primary.main, 0.05) : 'inherit',
                        '&:hover': {
                          backgroundColor: isCurrentUser ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.action.hover, 0.1),
                        },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {entry.rank <= 3 ? (
                            <Avatar
                              sx={{
                                width: 30,
                                height: 30,
                                bgcolor: getMedalColor(entry.rank),
                                color: entry.rank === 1 ? 'black' : 'white',
                                fontWeight: 'bold',
                                fontSize: 14,
                              }}
                            >
                              {entry.rank}
                            </Avatar>
                          ) : (
                            <Typography variant="body1" fontWeight={isCurrentUser ? 700 : 400}>
                              {entry.rank}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              mr: 2,
                              bgcolor: isCurrentUser ? 'primary.main' : 'grey.300',
                            }}
                          >
                            {entry.user.first_name[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight={isCurrentUser ? 700 : 400}>
                              {entry.user.first_name} {entry.user.last_name}
                              {isCurrentUser && (
                                <Chip
                                  label="You"
                                  size="small"
                                  color="primary"
                                  sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                                />
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              @{entry.user.username}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CodeIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" fontWeight={isCurrentUser ? 600 : 400}>
                            {entry.challenges_completed}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <StarIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" fontWeight={isCurrentUser ? 600 : 400}>
                            {entry.total_points}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">
                          {new Date(entry.updated_at).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Monthly leaderboard will be available soon.
            </Typography>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Weekly leaderboard will be available soon.
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
      
      {/* Current User Stats (if not in top 100) */}
      {currentUserEntry === undefined && user && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 3,
            borderRadius: 4,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Your Position
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  mr: 2,
                  bgcolor: 'primary.main',
                }}
              >
                {user.first_name[0]}
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight={700}>
                  {user.first_name} {user.last_name}
                  <Chip
                    label="You"
                    size="small"
                    color="primary"
                    sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                  />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  @{user.username}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Rank
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  #120
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Points
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  75
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Challenges
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  3
                </Typography>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<ArrowUpwardIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Improve Rank
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Leaderboard; 