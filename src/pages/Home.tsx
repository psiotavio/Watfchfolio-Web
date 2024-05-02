import React from "react";
import "../App.css";
import "../Style.css";
import "./css/home.css";
// import { SparklesCore } from "../components/ui/sparkles.tsx";
import { LampContainer } from "../components/ui/lamp.tsx";
import { motion } from "framer-motion";
import Button from "../components/CustomButton.tsx";

import print1 from "../assets/prints/print1.png";
import print2 from "../assets/prints/print2.png";

function Home() {
  
  const handleClick = () => {
    window.open("https://apps.apple.com/br/app/watchfolio/id6496133036", "_blank"); // Abre o link em uma nova aba
  };

  return (
    <div className="App">
      <div className="lamp">
        <LampContainer>
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
          >
            Watchfolio
          </motion.h1>
        </LampContainer>
      </div>

      <div>
        <h1 className="web-title">Watchfolio</h1>
      </div>

      <div style={{ marginTop: "4rem", marginBottom: "10rem" }}>
        <Button onClick={handleClick}>Clique aqui para baixar!</Button>
      </div>

      <section className="texts-Section-style1" style={{ backgroundColor: "#020617" }}>
        <div className="left-text">
          <h1>Watchfolio: Sua Jornada Cinematográfica Personalizada</h1>
          <p>
            Bem-vindo ao Watchfolio, onde cada filme que você assiste se
            transforma em uma parte valiosa da sua história pessoal de cinema.
            Com Watchfolio, não só você registra e avalia os filmes que assiste,
            mas também recebe recomendações meticulosamente personalizadas que
            respeitam seus gostos únicos e preferências de streaming. Desde a
            exploração de novos gêneros até o encontro da próxima obra-prima,
            nosso app é projetado para enriquecer sua experiência
            cinematográfica, proporcionando ferramentas interativas e insights
            que transformam cada sessão de cinema em uma aventura. Prepare-se
            para redescobrir o mundo dos filmes com um assistente que entende
            verdadeiramente sua paixão pelo cinema.
          </p>
          <h2>Descubra, Avalie e Celebre o Cinema Como Nunca Antes</h2>
        </div>

        <div className="right-image">
          <img className="home-image-print" src={print1} alt="Descrição da imagem" />
        </div>
      </section>

      <section className="texts-Section-style2" style={{ backgroundColor: "#020617" }}>
        <div className="left-image">
        <img className="home-image-print" src={print2} alt="Descrição da imagem" />
        </div>
        <div className="right-text">
          <h1>Explore e Avalie com Precisão</h1>
          <p>
            Com Watchfolio, cada filme que você assiste é uma nova entrada em
            seu diário cinematográfico pessoal. Não perca a oportunidade de
            documentar sua jornada através dos filmes, avaliando cada um deles e
            compartilhando suas impressões. Seu feedback é o coração do nosso
            sistema de recomendações personalizadas, garantindo que as próximas
            sugestões sejam ainda mais afinadas com seus gostos.
          </p>
          <h2>Registre Cada Momento Cinematográfico</h2>
        </div>
      </section>

      {/* <div className="custom-main-container">
      <div className="custom-full-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="custom-full-size"
          particleColor="#FFFFFF"
        />
      </div>
      <h1 className="custom-header">
        Watchfolio
      </h1>
</div> */}
    </div>
  );
}

export default Home;
