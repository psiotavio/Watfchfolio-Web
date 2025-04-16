import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { redirectToApp } from "../utils/profileRedirect";
import "./css/UserProfile.css";
import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '../config/api.ts';

// Componentes e ícones
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faStar, 
  faFilm, 
  faUsers,
  faUser,
  faCalendarAlt,
  faChevronRight,
  faExternalLinkAlt
} from "@fortawesome/free-solid-svg-icons";
import { db } from "../firebase/firebase.ts";

interface UserData {
  id: string;
  displayName: string;
  photoURL: string;
  coverPhotoURL: string;
  profileImage: string;
  coverImage: string;
  followers: string[];
  following: string[];
  bio: string;
  name: string;
}

interface MovieReview {
  id: string;
  movieId: string;
  title: string;
  poster_path: string;
  imageUrl?: string;
  rating: number;
  date: string;
  comment?: string;
  genreId?: string;
}

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
}

interface Review {
  id: string;
  userId: string;
  movieId: string;
  movieTitle: string;
  text: string;
  rating: number;
  posterPath?: string;
  isReview: boolean;
  createdAt: {
    toDate: () => Date;
  };
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<MovieReview[]>([]);
  const [activeTab, setActiveTab] = useState<string>("reviews");
  const [appBanner, setAppBanner] = useState<boolean>(false);
  const [totalMoviesWatched, setTotalMoviesWatched] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      // Tenta redirecionar para o app
      const stayOnWeb = await redirectToApp(userId || '');
      
