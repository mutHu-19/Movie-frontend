import React, { useEffect, useState } from "react";
import axios from "axios";
import '../index.css';
import HeroSlide from "../components/HeroSlides.jsx";
import MovieCard from "../components/MovieCard.jsx";

const Home = () => {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axios.get("https://movie-backend-sand.vercel.app/api/tmdb/trending");
        setTrending(response.data);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    };

    fetchTrending();
  }, []);

  // Shuffle function (Fisher-Yates)
  const getRandomMovies = (movies, count = 5) => {
    const shuffled = [...movies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <div className="home">
      <HeroSlide movies={getRandomMovies(trending)} />
      <section className="section">
        <h2 className="section-title">Trending Movies</h2>
        <div className="movie-grid">
          {trending.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
