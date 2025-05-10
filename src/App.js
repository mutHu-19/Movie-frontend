import React, { useMemo, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Header from './components/Header';
import { Box } from '@mui/material'; 

const App = () => {
  const [mode, setMode] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const navigate = useNavigate();

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    navigate('/search');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header toggleTheme={toggleTheme} mode={mode} user={user} setUser={setUser} onSearch={handleSearch} />
    
      <Box
        component="main"
        sx={{
          pt: { xs: '56px', sm: '64px' },  
          minHeight: 'calc(100vh - 56px)', 
          [theme.breakpoints.up('sm')]: {
            minHeight: 'calc(100vh - 64px)',  
          },
        }}
      >
        <AppRoutes user={user} searchQuery={searchQuery} />
      </Box>
    </ThemeProvider>
  );
};

export default App;