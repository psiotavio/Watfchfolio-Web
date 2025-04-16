import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faStar, faDollarSign, faCalendarAlt, faClock, faUserFriends, faTrophy, faFilm, faPlayCircle, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import "./css/movieDetails.css";
import { useNavigate } from "react-router-dom";
import "./css/modal.css";
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '../config/api.ts';

interface MovieDetailsProps {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  genres: { id: number; name: string }[];
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  actors: { id: number; name: string; profile_path: string; character: string }[];
  streamingPlatforms: { id: number; name: string; logo_path: string }[];
  backdrop_path: string;
  director: string;
  screenplay: string;
  budget: number;
  revenue: number;
  age_rating: string;
  trailer_key: string;
}

interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const query = useQuery();
  const [showModal, setShowModal] = useState(query.get("popup") === "true");
  const [showTrailer, setShowTrailer] = useState(false);

  const [movie, setMovie] = useState<MovieDetailsProps | null>(null);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const fetchMovieDetails = async () => {
    setLoading(true);
    try {
      const [movieRes, creditsRes] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=pt-BR`),
        axios.get(`${TMDB_BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=pt-BR`)
      ]);

      // Preparar dados do filme com valores padrão para evitar undefined
      const movieData = {
        ...movieRes.data,
        genres: movieRes.data.genres || [],
        actors: creditsRes.data.cast?.slice(0, 10).map((actor: any) => ({
          id: actor.id,
          name: actor.name,
          profile_path: actor.profile_path,
          character: actor.character
        })) || [],
        streamingPlatforms: [] // Valor padrão para streaming platforms
      };
      
      setMovie(movieData);
      
      // Buscar filmes similares (recomendações)
      try {
        const similarRes = await axios.get(
          `${TMDB_BASE_URL}/movie/${id}/recommendations?api_key=${TMDB_API_KEY}&language=pt-BR`
        );
        const similarMoviesData = similarRes.data.results || [];
        setSimilarMovies(similarMoviesData.slice(0, 12));
      } catch (error) {
        console.error("Erro ao buscar filmes similares:", error);
        setSimilarMovies([]);
      }

      // Buscar videos do filme
      try {
        const videosRes = await axios.get(
          `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=pt-BR`
        );
        const videos = videosRes.data.results || [];
        
        // Procurar por um trailer
        const trailer = videos.find((v: any) => v.type === "Trailer" && v.site === "YouTube") || videos[0];
        if (trailer) {
          setMovie((prevMovie: MovieDetailsProps | null) => {
            if (prevMovie === null) return null;
            return {
              ...prevMovie,
              trailer_key: trailer.key
            };
          });
        }
      } catch (error) {
        console.error("Erro ao buscar videos:", error);
      }

      // Buscar providers do filme
      try {
        const providersRes = await axios.get(
          `${TMDB_BASE_URL}/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`
        );
        const providersByRegion = providersRes.data.results || {};
        setMovie((prevMovie: MovieDetailsProps | null) => {
          if (prevMovie === null) return null;
          return {
            ...prevMovie,
            streamingPlatforms: providersByRegion.BR?.flatrate?.map((provider: any) => ({
              id: provider.provider_id,
              name: provider.provider_name,
              logo_path: provider.logo_path,
            })) || []
          };
        });
      } catch (error) {
        console.error("Erro ao buscar providers:", error);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do filme:", error);
      setError("Falha ao carregar os detalhes do filme.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Carregando detalhes do filme...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <p>Erro: {error}</p>
      <button onClick={goBack} className="back-button">
        <FontAwesomeIcon icon={faChevronLeft} /> Voltar
      </button>
    </div>
  );

  return (
    <div className="movie-details">
      <button onClick={goBack} className="back-button">
        <FontAwesomeIcon icon={faChevronLeft} /> Voltar
      </button>
      
      {movie && (
        <div>
          {movie.backdrop_path && (
            <img
              className="movie-backdrop"
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt="Backdrop"
            />
          )}
          <div className="movie-details-block">
            <div
              style={{
                backgroundImage: movie.backdrop_path ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` : 'none',
              }}
              className="movie-details-content-background"
            >
              <div className="movie-details-content">
                <div className="poster-container">
                  {movie.poster_path ? (
                    <img
                      className="movie-poster"
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                  ) : (
                    <div className="no-poster">
                      <FontAwesomeIcon icon={faFilm} size="3x" />
                    </div>
                  )}
                  {movie.trailer_key && (
                    <button 
                      className="trailer-button"
                      onClick={() => setShowTrailer(true)}
                    >
                      <FontAwesomeIcon icon={faPlayCircle} /> Ver Trailer
                    </button>
                  )}
                </div>
                
                <div className="movie-info">
                  <div className="movie-title-rate">
                    <h1 className="movie-title">{movie.title}</h1>
                    {movie.age_rating && <div className="movie-rate">{movie.age_rating}</div>}
                  </div>

                  <div className="movie-metadata">
                    {movie.release_date && (
                      <span className="metadata-item">
                        <FontAwesomeIcon icon={faCalendarAlt} /> {new Date(movie.release_date).getFullYear()}
                      </span>
                    )}
                    {movie.runtime > 0 && (
                      <span className="metadata-item">
                        <FontAwesomeIcon icon={faClock} /> {movie.runtime} min
                      </span>
                    )}
                    {movie.genres && movie.genres.map(genre => (
                      <span key={genre.id} className="metadata-item">{genre.name}</span>
                    ))}
                  </div>
                  
                  <div className="vote-average">
                    <FontAwesomeIcon icon={faStar} size="lg" color="#FFD700" />
                    <span className="vote-average-value">{movie.vote_average.toFixed(1)}</span>
                    <span className="vote-count">({movie.vote_count} votos)</span>
                  </div>

                  <p className="movie-overview">{movie.overview}</p>
                  
                  <div className="details-row">
                    {movie.director && (
                      <div className="detail-item">
                        <span className="detail-label">Direção:</span>
                        <span className="detail-value">{movie.director}</span>
                      </div>
                    )}
                    
                    {movie.screenplay && (
                      <div className="detail-item">
                        <span className="detail-label">Roteiro:</span>
                        <span className="detail-value">{movie.screenplay}</span>
                      </div>
                    )}
                  </div>

                  <div className="details-row">
                    {movie.budget > 0 && (
                      <div className="detail-item">
                        <span className="detail-label">
                          <FontAwesomeIcon icon={faDollarSign} /> Orçamento:
                        </span>
                        <span className="detail-value">${new Intl.NumberFormat('pt-BR').format(movie.budget)}</span>
                      </div>
                    )}
                    
                    {movie.revenue > 0 && (
                      <div className="detail-item">
                        <span className="detail-label">
                          <FontAwesomeIcon icon={faTrophy} /> Bilheteria:
                        </span>
                        <span className="detail-value">${new Intl.NumberFormat('pt-BR').format(movie.revenue)}</span>
                      </div>
                    )}
                  </div>
                  
                  {movie.streamingPlatforms && movie.streamingPlatforms.length > 0 && (
                    <div className="streaming-section">
                      <h3>Disponível em:</h3>
                      <div className="streaming-platforms">
                        {movie.streamingPlatforms.map((platform) => (
                          <div className="platform" key={platform.id}>
                            <img
                              src={`https://image.tmdb.org/t/p/w500${platform.logo_path}`}
                              alt={platform.name}
                            />
                            <p>{platform.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <section className="section-2">
            <div className="actors-recommendations">
              <h2 className="h2-titles">
                <FontAwesomeIcon icon={faUserFriends} /> Elenco Principal
              </h2>
              <div className="movie-actors">
                {movie.actors && movie.actors.map((actor) => (
                  <div className="actor" key={actor.id}>
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                        alt={actor.name}
                      />
                    ) : (
                      <div className="actor-placeholder">
                        <FontAwesomeIcon icon={faUserFriends} size="2x" />
                      </div>
                    )}
                    <p className="actor-name">{actor.name}</p>
                    {actor.character && (
                      <p className="actor-character">{actor.character}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="section-divider">
                <div className="divider-line"></div>
              </div>

              <h2 className="h2-titles">
                <FontAwesomeIcon icon={faFilm} /> Recomendados
              </h2>
              <div className="similar-movies-section">
                <div className="lista-de-filmes">
                  {similarMovies && similarMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="similar-movie"
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                      <div className="movie-rating">
                        <FontAwesomeIcon icon={faStar} /> {movie.vote_average.toFixed(1)}
                      </div>
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                      />
                      <p className="title-movie">{movie.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="more-info">
              <h2 className="h2-titles">Detalhes</h2>
              <div className="details-movie">
                {movie.release_date && (
                  <p className="movie-detail-item">
                    <strong>Lançamento:</strong>
                    <span>{new Date(movie.release_date).toLocaleDateString('pt-BR')}</span>
                  </p>
                )}
                {movie.runtime > 0 && (
                  <p className="movie-detail-item">
                    <strong>Duração:</strong>
                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min</span>
                  </p>
                )}
                {movie.age_rating && (
                  <p className="movie-detail-item">
                    <strong>Classificação:</strong>
                    <span>{movie.age_rating}</span>
                  </p>
                )}
                <p className="movie-detail-item">
                  <strong>Avaliação:</strong>
                  <span>{movie.vote_average.toFixed(1)}/10</span>
                </p>
                <p className="movie-detail-item">
                  <strong>Votos:</strong>
                  <span>{new Intl.NumberFormat('pt-BR').format(movie.vote_count)}</span>
                </p>
                {movie.budget > 0 && (
                  <p className="movie-detail-item">
                    <strong>Orçamento:</strong>
                    <span>${new Intl.NumberFormat('pt-BR').format(movie.budget)}</span>
                  </p>
                )}
                {movie.revenue > 0 && (
                  <p className="movie-detail-item">
                    <strong>Bilheteria:</strong>
                    <span>${new Intl.NumberFormat('pt-BR').format(movie.revenue)}</span>
                  </p>
                )}
              </div>
            </div>
          </section>
          
          {showTrailer && movie.trailer_key && (
            <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
              <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-trailer" onClick={() => setShowTrailer(false)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <iframe
                  title="trailer"
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${movie.trailer_key}?autoplay=1`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="closeButton">
              <FontAwesomeIcon
                icon={faTimes}
                fontSize={20}
                style={{ alignSelf: "center", padding: "15px" }}
                onClick={() => setShowModal(false)}
              />
            </div>
            <div className="modal-content-container">
              <h2 className="modal-title">Watchfolio</h2>
              <p className="texts-modal">
                Aproveite a melhor experiência de entretenimento com o nosso
                aplicativo Watchfolio! Este filme é apenas uma amostra do que
                você pode explorar. Com o Watchfolio, você terá acesso a
                detalhes, recomendações e muito mais sobre seus filmes
                favoritos.
              </p>
              <h3 className="texts-modal-h3">Clique aqui e baixe agora!</h3>
              <div className="modal-buttons-store">
                <a
                  href="https://apps.apple.com/us/app/watchfolio/id6496133036"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-store-button"
                >
                  App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.psiotavio.MovieChecklist&hl=pt_BR&gl=US"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="play-store-button"
                >
                  Google Play
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
