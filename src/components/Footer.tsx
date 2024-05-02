import React from "react";
import apple from "../assets/appleLogo.png"; // Caminho correto da imagem da App Store
import appStore from "../assets/appstore.webp"; // Caminho correto da imagem da App Store
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
