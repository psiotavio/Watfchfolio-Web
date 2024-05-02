import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import "./cssComponents/header.css"

const HeaderComponent = () => {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header>
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <nav>
        <ul className={showDropdown ? 'dropdown-content' : ''}>
          <li className={location.pathname === '' ? 'active' : ''}>
            <Link to="">Início</Link>
          </li>
          <li className={location.pathname === '/watchfolioWeb' ? 'active' : ''}>
            <Link to="/watchfolioWeb">Watchfolio WEB</Link>
          </li>
          <li className={location.pathname === '/contact' ? 'active' : ''}>
            <Link to="/sobre">Sobre</Link>
          </li>
        </ul>
        <div className="menu-icon" onClick={toggleDropdown}>
          &#9776; {/* Ícone de barrinhas */}
        </div>
      </nav>
    </header>
  );
};

export default HeaderComponent;