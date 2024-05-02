import React, { useEffect, useState } from "react";
import axios from "axios";
import "../components/cssComponents/searchBar.css";
import "./css/watchfolioWeb.css";
import { useNavigate } from 'react-router-dom';


interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const SearchBar = () => {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const APITMDB = "172e0af0e176f9c169387e094fb67c75";
  const navigate = useNavigate();


  const fetchFeaturedMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${APITMDB}&language=pt-BR&page=1`
      );
      setFeaturedMovies(response.data.results);
    } catch (error) {
      console.error("Erro ao buscar filmes em destaque:", error);
    }
  };

  const fetchUpcomingMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${APITMDB}&language=pt-BR&page=1,2,3`
      );
      setUpcomingMovies(response.data.results);
    } catch (error) {
      console.error("Erro ao buscar lançamentos de filmes:", error);
    }
  };

  const fetchMovies = async (query: string) => {
    if (!query) {
      setMovies([]);
      setIsOpen(false);
      return;
    }
    try {
      const result = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${APITMDB}&query=${query}`
      );
      setMovies(result.data.results);
      setIsOpen(true);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    fetchFeaturedMovies();
    fetchUpcomingMovies();
  }, []);

  return (
    <div className="content">
      <div className="Watchfolio-Header">
        <div className="search-bar">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              fetchMovies(e.target.value);
            }}
            placeholder="Digite o nome do filme"
            onBlur={() => setTimeout(() => setIsOpen(false), 100)}
            onFocus={() => query && setIsOpen(true)}
          />
          {isOpen && (
            <ul>
              {movies.map((movie) => (
                <li
                  key={movie.id}
                  onClick={() => navigate(`/movie/${movie.id}`)}

                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    style={{ width: 50, height: 75 }}
                  />
                  {movie.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="movie-list">
        <section className="destaques">
          <h2>Destaques</h2>
          
          <div className="lista-de-filmes">
            {featuredMovies.map((movie) => (
              <li
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <p className="title-movie">{movie.title}</p>
              </li>
            ))}
          </div>

        </section>
        <section className="lancamentos">
          <h2>Lançamentos</h2>
          <div className="lista-de-filmes">
            {upcomingMovies.map((movie) => (
              <li
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
              > 
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <p className="title-movie">{movie.title}</p>
              </li>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SearchBar;
