import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "../components/cssComponents/searchBar.css";
import "./css/watchfolioWeb.css";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TMDB_API_KEY, TMDB_BASE_URL } from '../config/api.ts';
import { 
  faSearch, 
  faChevronLeft, 
  faChevronRight, 
  faStar, 
  faFire, 
  faClock, 
  faHeart, 
  faAward, 
  faFilm, 
  faCompass, 
  faInfoCircle, 
  faPlay 
} from "@fortawesome/free-solid-svg-icons";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average: number;
  genre_ids: number[];
  overview?: string;
  release_date?: string;
}

interface Genre {
  id: number;
  name: string;
}

const WatchfolioWeb = () => {
  // Estados principais
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [dramaMovies, setDramaMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Estados para o slider
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Referencias
  const featuredRef = useRef<HTMLDivElement>(null);
  const upcomingRef = useRef<HTMLDivElement>(null);
  const topRatedRef = useRef<HTMLDivElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const dramaRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();

  // Mapear gêneros para nomes
  const getGenreNames = useCallback((genreIds: number[]): string[] => {
    return genreIds
      .map(id => genres.find(genre => genre.id === id)?.name)
      .filter(name => name !== undefined) as string[];
  }, [genres]);

  // Funções para buscar filmes
  const fetchGenres = async () => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=pt-BR`
      );
      setGenres(response.data.genres);
    } catch (error) {
      console.error("Erro ao buscar gêneros:", error);
    }
  };

  const fetchFeaturedMovies = async () => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`
      );
      setFeaturedMovies(response.data.results);
      
      // Seleciona os 5 primeiros filmes para o slider, com detalhes extras
      const heroMoviesIds = response.data.results.slice(0, 5).map((movie: Movie) => movie.id);
      const heroMoviesWithDetails = await Promise.all(
        heroMoviesIds.map(async (id: number) => {
          const detailsResponse = await axios.get(
            `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=pt-BR`
          );
          return detailsResponse.data;
        })
      );
      setHeroMovies(heroMoviesWithDetails);
    } catch (error) {
      console.error("Erro ao buscar filmes em destaque:", error);
    }
  };

  const fetchUpcomingMovies = async () => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`
      );
      setUpcomingMovies(response.data.results);
    } catch (error) {
      console.error("Erro ao buscar lançamentos de filmes:", error);
    }
  };

  const fetchTopRatedMovies = async () => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`
      );
      setTopRatedMovies(response.data.results);
    } catch (error) {
      console.error("Erro ao buscar filmes bem avaliados:", error);
    }
  };

  const fetchMoviesByGenre = async (genreId: number) => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&with_genres=${genreId}&sort_by=popularity.desc`
      );
      if (genreId === 28) { // Ação
        setActionMovies(response.data.results);
      } else if (genreId === 18) { // Drama
        setDramaMovies(response.data.results);
      } else if (selectedGenre === genreId) {
        setActionMovies(response.data.results);
      }
    } catch (error) {
      console.error(`Erro ao buscar filmes do gênero ${genreId}:`, error);
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
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=pt-BR&query=${query}`
      );
      setMovies(result.data.results);
      setIsOpen(true);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      setIsOpen(false);
    }
  };

  // Funções para gerenciar o slider
  const nextSlide = useCallback(() => {
    setCurrentSlide(current => (current + 1) % heroMovies.length);
  }, [heroMovies.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(current => (current - 1 + heroMovies.length) % heroMovies.length);
  }, [heroMovies.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const startSlideShow = useCallback(() => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    slideInterval.current = setInterval(() => {
      nextSlide();
    }, 5000);
  }, [nextSlide]);

  const stopSlideShow = useCallback(() => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      slideInterval.current = null;
    }
  }, []);
  
  // Funções de UI e interação
  const handleGenreSelect = (genreId: number) => {
    setSelectedGenre(genreId);
    fetchMoviesByGenre(genreId);
    if (genreRef.current) {
      genreRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scroll = useCallback((ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { scrollWidth, clientWidth } = ref.current;
      const scrollAmount = clientWidth * 0.85;
      const maxScroll = scrollWidth - clientWidth;
      const currentScroll = ref.current.scrollLeft;

      let newScroll;
      if (direction === 'left') {
        newScroll = Math.max(0, currentScroll - scrollAmount);
      } else {
        newScroll = Math.min(maxScroll, currentScroll + scrollAmount);
      }
      
      ref.current.scrollTo({ left: newScroll, behavior: 'smooth' });
    }
  }, []);

  // Função para truncar texto
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Função para renderizar cartões de filmes com lazy loading
  const renderMovieCards = (movies: Movie[], onClick: (id: number) => void) => {
    return movies.map((movie) => (
      <div
        className="movie-card"
        key={movie.id}
      >
        <div className="movie-rating">
          <FontAwesomeIcon icon={faStar} /> {movie.vote_average.toFixed(1)}
        </div>
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
            onClick={() => onClick(movie.id)}
          />
        ) : (
          <div className="no-poster" onClick={() => onClick(movie.id)}>
            <FontAwesomeIcon icon={faFilm} size="2x" />
          </div>
        )}
        <p className="title-movie">{movie.title}</p>
        {movie.genre_ids && movie.genre_ids.length > 0 && (
          <div className="movie-genre">
            {getGenreNames(movie.genre_ids.slice(0, 2)).join(' • ')}
          </div>
        )}
        <button 
          className="details-btn" 
          onClick={() => onClick(movie.id)}
        >
          <FontAwesomeIcon icon={faInfoCircle} /> Detalhes
        </button>
      </div>
    ));
  };

  // Componente para lista de filmes com scroll
  const MovieSection = ({ 
    title, 
    icon, 
    movies, 
    reference 
  }: { 
    title: string; 
    icon: any; 
    movies: Movie[]; 
    reference: React.RefObject<HTMLDivElement> 
  }) => (
    <section className={title.toLowerCase().replace(/\s+/g, '-')}>
      <h2 className="section-title">
        <FontAwesomeIcon icon={icon} /> {title}
      </h2>
      <div className="lista-de-filmes-container">
        <div className="lista-de-filmes" ref={reference}>
          {renderMovieCards(movies, (id) => navigate(`/movie/${id}`))}
        </div>
        <div className="scroll-indicator"></div>
      </div>
      <div className="scroll-buttons">
        <button className="scroll-button" onClick={() => scroll(reference, 'left')} aria-label="Rolar para a esquerda">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button className="scroll-button" onClick={() => scroll(reference, 'right')} aria-label="Rolar para a direita">
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </section>
  );
  
  // Hero Banner (Slider) Component
  const HeroBanner = () => (
    <div className="hero-banner" ref={heroRef} 
      onMouseEnter={stopSlideShow} 
      onMouseLeave={startSlideShow}
    >
      {heroMovies.map((movie, index) => (
        <div 
          key={movie.id} 
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ 
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` 
          }}
        >
          <div className="hero-content">
            <h1 className="hero-title">{movie.title}</h1>
            <div className="hero-rating">
              <FontAwesomeIcon icon={faStar} /> {movie.vote_average.toFixed(1)}
            </div>
            <p className="hero-description">
              {truncateText(movie.overview || '', 200)}
            </p>
            <button 
              className="hero-btn" 
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <FontAwesomeIcon icon={faPlay} /> Ver Detalhes
            </button>
          </div>
        </div>
      ))}
      <div className="hero-nav">
        {heroMovies.map((_, index) => (
          <div 
            key={index} 
            className={`hero-nav-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );

  // Efeitos
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchGenres(),
        fetchFeaturedMovies(),
        fetchUpcomingMovies(),
        fetchTopRatedMovies(),
        fetchMoviesByGenre(28), // Ação
        fetchMoviesByGenre(18), // Drama
      ]);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  // Efeito para o slider automático
  useEffect(() => {
    if (heroMovies.length > 0) {
      startSlideShow();
    }
    
    return () => {
      stopSlideShow();
    };
  }, [heroMovies, startSlideShow, stopSlideShow]);

  // Lazy loading de imagens com Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLImageElement;
            if (target.dataset.src) {
              target.src = target.dataset.src;
              target.removeAttribute('data-src');
              observer.unobserve(target);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach((img) => observer.observe(img));

    return () => {
      lazyImages.forEach((img) => observer.unobserve(img));
    };
  }, [featuredMovies, upcomingMovies, topRatedMovies, actionMovies, dramaMovies]);

  return (
    <div className="content">
      <div className="Watchfolio-Header">
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              fetchMovies(e.target.value);
            }}
            placeholder="Digite o nome do filme"
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            onFocus={() => query && setIsOpen(true)}
          />
          {isOpen && (
            <ul className="search-results">
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <li
                    key={movie.id}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                      />
                    ) : (
                      <div className="no-poster">
                        <FontAwesomeIcon icon={faFilm} />
                      </div>
                    )}
                    <span>{movie.title}</span>
                    <span className="movie-rating">
                      <FontAwesomeIcon icon={faStar} /> {movie.vote_average.toFixed(1)}
                    </span>
                  </li>
                ))
              ) : (
                <li className="no-results">Nenhum filme encontrado</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Carregando filmes...</div>
      ) : (
        <div className="movie-list">
          {/* Banner rotativo */}
          {heroMovies.length > 0 && <HeroBanner />}
          
          <MovieSection 
            title="Destaques" 
            icon={faFire} 
            movies={featuredMovies} 
            reference={featuredRef} 
          />

          <MovieSection 
            title="Bem Avaliados" 
            icon={faAward} 
            movies={topRatedMovies} 
            reference={topRatedRef} 
          />

          <MovieSection 
            title="Lançamentos" 
            icon={faClock} 
            movies={upcomingMovies} 
            reference={upcomingRef} 
          />
          
          <section className="categorias">
            <h2 className="section-title">
              <FontAwesomeIcon icon={faCompass} /> Explorar por Categoria
            </h2>
            
            <div className="categoria-tabs">
              {genres.slice(0, 12).map((genre) => (
                <button
                  key={genre.id}
                  className={`categoria-tab ${selectedGenre === genre.id ? 'active' : ''}`}
                  onClick={() => handleGenreSelect(genre.id)}
                >
                  {genre.name}
                </button>
              ))}
            </div>
            
            <div className="lista-de-filmes-container">
              <div className="lista-de-filmes" ref={genreRef}>
                {selectedGenre ? (
                  renderMovieCards(actionMovies, (id) => navigate(`/movie/${id}`))
                ) : (
                  <div className="select-category-message">
                    Selecione uma categoria para ver filmes
                  </div>
                )}
              </div>
              {selectedGenre && <div className="scroll-indicator"></div>}
            </div>
            
            {selectedGenre && (
              <div className="scroll-buttons">
                <button className="scroll-button" onClick={() => scroll(genreRef, 'left')}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button className="scroll-button" onClick={() => scroll(genreRef, 'right')}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}
          </section>
          
          <MovieSection 
            title="Ação" 
            icon={faFire} 
            movies={actionMovies} 
            reference={actionRef} 
          />
          
          <MovieSection 
            title="Drama" 
            icon={faHeart} 
            movies={dramaMovies} 
            reference={dramaRef} 
          />
        </div>
      )}
    </div>
  );
};

export default WatchfolioWeb;
