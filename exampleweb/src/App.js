import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";

const API_KEY = "7df6579";
const BASE_URL = "https://www.omdbapi.com";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <Link to="/" className="logo">IMDB Clone</Link>
        </header>
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("avengers");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovies(search);
  }, []);

  const fetchMovies = (query) => {
    setLoading(true);
    setError(null);
    axios
      .get(`${BASE_URL}/?apikey=${API_KEY}&s=${query}&type=movie`)
      .then((res) => {
        if (res.data.Response === "True") {
          setMovies(res.data.Search);
        } else {
          setError(res.data.Error);
          setMovies([]);
        }
      })
      .catch(() => setError("Failed to fetch data"))
      .finally(() => setLoading(false));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies(search);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search movies..."
        />
        <button type="submit">Search</button>
      </form>

      {loading && <div className="loading">Loading movies...</div>}
      {error && <div className="error">{error}</div>}

      <div className="movie-list">
        {movies.map((movie) => (
          <Link key={movie.imdbID} to={`/movie/${movie.imdbID}`} className="movie-card">
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"}
              alt={movie.Title}
            />
            <h3>{movie.Title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MovieDetail() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = window.location.pathname.split("/")[2];

  useEffect(() => {
    axios
      .get(`${BASE_URL}/?apikey=${API_KEY}&i=${id}&plot=full`)
      .then((res) => {
        if (res.data.Response === "True") {
          setMovie(res.data);
        } else {
          setError(res.data.Error);
        }
      })
      .catch(() => setError("Failed to fetch movie details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">Loading movie details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="movie-detail">
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"}
        alt={movie.Title}
      />
      <h1>{movie.Title} ({movie.Year})</h1>
      <p>{movie.Plot}</p>
      <p><strong>Director:</strong> {movie.Director}</p>
      <p><strong>Actors:</strong> {movie.Actors}</p>
      <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
    </div>
  );
}

export default App;
