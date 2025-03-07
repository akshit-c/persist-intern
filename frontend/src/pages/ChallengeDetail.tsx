import {
    ArrowBack as ArrowBackIcon,
    BookmarkBorder as BookmarkBorderIcon,
    Bookmark as BookmarkIcon,
    CheckCircle as CheckCircleIcon,
    PlayArrow as PlayArrowIcon,
    Schedule as ScheduleIcon,
    Send as SendIcon,
    Share as ShareIcon,
    Star as StarIcon,
    Timer as TimerIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import {
    alpha,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Grid,
    IconButton,
    Paper,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { challengeService } from '../services/api';
import { Challenge, Submission } from '../types';

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
      id={`challenge-tabpanel-${index}`}
      aria-labelledby={`challenge-tab-${index}`}
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
    id: `challenge-tab-${index}`,
    'aria-controls': `challenge-tabpanel-${index}`,
  };
}

const ChallengeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [solution, setSolution] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch challenge details
        const challengeData = await challengeService.getChallengeById(parseInt(id));
        setChallenge(challengeData);
        
        // Set initial solution from code template
        if (challengeData.code_template) {
          setSolution(challengeData.code_template);
        }
        
        // Fetch submissions
        const submissionsResponse = await challengeService.getSubmissions();
        const challengeSubmissions = submissionsResponse.results?.filter(
          (s) => s.challenge.id === parseInt(id)
        ) || [];
        setSubmissions(challengeSubmissions);
        
        // Check if bookmarked
        const savedBookmarks = localStorage.getItem('bookmarkedChallenges');
        if (savedBookmarks) {
          const bookmarks = JSON.parse(savedBookmarks);
          setIsBookmarked(bookmarks.includes(parseInt(id)));
        }
        
        // Set start time if not already set
        const savedStartTime = localStorage.getItem(`challenge_${id}_start_time`);
        if (savedStartTime) {
          setStartTime(new Date(savedStartTime));
        } else {
          const now = new Date();
          setStartTime(now);
          localStorage.setItem(`challenge_${id}_start_time`, now.toISOString());
        }
        
      } catch (err) {
        console.error('Error fetching challenge:', err);
        setError('Failed to load challenge');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleSolutionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSolution(event.target.value);
  };
  
  const handleSubmit = async () => {
    if (!id || !solution.trim()) return;
    
    try {
      setSubmitting(true);
      setError('');
      
      // Submit solution
      await challengeService.submitChallenge(parseInt(id), solution);
      
      // Refresh submissions
      const submissionsResponse = await challengeService.getSubmissions();
      const challengeSubmissions = submissionsResponse.results?.filter(
        (s) => s.challenge.id === parseInt(id)
      ) || [];
      setSubmissions(challengeSubmissions);
      
      // Clear start time
      localStorage.removeItem(`challenge_${id}_start_time`);
      setStartTime(null);
      
    } catch (err) {
      console.error('Error submitting solution:', err);
      setError('Failed to submit solution');
    } finally {
      setSubmitting(false);
    }
  };
  
  const toggleBookmark = () => {
    if (!id) return;
    
    const challengeId = parseInt(id);
    const savedBookmarks = localStorage.getItem('bookmarkedChallenges');
    let bookmarks: number[] = savedBookmarks ? JSON.parse(savedBookmarks) : [];
    
    if (isBookmarked) {
      bookmarks = bookmarks.filter(id => id !== challengeId);
    } else {
      bookmarks.push(challengeId);
    }
    
    localStorage.setItem('bookmarkedChallenges', JSON.stringify(bookmarks));
    setIsBookmarked(!isBookmarked);
  };
  
  const getElapsedTime = () => {
    if (!startTime) return '00:00:00';
    
    const now = new Date();
    const elapsed = now.getTime() - startTime.getTime();
    
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const getDifficultyColor = (difficulty?: string) => {
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
      case 'correct':
      case 'completed':
        return 'success';
      case 'incorrect':
      case 'submitted':
        return 'warning';
      case 'started':
        return 'info';
      default:
        return 'default';
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!challenge) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Challenge not found
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/challenges"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Back to Challenges
        </Button>
      </Box>
    );
  }
  
  const latestSubmission = submissions.length > 0 ? submissions[0] : null;
  const isCompleted = latestSubmission?.status === 'correct';
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="text"
          component={Link}
          to="/challenges"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Challenges
        </Button>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="h4" fontWeight={700}>
              {challenge.title}
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={isBookmarked ? "Remove bookmark" : "Bookmark challenge"}>
                <IconButton
                  onClick={toggleBookmark}
                  sx={{ 
                    color: isBookmarked ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Share challenge">
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 1 }}>
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
          
          <Chip
            icon={<StarIcon fontSize="small" />}
            label={`${challenge.points} points`}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 1 }}
          />
          
          {latestSubmission && (
            <Chip
              icon={getStatusIcon(latestSubmission.status)}
              label={latestSubmission.status}
              color={getStatusColor(latestSubmission.status) as any}
              size="small"
              sx={{ fontWeight: 500, borderRadius: 1 }}
            />
          )}
          
          {startTime && !isCompleted && (
            <Chip
              icon={<TimerIcon fontSize="small" />}
              label={getElapsedTime()}
              size="small"
              color="default"
              sx={{ borderRadius: 1 }}
            />
          )}
        </Box>
      </Box>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              height: '100%',
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="challenge tabs"
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
              <Tab label="Description" {...a11yProps(0)} />
              <Tab label="Submissions" {...a11yProps(1)} disabled={submissions.length === 0} />
              <Tab label="Hints" {...a11yProps(2)} />
            </Tabs>
            
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ typography: 'body1' }}>
                <ReactMarkdown
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {challenge.content || challenge.description}
                </ReactMarkdown>
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              {submissions.length === 0 ? (
                <Typography color="text.secondary">
                  No submissions yet.
                </Typography>
              ) : (
                <Box>
                  {submissions.map((submission) => (
                    <Card
                      key={submission.id}
                      elevation={0}
                      sx={{
                        mb: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Chip
                            label={submission.status}
                            color={getStatusColor(submission.status) as any}
                            size="small"
                            sx={{ fontWeight: 500, borderRadius: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(submission.submitted_at).toLocaleString()}
                          </Typography>
                        </Box>
                        
                        <SyntaxHighlighter
                          style={atomDark}
                          language="javascript"
                          customStyle={{
                            borderRadius: 8,
                            maxHeight: 200,
                            fontSize: 14,
                          }}
                        >
                          {submission.content}
                        </SyntaxHighlighter>
                        
                        {submission.feedback && (
                          <Box sx={{ mt: 2 }}>
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
                  ))}
                </Box>
              )}
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Typography variant="body1" color="text.secondary">
                No hints available for this challenge yet.
              </Typography>
            </TabPanel>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Your Solution
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={15}
              variant="outlined"
              value={solution}
              onChange={handleSolutionChange}
              disabled={isCompleted || submitting}
              InputProps={{
                sx: {
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  backgroundColor: '#1e1e1e',
                  color: '#d4d4d4',
                  borderRadius: 2,
                },
              }}
              sx={{ mb: 2, flexGrow: 1 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
              <Button
                variant="outlined"
                onClick={() => setSolution(challenge.code_template || '')}
                disabled={isCompleted || submitting}
              >
                Reset
              </Button>
              
              <Button
                variant="contained"
                color={isCompleted ? 'success' : 'primary'}
                endIcon={isCompleted ? <CheckCircleIcon /> : <SendIcon />}
                onClick={handleSubmit}
                disabled={isCompleted || submitting || !solution.trim()}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                {submitting ? 'Submitting...' : isCompleted ? 'Completed' : 'Submit Solution'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChallengeDetail; 