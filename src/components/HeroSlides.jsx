// src/components/HeroSlide.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import '../index.css';

const HeroSlide = ({ movies }) => {
  return (
    <div className="hero-slide">
      <Swiper slidesPerView={1} loop autoplay={{ delay: 3000 }}>
        {movies.map((movie) => (
          <SwiperSlide key={movie._id}>
            <div
              className="hero-slide-item"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              }}
            >
              <div className="overlay">
                <h2>{movie.title}</h2>
                <p>{movie.overview?.substring(0, 120)}...</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlide;