      // Se o usuário permanecer no site, carrega os dados
      if (stayOnWeb) {
        setAppBanner(true);
        fetchUserData();
      }
    };

    init();
  }, [userId]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      // Buscar dados do usuário
      const userDocRef = doc(db, "users", userId);
      
      try {
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const followers = userData.followers || [];
          const following = userData.following || [];

          setUserData({
            id: userDoc.id,
            displayName: userData.displayName || "Usuário Watchfolio",
            name: userData.name || userData.displayName || "Usuário Watchfolio",
            photoURL: userData.photoURL || "/default-profile.png",
            profileImage: userData.profileImage || userData.photoURL || "/default-profile.png",
            coverPhotoURL: userData.coverPhotoURL || "/default-cover.jpg",
            coverImage: userData.coverImage || userData.coverPhotoURL || "/default-cover.jpg",
            followers: followers,
            following: following,
            bio: userData.bio || "Cinéfilo apaixonado | Crítico amador | Colecionador de momentos cinematográficos 🎬 Apaixonado por cinema desde sempre, compartilhando minhas impressões sobre os filmes que assisto."
          });

          // Buscar reviews do usuário
          await fetchUserReviews(userId);
          
          // Buscar filmes assistidos
          await fetchWatchedMovies(userId);
        } else {
          console.log("Usuário não encontrado");
        }
      } catch (error) {
        console.error("Erro ao obter documento:", error);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para buscar detalhes do filme na API TMDB
  const fetchMovieDetails = async (movieId: string): Promise<TMDBMovie | null> => {
    try {
      const response = await axios.get(
        `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=pt-BR`
      );
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar detalhes do filme ${movieId}:`, error);
      return null;
    }
  };

  const fetchUserReviews = async (uid: string) => {
    try {
      // Usando estratégia de tratamento de falhas
      try {
        const reviewsRef = collection(db, "reviews");
        const q = query(
          reviewsRef,
          where("userId", "==", uid),
          where("isReview", "==", true),
          orderBy("createdAt", "desc"),
          limit(5)
        );

        const snapshot = await getDocs(q);
        const fetchedReviews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Review[];

        // Buscar as imagens de pôster para as reviews
        const reviewsWithPosters = await Promise.all(fetchedReviews.map(async (review) => {
          if (review.movieId && !review.posterPath) {
            const movieDetails = await fetchMovieDetails(review.movieId);
            if (movieDetails) {
              return {
                ...review,
                posterPath: movieDetails.poster_path
              };
            }
          }
          return review;
        }));

        setRecentReviews(reviewsWithPosters);
      } catch (innerError) {
        console.error("Erro específico ao buscar reviews:", innerError);
        // Fallback para array vazio em caso de erro
        setRecentReviews([]);
      }
    } catch (error) {
      console.error("Erro geral ao buscar reviews:", error);
      setRecentReviews([]);
    }
  };

  const fetchWatchedMovies = async (uid: string) => {
    try {
      // Buscando os filmes da coleção movielists onde o documento tem o ID do usuário
      try {
        // Referência ao documento do usuário na coleção movielists
        const movielistRef = doc(db, "movielists", uid);
        const movielistDoc = await getDoc(movielistRef);
        
        if (movielistDoc.exists()) {
          const movielistData = movielistDoc.data();
          
          // Verificando se existe o array de filmes
          if (movielistData.movies && Array.isArray(movielistData.movies)) {
            // Ordenando os filmes por data (mais recente primeiro)
            const moviesArray = [...movielistData.movies]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
            // Definindo o total de filmes assistidos
            setTotalMoviesWatched(moviesArray.length);
            
            // Pegando apenas os 12 mais recentes para exibição
            const recentMovies = moviesArray.slice(0, 12);
            
            // Processando filmes para exibição, usando imageUrl se disponível ou buscando da API
            const formattedMovies = await Promise.all(recentMovies.map(async (movie) => {
              // Modelo base do filme
              const baseMovie = {
                id: movie.movieId || movie.id || String(Date.now()),
                movieId: movie.movieId || movie.id || '',
                title: movie.title || 'Título não disponível',
                poster_path: '',
                rating: movie.rating || 0,
                date: movie.date || new Date().toISOString(),
                comment: movie.comment || '',
                genreId: movie.genreId || '',
                imageUrl: movie.imageUrl || ''
              };
              
              // Se tiver imageUrl, usamos ele
              if (movie.imageUrl) {
                return {
                  ...baseMovie,
                  poster_path: movie.imageUrl
                };
              } 
              // Se não tiver imageUrl mas tiver movieId, tentamos buscar da API
              else if (movie.movieId) {
                try {
                  const movieDetails = await fetchMovieDetails(movie.movieId);
                  if (movieDetails && movieDetails.poster_path) {
                    return {
                      ...baseMovie,
                      poster_path: movieDetails.poster_path
                    };
                  }
                } catch (apiError) {
                  console.error("Erro ao buscar imagem do filme:", apiError);
                }
              }
              
              // Retorna o filme com poster_path vazio se não conseguiu obter
              return baseMovie;
            }));
            
            setWatchedMovies(formattedMovies);
          } else {
            console.log("Nenhum filme encontrado no array de filmes");
            setWatchedMovies([]);
            setTotalMoviesWatched(0);
          }
        } else {
          console.log("Documento de filmes não encontrado para este usuário");
          setWatchedMovies([]);
          setTotalMoviesWatched(0);
        }
      } catch (moviesError) {
        console.error("Erro ao buscar lista de filmes:", moviesError);
        setWatchedMovies([]);
        setTotalMoviesWatched(0);
      }
    } catch (error) {
      console.error("Erro geral ao buscar filmes assistidos:", error);
      setWatchedMovies([]);
      setTotalMoviesWatched(0);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  // Função auxiliar para obter URL da imagem
  const getImageUrl = (path: string | undefined, size: string = 'w342') => {
    if (!path) return '/default-poster.jpg';
    
    // Se o caminho já for uma URL completa (incluindo imageUrl do filme)
    if (path.startsWith('http')) {
      return path;
    }
    
    // Se for um path da TMDB
    return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="not-found-container">
        <h2>Perfil não encontrado</h2>
        <p>O usuário que você está procurando não existe ou foi removido.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {appBanner && (
        <div className="app-banner">
          <p>Baixe o aplicativo Watchfolio para uma melhor experiência!</p>
          <div className="app-store-links">
            <a href="https://play.google.com/store/apps/details?id=com.psiotavio.MovieChecklist" target="_blank" rel="noopener noreferrer">
              Google Play
            </a>
            <a href="https://apps.apple.com/br/app/watchfolio-tracker-de-filmes/id6496133036" target="_blank" rel="noopener noreferrer">
              App Store
            </a>
          </div>
        </div>
      )}

      <div className="profile-header">
        <div 
          className="cover-photo" 
          style={{ 
            backgroundImage: `url(${userData.coverImage || userData.coverPhotoURL})` 
          }}
        ></div>
        
        <div className="profile-info">
          <div className="profile-header-content">
            <div 
              className="profile-pic" 
              style={{ 
                backgroundImage: `url(${userData.profileImage || userData.photoURL})` 
              }}
            ></div>
            
            <div className="profile-details">
              <h1>{userData.name || userData.displayName}</h1>
              <p className="bio">{userData.bio}</p>
              
              <div className="stats">
                <div className="stat-item">
                  <FontAwesomeIcon icon={faFilm} />
                  <span>{totalMoviesWatched} filmes assistidos</span>
                </div>
                <div className="stat-item">
                  <FontAwesomeIcon icon={faUsers} />
                  <span>{userData.followers.length} seguidores</span>
                </div>
                <div className="stat-item">
                  <FontAwesomeIcon icon={faUser} />
                  <span>Seguindo {userData.following.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={activeTab === "reviews" ? "active" : ""} 
          onClick={() => setActiveTab("reviews")}
        >
          Avaliações
        </button>
        <button 
          className={activeTab === "watched" ? "active" : ""} 
          onClick={() => setActiveTab("watched")}
        >
          Filmes Assistidos
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "reviews" && (
          <div className="reviews-section">
            <div className="section-header">
              <h2>Avaliações Recentes</h2>
              {recentReviews.length > 5 && (
                <a href="#" className="see-all">
                  Ver todas <FontAwesomeIcon icon={faChevronRight} />
                </a>
              )}
            </div>
            
            {recentReviews.length > 0 ? (
              <div className="reviews-list">
                {recentReviews.map((review) => (
                  <div className="review-card" key={review.id}>
                    <div className="review-movie">
                      <img 
                        src={getImageUrl(review.posterPath, 'w154')} 
                        alt={review.movieTitle} 
                      />
                      <div className="review-movie-info">
                        <h3>{review.movieTitle}</h3>
                        <div className="rating">
                          <FontAwesomeIcon icon={faStar} />
                          <span>{review.rating}/5</span>
                        </div>
                        <div className="review-date">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                          <span>
                            {review.createdAt && review.createdAt.toDate 
                              ? new Date(review.createdAt.toDate()).toLocaleDateString('pt-BR') 
                              : "Data não disponível"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="review-text">{review.text}</p>
                    
                    <div className="review-actions">
                      <a href={`/movie/${review.movieId}`} className="movie-link">
                        Ver filme <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Nenhuma avaliação encontrada.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "watched" && (
          <div className="movies-section">
            <div className="section-header">
              <h2>Filmes Assistidos</h2>
              {watchedMovies.length > 12 && (
                <a href="#" className="see-all">
                  Ver todos <FontAwesomeIcon icon={faChevronRight} />
                </a>
              )}
            </div>
            
            {watchedMovies.length > 0 ? (
              <div className="movies-grid">
                {watchedMovies.map((movie) => (
                  <div className="movie-card" key={movie.id}>
                    <div className="movie-poster">
                      <img 
                        src={getImageUrl(movie.poster_path || movie.imageUrl)} 
                        alt={movie.title} 
                      />
                      <div className="movie-rating">
                        <FontAwesomeIcon icon={faStar} />
                        <span>{movie.rating}/5</span>
                      </div>
                    </div>
                    <div className="movie-info">
                      <h3>{movie.title}</h3>
                      <p className="watch-date">
                        {formatDate(movie.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Nenhum filme assistido encontrado.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile; 