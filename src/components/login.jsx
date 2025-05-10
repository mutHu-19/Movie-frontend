import React from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';

const AuthDialog = ({ open, onClose, isSignIn, toggleAuthMode, onLogin }) => {
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  // Add the missing handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const endpoint = isSignIn ? 'https://movie-backend-sand.vercel.app/api/users/login' : 'https://movie-backend-sand.vercel.app/api/users/register';
      const payload = isSignIn 
        ? { email: formData.email, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      const response = await axios.post(endpoint, payload);
      
      // Store complete user data in localStorage
      const userData = { 
        id: response.data.id,
        username: response.data.username, 
        email: response.data.email,
        token: response.data.token 
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setSuccess(isSignIn 
        ? `Welcome back, ${response.data.username}!` 
        : `Account created for ${response.data.username}!`);

      // Pass the complete user data to parent component
      onLogin(userData);
      
      setTimeout(() => {
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        onClose();
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #0f0c29, #302b63)',
          color: 'white',
          borderRadius: '12px'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Movie Explorer
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ mt: 2 }}
        >
          {!isSignIn && (
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
              required
              InputProps={{
                sx: { 
                  color: 'white',
                  borderRadius: '8px'
                }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255,255,255,0.7)' }
              }}
            />
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            required
            InputProps={{
              sx: { 
                color: 'white',
                borderRadius: '8px'
              }
            }}
            InputLabelProps={{
              sx: { color: 'rgba(255,255,255,0.7)' }
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            required
            InputProps={{
              sx: { 
                color: 'white',
                borderRadius: '8px'
              }
            }}
            InputLabelProps={{
              sx: { color: 'rgba(255,255,255,0.7)' }
            }}
          />

          {!isSignIn && (
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="outlined"
              required
              InputProps={{
                sx: { 
                  color: 'white',
                  borderRadius: '8px'
                }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255,255,255,0.7)' }
              }}
            />
          )}

          <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />

          <DialogActions sx={{ justifyContent: 'center', pt: 0 }}>
            <Button 
              type="submit" 
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1rem',
                background: 'linear-gradient(45deg,rgb(20, 37, 184) 30%,rgb(83, 157, 255) 90%)',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s'
                },
                '&:disabled': {
                  background: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {loading ? 'PROCESSING...' : isSignIn ? 'SIGN IN' : 'SIGN UP'}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>

      <Box sx={{ textAlign: 'center', pb: 4 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          {isSignIn ? "Don't have an account? " : "Already have an account? "}
          <Button 
            onClick={toggleAuthMode}
            disabled={loading}
            sx={{ 
              color: '#FF8E53',
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              minWidth: 'unset',
              p: 0,
              ml: 0.5
            }}
          >
            {isSignIn ? 'Sign up' : 'Sign in'}
          </Button>
        </Typography>
      </Box>

      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AuthDialog;