import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchBar from './SearchBar';
import AuthDialog from './login';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Favorites', path: '/favorites' },
];

const Header = ({ toggleTheme, mode = 'dark', onSearch }) => { // Set default mode to 'dark'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [user, setUser] = useState(null);  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));  
    }
  }, []);

  const handleAuthDialogOpen = (mode = 'signin') => {
    setAuthMode(mode);
    setAuthDialogOpen(true);
  };

  const handleAuthDialogClose = () => {
    setAuthDialogOpen(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);  
    localStorage.setItem('user', JSON.stringify(userData)); 
    handleAuthDialogClose();  
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/'; 
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen); 
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');  
  };

  const drawer = (
    <Box
      sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%' }}
      onClick={handleDrawerToggle}
    >
      <List>
        {navLinks.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          onClick={(e) => {
            e.stopPropagation();
            toggleTheme();
          }}
        >
          {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
        </Button>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={(e) => {
            e.stopPropagation();
            user ? handleLogout() : handleAuthDialogOpen('signin');
          }}
        >
          {user ? 'Log Out' : 'Sign In'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        color="default" 
        sx={{ 
          boxShadow: 2, 
          px: 3, 
          py: 1,
          backgroundColor: mode === 'dark' ? theme.palette.grey[900] : theme.palette.background.paper
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left: Logo & menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              component={Link}
              to="/"
              variant="h6"
              sx={{
                textDecoration: 'none',
                color: mode === 'dark' ? 'common.white' : 'primary.main',
                fontWeight: 'bold',
                fontSize: '1.5rem',
              }}
            >
              Movie Explore
            </Typography>
          </Box>

          {/* Center nav links on desktop */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 3 }}>
              {navLinks.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  sx={{ 
                    color: mode === 'dark' ? 'common.white' : 'text.primary',
                    '&:hover': {
                      backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
          
          {/* Right: Search + Theme + Auth */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: isMobile ? '50%' : 'auto',
            }}
          >
            <SearchBar onSearch={onSearch} />

            {!isMobile && (
              <>
                <Button
                  variant="outlined"
                  sx={{ 
                    color: mode === 'dark' ? 'common.white' : 'text.primary',
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)'
                  }}
                  startIcon={mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                  onClick={toggleTheme}
                >
                  {mode === 'dark' ? 'Light' : 'Dark'}
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => user ? handleLogout() : handleAuthDialogOpen('signin')}
                >
                  {user ? 'Log Out' : 'Sign In'}
                </Button>

                {user && (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mx: 2,
                      color: mode === 'dark' ? 'common.white' : 'text.primary'
                    }}
                  >
                    Hello, {user.username || user.email || 'User'}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>

      <AuthDialog
        open={authDialogOpen}
        onClose={handleAuthDialogClose}
        isSignIn={authMode === 'signin'}
        toggleAuthMode={() => setAuthMode((prev) => (prev === 'signin' ? 'signup' : 'signin'))}
        onLogin={handleLogin}
      />
    </>
  );
};

export default Header;