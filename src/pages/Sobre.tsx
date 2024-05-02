import React from "react";
import "./css/sobre.css";

const Sobre = () => {
  return (
    <body>
      <div className="content-sobre">
        <section className="title-sobre">
          <h1>Sobre o Watchfolio</h1>
        </section>

        <div className="text">
          <h2 className="titles">O Que é o Watchfolio?</h2>
          <p className="sobre">
            Watchfolio é um aplicativo desenvolvido para ajudar os entusiastas do cinema a 
            registrar e avaliar filmes assistidos, funcionando como uma agenda pessoal de 
            cinema. Além de manter um registro dos filmes, o aplicativo oferece a 
            possibilidade de receber recomendações personalizadas, filtrar filmes por 
            gênero ou plataforma de streaming e muito mais.
          </p>
        </div>

        <div className="text-funcionalidades">
          <h2 className="titles">Funcionalidades do Watchfolio</h2>
          <ul className="funcionalidades-list">
            <li className="funcionalidades">Registrar um filme assistido.</li>
            <li className="funcionalidades">Avaliar e dar nota para os filmes assistidos.</li>
            <li className="funcionalidades">Receber recomendações baseadas nos filmes assistidos.</li>
            <li className="funcionalidades">Filtrar filmes recomendados por gênero ou plataforma de streaming.</li>
            <li className="funcionalidades">Sortear um filme aleatório para assistir, com filtros opcionais por gênero ou plataforma.</li>
            <li className="funcionalidades">Estatísticas de usuário mostrando quantos filmes foram assistidos por ano.</li>
            <li className="funcionalidades">Exibir os melhores filmes do mês com base nas avaliações do usuário.</li>
            <li className="funcionalidades">Criar listas de filmes para assistir mais tarde.</li>
            <li className="funcionalidades">Buscar informações detalhadas de filmes, como plataforma de streaming disponível, elenco e sinopse.</li>
          </ul>
          <p><strong>EM BREVE:</strong> Adicionar sistema de evolução de nível de perfil.</p>
        </div>
      </div>
    </body>
  );
};

export default Sobre;
