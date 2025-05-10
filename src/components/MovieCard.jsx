import React from "react";
import { Card, CardMedia, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const { title, poster_path, release_date, vote_average, id } = movie;
  const rating = vote_average;
  console.log("Rating:", rating);
  

  return (
    <Link to={`/movie/${id}`} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: 3,
          cursor: "pointer",
          "&:hover .infoBox": {
            opacity: 1,
            transform: "translateY(0)",
          },
        }}
      >
        <CardMedia
          component="img"
          image={`https://image.tmdb.org/t/p/w500${poster_path}`}
          alt={title}
          sx={{
            width: "100%",
            height: "100%",
            transition: "transform 0.3s",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        />
        <Box
  className="infoBox"
  sx={{
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    px: 2,
    py: 1,
    bgcolor: "rgba(0, 0, 0, 0.6)",
    color: "#fff",
    opacity: 0,
    transform: "translateY(10px)",
    transition: "all 0.3s ease-in-out",
  }}
>
  <Typography variant="subtitle1" fontWeight="bold" noWrap>
    {title}
  </Typography>
  <Typography variant="caption">
    {release_date?.split("-")[0]}
  </Typography>
  <Typography
    variant="caption"
    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
  >
    <span role="img" aria-label="star">⭐</span> {rating?.toFixed(1)}
  </Typography>
</Box>


      </Card>
    </Link>
  );
};

export default MovieCard;
