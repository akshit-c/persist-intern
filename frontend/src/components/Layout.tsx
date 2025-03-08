import {
    Code as CodeIcon,
    Dashboard as DashboardIcon,
    Leaderboard as LeaderboardIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    Notifications as NotificationIcon,
    Person as PersonIcon,
    EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Button,
    Container,
    Divider,
    Drawer,
    Fade,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ id: number; message: string; read: boolean }[]>([
    { id: 1, message: "New challenge available: React Hooks Mastery", read: false },
    { id: 2, message: "You've earned the 'Fast Learner' achievement!", read: false },
    { id: 3, message: "Your submission was approved", read: true },
  ]);
  
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };
  
  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    handleCloseUserMenu();
  };
  
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    
    setDrawerOpen(open);
  };

  const markNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  
  const drawerItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Challenges', icon: <CodeIcon />, path: '/challenges' },
    { text: 'Achievements', icon: <TrophyIcon />, path: '/achievements' },
    { text: 'Leaderboard', icon: <LeaderboardIcon />, path: '/leaderboard' },
  ];

  // Check if the current path matches the item path
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          color: 'text.primary'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 70 }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              CREATEATHON
            </Typography>

            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              CREATEATHON
            </Typography>
            
            {/* Desktop navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
              {drawerItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    mx: 1,
                    color: isActive(item.path) ? 'primary.main' : 'text.primary',
                    fontWeight: isActive(item.path) ? 700 : 500,
                    position: 'relative',
                    '&::after': isActive(item.path) ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '30%',
                      height: '3px',
                      backgroundColor: 'primary.main',
                      borderRadius: '3px 3px 0 0',
                    } : {},
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
            
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton 
                  onClick={handleOpenNotifications}
                  sx={{ 
                    mx: 1,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                >
                  <Badge badgeContent={unreadNotificationsCount} color="error">
                    <NotificationIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-notifications"
                anchorEl={anchorElNotifications}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElNotifications)}
                onClose={handleCloseNotifications}
                onClick={markNotificationsAsRead}
                TransitionComponent={Fade}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                    mt: 1.5,
                    width: 350,
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                <Typography sx={{ p: 2, fontWeight: 600 }}>Notifications</Typography>
                <Divider />
                {notifications.length === 0 ? (
                  <Typography sx={{ p: 2, color: 'text.secondary' }}>
                    No notifications
                  </Typography>
                ) : (
                  notifications.map((notification) => (
                    <MenuItem 
                      key={notification.id} 
                      onClick={handleCloseNotifications}
                      sx={{ 
                        py: 1.5,
                        px: 2,
                        borderLeft: notification.read ? 'none' : '3px solid',
                        borderLeftColor: 'primary.main',
                        backgroundColor: notification.read ? 'inherit' : 'rgba(58, 134, 255, 0.05)'
                      }}
                    >
                      <Typography variant="body2">{notification.message}</Typography>
                    </MenuItem>
                  ))
                )}
                {notifications.length > 0 && (
                  <>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                      <Button size="small">View All</Button>
                    </Box>
                  </>
                )}
              </Menu>

              {/* User menu */}
              <Tooltip title="Open settings">
                <IconButton 
                  onClick={handleOpenUserMenu} 
                  sx={{ 
                    p: 0, 
                    ml: 2,
                    border: '2px solid',
                    borderColor: 'primary.light',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                >
                  <Avatar
                    alt={user?.username}
                    src={user?.profile?.avatar || undefined}
                    sx={{ width: 36, height: 36 }}
                  >
                    {user?.first_name?.[0] || user?.username?.[0]}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                TransitionComponent={Fade}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                    mt: 1.5,
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {user?.first_name} {user?.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{user?.username}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Mobile drawer */}
      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 280,
            borderRadius: '0 16px 16px 0',
            padding: '16px 0',
          }
        }}
      >
        <Box
          sx={{ width: 280 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              CREATEATHON
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <List>
            {drawerItems.map((item) => (
              <ListItem 
                key={item.text} 
                component={Link} 
                to={item.path}
                sx={{
                  borderRadius: '0 50px 50px 0',
                  mr: 2,
                  mb: 0.5,
                  backgroundColor: isActive(item.path) ? 'rgba(58, 134, 255, 0.1)' : 'transparent',
                  color: isActive(item.path) ? 'primary.main' : 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(58, 134, 255, 0.05)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive(item.path) ? 600 : 400 
                  }} 
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 1 }} />
          <List>
            <ListItem 
              component={Link} 
              to="/profile"
              sx={{
                borderRadius: '0 50px 50px 0',
                mr: 2,
                mb: 0.5,
                backgroundColor: isActive('/profile') ? 'rgba(58, 134, 255, 0.1)' : 'transparent',
                color: isActive('/profile') ? 'primary.main' : 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(58, 134, 255, 0.05)',
                }
              }}
            >
              <ListItemIcon sx={{ color: isActive('/profile') ? 'primary.main' : 'inherit' }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem 
              onClick={handleLogout}
              sx={{
                borderRadius: '0 50px 50px 0',
                mr: 2,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(58, 134, 255, 0.05)',
                }
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 10, sm: 12 },
          pb: 4,
          px: { xs: 2, sm: 4, md: 6 },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </>
  );
};

export default Layout; 