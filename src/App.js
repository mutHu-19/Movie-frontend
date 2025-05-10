import React, { useMemo, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import AppRoutes from './AppRoutes';
import Header from './components/Header';

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

  const navigate = useNavigate(); // Use useNavigate

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    navigate('/search'); // Trigger route change
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header toggleTheme={toggleTheme} mode={mode} user={user} setUser={setUser} onSearch={handleSearch} />
      <AppRoutes user={user} searchQuery={searchQuery} />
    </ThemeProvider>
  );
};

export default App;
