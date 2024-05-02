import React from "react";
import HeaderComponent from "./components/Header.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Sobre from "./pages/Sobre.tsx";
import WatchfolioWeb from "./pages/WatchfolioWeb.tsx";

import "./App.css";
import "./Style.css";
import MovieDetails from "./pages/MovieDetails.tsx";
import Footer from "./components/Footer.tsx";


function App() {
  return (
    <Router>
      <div>
        <HeaderComponent />
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/watchfolioWeb" element={<WatchfolioWeb />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
