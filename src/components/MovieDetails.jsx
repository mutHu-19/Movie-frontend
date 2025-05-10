import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Chip,
  Button,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Snackbar,
  useTheme,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MuiAlert from "@mui/material/Alert";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const user = JSON.parse(localStorage.getItem("user"));
  const theme = useTheme();

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `https://movie-backend-six.vercel.app/api/tmdb/movie/${id}`
        );
        console.log(response.data);
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );
  }

  if (!movie) {
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        No movie data available
      </Typography>
    );
  }

  const handleAddToFavorites = (movie) => {
    if (!user) {
      setSnackbarMessage("You need to be logged in to add movies to favorites.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const storageKey = `favorites_${user.username}`;
    const storedFavorites = JSON.parse(localStorage.getItem(storageKey)) || [];
    const alreadyExists = storedFavorites.some((fav) => fav.id === movie.id);

    if (!alreadyExists) {
      const updatedFavorites = [...storedFavorites, movie];
      localStorage.setItem(storageKey, JSON.stringify(updatedFavorites));
      setSnackbarMessage(`${movie.title} added to favorites!`);
      setSnackbarSeverity("success");
    } else {
      setSnackbarMessage(`${movie.title} is already in favorites.`);
      setSnackbarSeverity("info");
    }
    setSnackbarOpen(true);
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        py: { xs: 4, md: 8 },
        px: 2,
        overflow: "hidden",
        backgroundColor: theme.palette.mode === "light" ? "#f5f5f5" : "inherit",
      }}
    >
      {/* Background Image with Conditional Blur */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${movie.poster || "/placeholder-poster.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: theme.palette.mode === "dark" ? "blur(8px)" : "none",
          zIndex: 0,
        }}
      />

      {/* Conditional Dark Overlay  */}
      {theme.palette.mode === "dark" && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 1,
          }}
        />
      )}
       {/* Conditional light Overlay  */}
      {theme.palette.mode === "light" && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(216, 216, 216, 0.7)",
            zIndex: 1,
          }}
        />
      )}


      {/* Content Container */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(80, 80, 80, 0.9)"
                : "rgba(255, 255, 255, 0.95)",
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
          }}
        >
          {/* Poster Image */}
          <Box
            sx={{
              flex: { md: 1 },
              minHeight: { xs: "400px", md: "600px" },
              backgroundImage: `url(${movie.poster || "/placeholder-poster.jpg"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Content - Right Side */}
          <Box
            sx={{
              flex: { md: 1 },
              p: { xs: 3, md: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Title */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                mb: 2,
                color: "text.primary",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              {movie.title}{" "}
              {movie.release_date && new Date(movie.release_date).getFullYear()}
            </Typography>

            {/* Genre */}
            <Stack direction="row" spacing={1} mb={3}>
              {movie.genres?.slice(0, 2).map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(0,0,0,0.1)"
                        : "rgba(0,0,0,0.05)",
                    color: "text.primary",
                    fontWeight: "medium",
                  }}
                />
              ))}
            </Stack>

            {movie.rating != null && movie.rating !== "" ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body1" sx={{ color: "text.primary" }}>
                  Rating: {movie.rating}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Rating not available
              </Typography>
            )}

       
            <Divider sx={{ my: 2 }} />

           
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                fontSize: "1.1rem",
                lineHeight: 1.7,
                color: "text.secondary",
              }}
            >
              {movie.overview}
            </Typography>

            {/* Watch Now + Favorite Button */}
            <Box sx={{ mt: 4, display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  borderRadius: "4px",
                  textTransform: "none",
                  backgroundColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
                href={movie.trailer}
                target="_blank"
              >
                WATCH NOW
              </Button>

              <Tooltip title="Add to Favorites">
                <IconButton
                  color="secondary"
                  onClick={() => handleAddToFavorites(movie)}
                >
                  <FavoriteIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {movie.cast && movie.cast.length > 0 ? (
              <Box sx={{ mt: 5 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    color: "text.primary",
                    textDecoration: "underline",
                    textDecorationColor: "rgba(62, 164, 248, 0.8)",
                  }}
                >
                  Cast
                </Typography>

                <Stack direction="row" spacing={2} overflow="auto" py={2}>
                  {movie.cast.map((actor, index) => (
                    <Box key={index} sx={{ textAlign: "center", minWidth: "120px" }}>
                      <img
                        src={actor.profileImage}
                        alt={actor.name}
                        style={{
                          borderRadius: "50%",
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          marginBottom: "8px",
                        }}
                        onError={(e) => {
                          e.target.src = "/placeholder-profile.jpg";
                        }}
                      />
                      <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
                        <strong>{actor.name}</strong>
                      </Typography>
                      <Typography sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                        as {actor.character}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            ) : (
              <Typography sx={{ mt: 4, color: "text.secondary" }}>
                No cast information available.
              </Typography>
            )}
          </Box>
        </Box>
      </Container>

      {/* Snackbar for Favorites */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MovieDetails;