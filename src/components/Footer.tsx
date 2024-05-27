import React from "react";
import appStore from "../assets/appstore.webp"; // Caminho correto da imagem da App Store
import playStore from "../assets/playStore.webp"; 
import myLogo from "../assets/logo.png";
import "./cssComponents/footer.css"; // Caminho correto do CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="logo-container">
        <img src={myLogo} alt="Logo do Watchfolio" className="logo-footer" />
      </div>

      <div className="copyright">
        <div className="copyright-text">
          <p>
            &copy; {new Date().getFullYear()} Watchfolio. Todos os direitos
            reservados.
          </p>
        </div>
      </div>

      <div className="app-store-container">
          <a href="https://apps.apple.com/br/app/watchfolio/id6496133036">
            <img
              src={appStore}
              alt="Disponível na App Store"
              className="app-store-logo"
            />
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.psiotavio.MovieChecklist&hl=pt_BR&gl=US">
            <img
              src={playStore}
              alt="Disponível na play Store"
              className="app-store-logo"
            />
          </a>
        </div>

      <div className="mobile-content">
        <div className="logo-container-mobile">
          <img src={myLogo} alt="Logo do Watchfolio" className="logo-mobile" />
        </div>
        <div className="app-store-container-mobile">
          <a href="https://apps.apple.com/br/app/watchfolio/id6496133036">
            <img
              src={appStore}
              alt="Disponível na App Store"
              className="app-store-logo-mobile"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
