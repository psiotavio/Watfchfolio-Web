import React from "react";
import "./css/sobre.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm, faListCheck, faStar, faUserFriends, faRandom, faChartLine, faSearch, faListAlt, faRocket } from "@fortawesome/free-solid-svg-icons";

const Sobre = () => {
  return (
    <div className="content-sobre">
      <div className="sobre-container">
        <section className="title-sobre">
          <h1>Sobre o Watchfolio</h1>
          <p>
            A plataforma definitiva para os verdadeiros amantes de cinema e séries. 
            Organize, descubra e compartilhe suas experiências cinematográficas.
          </p>
        </section>

        <div className="text">
          <h2 className="titles">O Que é o Watchfolio?</h2>
          <p className="sobre">
            O Watchfolio é um aplicativo revolucionário desenvolvido especialmente para cinéfilos e 
            entusiastas do universo cinematográfico que desejam ter controle total sobre sua jornada audiovisual.
            É uma ferramenta completa que permite registrar, gerenciar e avaliar todos os filmes e séries que você já assistiu,
            funcionando como um diário digital cinematográfico personalizado.
          </p>
          <p className="sobre">
            Nossa plataforma combina tecnologia avançada com uma interface intuitiva, oferecendo muito 
            mais que um simples catálogo de filmes. O Watchfolio utiliza algoritmos inteligentes de recomendação
            baseados em suas preferências pessoais, histórico de visualização e avaliações, para sugerir 
            conteúdos que realmente correspondam ao seu gosto único.
          </p>
          <p className="sobre">
            Seja você um aficionado por cinema de arte, um fã de blockbusters ou um explorador de 
            filmes independentes, o Watchfolio se adapta ao seu perfil, ajudando a descobrir 
            novas obras e expandir seus horizontes cinematográficos através de uma experiência totalmente personalizada.
          </p>
        </div>

        <div className="text-funcionalidades">
          <h2 className="titles">Funcionalidades do Watchfolio</h2>
          <ul className="funcionalidades-list">
            <li className="funcionalidades">
              <FontAwesomeIcon icon={faFilm} /> 
              <span>Registre e catalogue filmes e séries que você assistiu, criando sua biblioteca cinematográfica pessoal.</span>
            </li>
            <li className="funcionalidades">
              <FontAwesomeIcon icon={faStar} /> 
              <span>Avalie com sistema de 5 estrelas e adicione críticas personalizadas para cada obra assistida.</span>
            </li>
            <li className="funcionalidades">
              <FontAwesomeIcon icon={faUserFriends} /> 
              <span>Receba recomendações personalizadas com base em seu histórico, avaliações e preferências de gênero.</span>
            </li>
            <li className="funcionalidades">
              <FontAwesomeIcon icon={faSearch} /> 
              <span>Filtre obras por gênero, diretor, plataforma de streaming ou ano de lançamento para encontrar exatamente o que procura.</span>
            </li>
            <li className="funcionalidades">
              <FontAwesomeIcon icon={faRandom} /> 
              <span>Utilize a função "Descubra um filme" para sortear recomendações aleatórias quando estiver indeciso.</span>
            </li>
            <li className="funcionalidades">
              <FontAwesomeIcon icon={faChartLine} /> 
              <span>Acompanhe estatísticas detalhadas sobre seus hábitos de consumo, gêneros favoritos e progresso anual.</span>
            </li>
            <li className="funcionalidades">
              <FontAwesomeIcon icon={faListCheck} /> 
              <span>Visualize retrospectivas mensais destacando os melhores filmes e séries baseados em suas avaliações.</span>
            </li>
            <li className="funcionalidades">
              <FontAwesomeIcon icon={faListAlt} /> 
              <span>Crie e organize listas temáticas personalizadas para planejar maratonas futuras ou compartilhar recomendações.</span>
            </li>
            <li className="funcionalidades">
              <FontAwesomeIcon icon={faSearch} /> 
              <span>Acesse informações detalhadas sobre cada produção, incluindo elenco, equipe técnica, disponibilidade em streaming e curiosidades.</span>
            </li>
          </ul>
          <div className="em-breve">
            <FontAwesomeIcon icon={faRocket} /> EM BREVE: Sistema de evolução de perfil com desafios cinematográficos
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sobre;
