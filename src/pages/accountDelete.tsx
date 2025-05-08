import React from "react";
import "./css/sobre.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCog, faTrash, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const AccountDelete = () => {
  return (
    <div className="content-sobre">
      <div className="sobre-container">
        <section className="title-sobre">
          <h1>Como Excluir sua Conta no Watchfolio</h1>
          <p>
            Guia passo a passo para excluir sua conta no Watchfolio de forma segura e permanente.
          </p>
        </section>

        <div className="text">
          <h2 className="titles">Processo de Exclusão de Conta</h2>
          <p className="sobre">
            Entendemos que às vezes é necessário excluir sua conta. Para garantir uma experiência 
            transparente e segura, desenvolvemos um processo simples e direto para a exclusão da sua conta.
          </p>
        </div>

        <div className="text-funcionalidades">
          <h2 className="titles">Passos para Excluir sua Conta</h2>
          <ul className="funcionalidades-list">
            <li className="funcionalidades">
              <FontAwesomeIcon icon={faUserCog} /> 
              <span>Acesse sua página de perfil através do menu principal</span>
            </li>
            <li className="funcionalidades">
              <FontAwesomeIcon icon={faUserCog} /> 
              <span>Clique no ícone de engrenagem (configurações) localizado no canto superior direito</span>
            </li>
            <li className="funcionalidades">
              <FontAwesomeIcon icon={faTrash} /> 
              <span>Selecione a opção "Excluir Conta" no menu de configurações</span>
            </li>
          </ul>

          <div className="text">
            <h2 className="titles">O que será excluído?</h2>
            <p className="sobre">
              Ao excluir sua conta, todos os seus dados serão permanentemente removidos do sistema, incluindo:
            </p>
            <ul className="funcionalidades-list">
              <li className="funcionalidades">
                <FontAwesomeIcon icon={faExclamationTriangle} /> 
                <span>Informações pessoais (email, senha, dados de perfil)</span>
              </li>
              <li className="funcionalidades">
                <FontAwesomeIcon icon={faExclamationTriangle} /> 
                <span>Histórico de filmes assistidos</span>
              </li>
              <li className="funcionalidades">
                <FontAwesomeIcon icon={faExclamationTriangle} /> 
                <span>Lista de filmes que deseja assistir</span>
              </li>
              <li className="funcionalidades">
                <FontAwesomeIcon icon={faExclamationTriangle} /> 
                <span>Todos os seus posts e comentários</span>
              </li>
              <li className="funcionalidades">
                <FontAwesomeIcon icon={faExclamationTriangle} /> 
                <span>Suas curtidas e interações</span>
              </li>
              <li className="funcionalidades">
                <FontAwesomeIcon icon={faExclamationTriangle} /> 
                <span>Você será removido da lista de seguidores de outros usuários</span>
              </li>
            </ul>
          </div>

          <div className="text">
            <p className="sobre">
              <strong>Importante:</strong> Esta ação é irreversível. Após a exclusão, não será possível 
              recuperar seus dados. Certifique-se de fazer backup de qualquer informação importante antes 
              de prosseguir com a exclusão da conta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDelete; 