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
  Alert,
  CircularProgress
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

   const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  const validateForm = () => {
    const { email, password, confirmPassword, username } = formData;
    
    if (!isSignIn) {
      if (password !== confirmPassword) {
        setError("Passwords don't match");
        return false;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
      if (!username.trim()) {
        setError("Username is required");
        return false;
      }
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const baseUrl = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://movie-backend-sand.vercel.app';

const endpoint = isSignIn 
  ? `${baseUrl}/api/users/login`
  : `${baseUrl}/api/users/register`;
      
      const payload = isSignIn 
        ? { email: formData.email, password: formData.password }
        : { 
            username: formData.username, 
            email: formData.email, 
            password: formData.password 
          };

      const { data } = await axios.post(endpoint, payload, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!data?.token) throw new Error('Authentication failed');
      
      const userData = { 
        id: data._id,
        username: data.username, 
        email: data.email,
        token: data.token 
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setSuccess(isSignIn 
        ? `Welcome back, ${data.username}!` 
        : `Account created for ${data.username}!`);

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
      const errorMsg = err.response?.data?.message || 
                      err.message || 
                      'Authentication failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
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
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress size={24} sx={{ color: 'white', mr: 2 }} />
                  Processing...
                </Box>
              ) : isSignIn ? 'SIGN IN' : 'SIGN UP'}
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