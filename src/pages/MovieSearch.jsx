import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';

const MoviesPage = ({ query, genre, year, rating }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Add useNavigate hook

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        // Construct query params
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (genre) params.append('genre', genre);
        if (year) params.append('year', year);
        if (rating) params.append('rating', rating);
        
        const url = `https://movie-backend-six.vercel.app/api/tmdb/search?${params.toString()}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query, genre, year, rating]);

  // Function to handle movie click
  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`); // Navigate to movie details page
  };

  if (loading) {
    return <div>Loading movies...</div>;
  }

  return (
    <div style={{ paddingTop: '100px' }}>
      {loading ? (
        <div>Loading movies...</div>
      ) : movies.length === 0 ? (
        <div>No movies found. Try different search criteria.</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          padding: '0 20px'
        }}>
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              onClick={() => handleMovieClick(movie.id)} 
              style={{
                width: '100%',
                boxShadow: '0 2px 8px rgba(145, 143, 143, 0.7)',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer', 
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: "translateY(-5px)",
                  boxShadow: "0 4px 8px rgba(66, 66, 66, 0.7)",
                }
              }}
            >
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                style={{ width: '100%', height: 'auto' }}
                onError={(e) => {
                  e.target.src = '/placeholder-poster.jpg'; // Fallback image
                }}
              />
              <div style={{ padding: '10px' }}>
                <h3 style={{ margin: '0', fontSize: '16px' }}>{movie.title}</h3>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  {movie.release_date && movie.release_date.substring(0,4)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoviesPage;