import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Footer from "./components/Footer";
import MovieDetails from "./components/MovieDetails";
import MoviesPage from "./pages/MovieSearch";
const AppRoutes = ({ user, searchQuery  }) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />{" "}
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/movie/:id" element={<MovieDetails user={user} />} />
<Route path="/search" element={<MoviesPage query={searchQuery} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default AppRoutes;
