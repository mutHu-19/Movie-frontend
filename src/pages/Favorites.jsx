import React, { useState, useEffect } from "react";
import {
  Box, Typography, Container, Grid, Card, CardMedia,
  CardContent, CardActions, Button, IconButton, useTheme
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const loadFavorites = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.username) {
        const storedData = localStorage.getItem(`favorites_${user.username}`);
        setFavorites(JSON.parse(storedData) || []);
      }
    };
    loadFavorites();
    window.addEventListener('storage', loadFavorites);
    return () => window.removeEventListener('storage', loadFavorites);
  }, []);

  const handleRemoveFavorite = (movieId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.username) return;

    const updatedFavorites = favorites.filter((movie) => movie.id !== movieId);
    setFavorites(updatedFavorites);
    localStorage.setItem(`favorites_${user.username}`, JSON.stringify(updatedFavorites));
  };

  const getImageUrl = (path) => {
    if (!path) return "/placeholder-poster.jpg";
    if (path.startsWith("http")) return path;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}> {/* Changed from xl to lg for narrower container */}
      <Typography variant="h4" component="h1" sx={{ 
        mb: 4, 
        fontWeight: "bold", 
        color: "text.primary",
        fontSize: "2rem",
        textTransform: "uppercase"
      }}>
        Favorites
      </Typography>

      {!user ? (
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Please log in to view your favorites
          </Typography>
          <Button variant="contained" component={Link} to="/login" sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
      ) : favorites.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Your favorites list is empty
          </Typography>
          <Button variant="contained" component={Link} to="/" sx={{ mt: 2 }}>
            Browse Movies
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}> {/* Reduced spacing from 4 to 3 */}
          {favorites.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4}>
              <Card sx={{ 
                height: "100%", 
                display: "flex", 
                flexDirection: "column",
                backgroundColor: theme.palette.background.paper,
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(41, 41, 41, 0.7)",
                transition: "transform 0.3s",
                maxWidth: "280px", 
                margin: "0 auto", 
                '&:hover': {
                  transform: "translateY(-5px)",
                  boxShadow: "0 4px 8px rgba(66, 66, 66, 0.7)",
                }
              }}>
                <CardMedia
                  component="img"
                  image={getImageUrl(movie.poster || movie.poster_path)}
                  alt={movie.title}
                  sx={{ 
                    height: "220px", 
                    width: "100%",
                    objectFit: "cover",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px"
                  }}
                  onError={(e) => {
                    e.target.src = "/placeholder-poster.jpg";
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="h2"
                    sx={{ 
                      fontWeight: "bold",
                      fontSize: "1.2rem", 
                      mb: 1,
                      lineHeight: 1.3
                    }}
                  >
                    {movie.title}
                    {movie.release_date && (
                      <span> ({new Date(movie.release_date).getFullYear()})</span>
                    )}
                  </Typography>
                  
                  {movie.genres && (
                    <Typography 
                      variant="subtitle1" 
                      component="h3"
                      sx={{ 
                        color: theme.palette.text.secondary,
                        mb: 1.5, 
                        fontStyle: "italic",
                        fontSize: "0.8rem" 
                      }}
                    >
                      {movie.genres.slice(0, 3).map((genre, index) => (
                        <span key={genre.id || genre}>
                          {genre.name || genre}
                          {index < movie.genres.slice(0, 3).length - 1 ? " • " : ""}
                        </span>
                      ))}
                    </Typography>
                  )}
                  
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                      mt: 1,
                      fontSize: "0.85rem", 
                      lineHeight: 1.4
                    }}
                  >
                    {movie.overview ? `${movie.overview.substring(0, 100)}...` : "No overview available."}
                  </Typography>
                </CardContent>
                <CardActions sx={{ 
                  justifyContent: "space-between", 
                  p: "0 12px 12px 12px", // Reduced padding
                  mt: "auto"
                }}>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to={`/movie/${movie.id}`}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "#fff",
                      borderRadius: "4px",
                      px: 2, // Reduced padding
                      py: 0.5, // Reduced padding
                      textTransform: "uppercase",
                      fontSize: "0.8rem", // Smaller font size
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark
                      }
                    }}
                  >
                    View Details
                  </Button>
                  <IconButton 
                    onClick={() => handleRemoveFavorite(movie.id)}
                    sx={{ 
                      color: theme.palette.error.main,
                      '&:hover': {
                        backgroundColor: "rgba(244, 67, 54, 0.1)"
                      }
                    }}
                  >
                    <FavoriteIcon fontSize="small" /> {/* Smaller icon */}
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FavoritesPage;