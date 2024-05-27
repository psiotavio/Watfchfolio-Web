import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import "./css/movieDetails.css";
import { useNavigate } from "react-router-dom";
import "./css/modal.css";
import AppStoreLogo from "../assets/appstore.webp";
import VerticalLogo from "../assets/VerticalLogo.png";
import playStore from "../assets/playStore.webp";

interface MovieDetailsProps {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  genres: { id: number; name: string }[];
  release_date: string;
  runtime: number;
  vote_average: number;
  actors: { id: number; name: string; profile_path: string }[];
  streamingPlatforms: { id: number; name: string; logo_path: string }[];
  backdrop_path: string;
  director: string;
  screenplay: string;
  budget: number;
  revenue: number;
  age_rating: string;
}

interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string;
}

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const query = useQuery();
  const [showModal, setShowModal] = useState(query.get("popup") === "true");

  const [movie, setMovie] = useState<MovieDetailsProps | null>(null);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const APITMDB = "172e0af0e176f9c169387e094fb67c75";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const detailsUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${APITMDB}&language=pt-BR&append_to_response=release_dates`;
        const creditsUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${APITMDB}&language=pt-BR`;
        const watchProvidersUrl = `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${APITMDB}`;
        const similarMoviesUrl = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${APITMDB}&language=pt-BR`;

        const [
          detailsResponse,
          creditsResponse,
          providersResponse,
          similarMoviesResponse,
        ] = await Promise.all([
          axios.get(detailsUrl),
          axios.get(creditsUrl),
          axios.get(watchProvidersUrl),
          axios.get(similarMoviesUrl),
        ]);

        setSimilarMovies(
          similarMoviesResponse.data.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
          }))
        );

        // Extrair a classificação indicativa
        const ageRatingData = detailsResponse.data.release_dates.results.find(
          (result: any) => result.iso_3166_1 === "BR"
        )?.release_dates;
        const age_rating = ageRatingData
          ? ageRatingData.find((release: any) => release.certification)
              ?.certification || "Sem classificação"
          : "Sem classificação";

        const directors = creditsResponse.data.crew.filter(
          (member: any) => member.job === "Director"
        );
        const screenplays = creditsResponse.data.crew.filter(
          (member: any) => member.job === "Screenplay"
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const age_ratings = detailsResponse.data.release_dates.results
          .find((result: any) => result.iso_3166_1 === "BR")
          .release_dates.map((release: any) => release.certification);

        const actors = creditsResponse.data.cast
          .slice(0, 11)
          .map((actor: any) => ({
            id: actor.id,
            name: actor.name,
            profile_path: actor.profile_path,
          }));

        const streamingPlatforms =
          providersResponse.data.results.BR?.flatrate?.map((provider: any) => ({
            id: provider.provider_id,
            name: provider.provider_name,
            logo_path: provider.logo_path,
          })) || [];

        setMovie({
          ...detailsResponse.data,
          actors,
          streamingPlatforms,
          backdrop_path: detailsResponse.data.backdrop_path,
          director: directors.map((director: any) => director.name).join(", "),
          screenplay: screenplays
            .map((screenplay: any) => screenplay.name)
            .join(", "),
          budget: detailsResponse.data.budget,
          revenue: detailsResponse.data.revenue,
          age_rating,
        });
        setLoading(false);
      } catch (error) {
        setError("Falha ao carregar os detalhes do filme");
        setLoading(false);
        console.error(error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="movie-details">
      {movie && (
        <div>
          <img
            className="movie-backdrop"
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt="Backdrop"
          />
          <div className="movie-details-block">
            <div
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              }}
              className="movie-details-content-background"
            >
              <div className="movie-details-content">
                <img
                  className="movie-poster"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className="movie-info">
                  <div className="movie-title-rate">
                    <h1 className="movie-title">{movie.title}</h1>

                    <p className="movie-rate">{movie.age_rating}</p>
                  </div>

                  <p className="movie-overview">{movie.overview}</p>
                  <div>
                    <p className="movie-genres">
                      <strong>Gêneros:</strong>{" "}
                      {movie.genres.map((genre) => genre.name).join(", ")}
                    </p>
                    <p className="movie-release-date">
                      <strong>Data de Lançamento:</strong>{" "}
                      {new Date(movie.release_date).toLocaleDateString()}
                    </p>
                    <p className="movie-runtime">
                      <strong>Duração:</strong> {movie.runtime} minutos
                    </p>
                    <p className="movie-rating">
                      <strong>Avaliação:</strong> {movie.vote_average} / 10
                    </p>
                    <div className="details-second-section">
                      <p className="movie-rating">
                        <strong>Diretor:</strong> {movie.director}
                      </p>
                      <p className="movie-rating">
                        <strong>Roteiro:</strong> {movie.screenplay}
                      </p>
                    </div>

                    <div className="details-third-section">
                      <p className="movie-rating">
                        <strong>Orçamento:</strong> $
                        {movie.budget.toLocaleString()}
                      </p>
                      <p className="movie-rating">
                        <strong>Bilheteria:</strong> $
                        {movie.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="streaming-platforms">
                    {movie.streamingPlatforms.map((platform) => (
                      <div className="platform" key={platform.id}>
                        <img
                          src={`https://image.tmdb.org/t/p/w500${platform.logo_path}`}
                          alt={platform.name}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="section-2">
            <div className="actors-recommendations">
              <h2
                style={{
                  textAlign: "left",
                  marginBottom: "5px",
                }}
                className="h2-titles"
              >
                Elenco Principal
              </h2>
              <div className="movie-actors">
                {movie.actors.map((actor) => (
                  <div className="actor" key={actor.id}>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                      alt={actor.name}
                    />
                    <p className="title-movie">{actor.name}</p>
                  </div>
                ))}
              </div>

              <h2
                style={{
                  textAlign: "left",
                  marginBottom: "5px",
                }}
                className="h2-titles"
              >
                Recomendado
              </h2>
              <div className="similar-movies-section">
                <div className="lista-de-filmes">
                  {similarMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="similar-movie"
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    >
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
              <div className="details-movie">
                <p className="movie-cash">
                  <strong>Orçamento:</strong> ${movie.budget.toLocaleString()}
                </p>
                <p className="movie-earnings">
                  <strong>Bilheteria:</strong> ${movie.revenue.toLocaleString()}
                </p>
              </div>
            </div>
          </section>
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
              <img
                src={VerticalLogo}
                alt="Watchfolio Logo"
                className="WatchfolioLogoModal"
              />
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
                >
                  <img
                    src={AppStoreLogo}
                    alt="App Store Logo"
                    className="AppStoreModal"
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.psiotavio.MovieChecklist&hl=pt_BR&gl=US"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={playStore}
                    alt="App Store Logo"
                    className="AppStoreModal"
                  />
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
