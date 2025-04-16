/**
 * Função para redirecionar o usuário para o aplicativo Watchfolio ao acessar uma página de perfil
 * @param {string} userId - ID do usuário do perfil sendo acessado
 */
export const redirectToApp = (userId) => {
  // Verifica se o usuário está acessando um perfil
  if (userId) {
    // Tenta abrir o aplicativo
    const appUrl = `watchfolio://profile/${userId}`;
    
    // Redireciona para o app
    window.location.href = appUrl;
    
    // Se o aplicativo não abrir em 2 segundos, permanece na versão web
    // ou redireciona para a loja de aplicativos
    return new Promise((resolve) => {
      setTimeout(() => {
        // Detecta o sistema operacional para redirecionar para a loja correta
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        if (/android/i.test(userAgent)) {
          // Redireciona para Google Play
          window.location.href = 'https://play.google.com/store/apps/details?id=com.psiotavio.MovieChecklist';
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
          // Redireciona para App Store
          window.location.href = 'https://apps.apple.com/app/id{6496133036}';
        } else {
          // Permanece no site - resolve a promise para continuar o carregamento da página web
          resolve(true);
        }
      }, 2000);
    });
  }
  
  return Promise.resolve(false);
}; 