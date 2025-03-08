import {
    BookmarkBorder as BookmarkBorderIcon,
    Bookmark as BookmarkIcon,
    CheckCircle as CheckCircleIcon,
    Code as CodeIcon,
    PlayArrow as PlayArrowIcon,
    Schedule as ScheduleIcon,
    Search as SearchIcon,
    Star as StarIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import {
    alpha,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    SelectChangeEvent,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { challengeService, progressService } from '../services/api';
import { Category, Challenge, UserProgress } from '../types';

const Challenges: React.FC = () => {
  const theme = useTheme();
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  
  // Bookmarks
  const [bookmarkedChallenges, setBookmarkedChallenges] = useState<number[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch challenges
        const challengesResponse = await challengeService.getAllChallenges();
        setChallenges(challengesResponse.results || []);
        
        // Fetch user progress
        const progressResponse = await progressService.getUserProgress();
        setUserProgress(progressResponse.results || []);
        
        // Fetch categories
        const categoriesResponse = await challengeService.getCategories();
        setCategories(categoriesResponse.results || []);
        
        // Load bookmarks from localStorage
        const savedBookmarks = localStorage.getItem('bookmarkedChallenges');
        if (savedBookmarks) {
          setBookmarkedChallenges(JSON.parse(savedBookmarks));
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load challenges');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on search
  };
  
  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setDifficultyFilter(event.target.value);
    setPage(1);
  };
  
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
    setPage(1);
  };
  
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };
  
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const toggleBookmark = (challengeId: number) => {
    const newBookmarks = bookmarkedChallenges.includes(challengeId)
      ? bookmarkedChallenges.filter(id => id !== challengeId)
      : [...bookmarkedChallenges, challengeId];
    
    setBookmarkedChallenges(newBookmarks);
    localStorage.setItem('bookmarkedChallenges', JSON.stringify(newBookmarks));
  };
  
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
  
  // Filter challenges
  const filteredChallenges = challenges.filter(challenge => {
    // Search filter
    const matchesSearch = 
      searchQuery === '' || 
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Difficulty filter
    const matchesDifficulty = 
      difficultyFilter === 'all' || 
      challenge.difficulty === difficultyFilter;
    
    // Category filter
    const matchesCategory = 
      categoryFilter === 'all' || 
      challenge.category.id.toString() === categoryFilter;
    
    // Status filter
    const progress = userProgress.find(p => p.challenge.id === challenge.id);
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'completed' && progress?.status === 'completed') ||
      (statusFilter === 'in-progress' && progress?.status === 'started') ||
      (statusFilter === 'not-started' && !progress);
    
    return matchesSearch && matchesDifficulty && matchesCategory && matchesStatus;
  });
  
  // Paginate challenges
  const paginatedChallenges = filteredChallenges.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Explore Challenges
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover coding challenges to enhance your skills and earn achievements.
        </Typography>
      </Box>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {/* Filters */}
      <Box 
        sx={{ 
          mb: 4, 
          p: 3, 
          borderRadius: 4,
          backgroundColor: 'background.paper',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search challenges..."
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
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="difficulty-filter-label">Difficulty</InputLabel>
                  <Select
                    labelId="difficulty-filter-label"
                    value={difficultyFilter}
                    label="Difficulty"
                    onChange={handleDifficultyChange}
                  >
                    <MenuItem value="all">All Levels</MenuItem>
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="category-filter-label">Category</InputLabel>
                  <Select
                    labelId="category-filter-label"
                    value={categoryFilter}
                    label="Category"
                    onChange={handleCategoryChange}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    label="Status"
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="not-started">Not Started</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      
      {/* Challenge Cards */}
      {filteredChallenges.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: 'background.paper',
            borderRadius: 4,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          }}
        >
          <CodeIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No challenges found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your filters or search query
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedChallenges.map((challenge) => {
              const progress = userProgress.find((p) => p.challenge.id === challenge.id);
              const isBookmarked = bookmarkedChallenges.includes(challenge.id);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'visible',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1)',
                        borderColor: 'primary.main',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${getDifficultyColor(challenge.difficulty)}, ${alpha(getDifficultyColor(challenge.difficulty), 0.5)})`,
                        borderRadius: '3px 3px 0 0',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Chip
                          label={challenge.difficulty}
                          size="small"
                          sx={{
                            backgroundColor: alpha(getDifficultyColor(challenge.difficulty), 0.1),
                            color: getDifficultyColor(challenge.difficulty),
                            fontWeight: 600,
                            borderRadius: 1,
                          }}
                        />
                        <Tooltip title={isBookmarked ? "Remove bookmark" : "Bookmark challenge"}>
                          <IconButton 
                            size="small" 
                            onClick={() => toggleBookmark(challenge.id)}
                            sx={{ 
                              color: isBookmarked ? 'primary.main' : 'text.secondary',
                              '&:hover': {
                                color: 'primary.main',
                              }
                            }}
                          >
                            {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                      
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {challenge.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          height: '4.5em',
                        }}
                      >
                        {challenge.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                        <Chip
                          icon={getStatusIcon(progress?.status)}
                          label={progress?.status || 'Not Started'}
                          color={getStatusColor(progress?.status) as any}
                          size="small"
                          sx={{ fontWeight: 500, borderRadius: 1 }}
                        />
                        
                        <Tooltip title="Challenge points">
                          <Chip
                            icon={<StarIcon fontSize="small" />}
                            label={challenge.points}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: 1 }}
                          />
                        </Tooltip>
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        variant={progress?.status === 'completed' ? 'outlined' : 'contained'}
                        fullWidth
                        component={Link}
                        to={`/challenges/${challenge.id}`}
                        startIcon={getStatusIcon(progress?.status)}
                        sx={{
                          borderRadius: 2,
                          py: 1,
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
          
          {/* Pagination */}
          {filteredChallenges.length > itemsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Pagination
                count={Math.ceil(filteredChallenges.length / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Challenges; 