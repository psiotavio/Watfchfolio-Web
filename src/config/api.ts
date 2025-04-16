/**
 * Arquivo de configuração centralizada para APIs
 */

// TMDB API
export const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

// Função para verificar se as variáveis de ambiente necessárias estão definidas
const checkRequiredEnvVars = () => {
  const requiredVars = [
    { name: 'REACT_APP_TMDB_API_KEY', value: TMDB_API_KEY }
  ];

  requiredVars.forEach(variable => {
    if (!variable.value) {
      console.error(`A variável de ambiente ${variable.name} não está definida. Verifique o arquivo .env`);
    }
  });
};

// Verificar no ambiente de desenvolvimento
if (process.env.NODE_ENV === 'development') {
  checkRequiredEnvVars();
} 