import React from "react";
import "./css/sobre.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCog, faTrash, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const AccountDeleteEn = () => {
  return (
    <div className="content-sobre">
      <div className="sobre-container">
        <section className="title-sobre">
          <h1>How to Delete Your Watchfolio Account</h1>
          <p>
            Step-by-step guide to safely and permanently delete your Watchfolio account.
          </p>
        </section>

        <div className="text">
          <h2 className="titles">Account Deletion Process</h2>
          <p className="sobre">
            We understand that sometimes it's necessary to delete your account. To ensure a transparent 
            and secure experience, we've developed a simple and straightforward process for account deletion.
          </p>
        </div>

        <div className="text-funcionalidades">
          <h2 className="titles">Steps to Delete Your Account</h2>
          <ul className="funcionalidades-list">
            <li className="funcionalidades">
              <FontAwesomeIcon icon={faUserCog} /> 
              <span>Access your profile page through the main menu</span>
            </li>
            <li className="funcionalidades">
              <FontAwesomeIcon icon={faUserCog} /> 
              <span>Click on the gear icon (settings) located in the top right corner</span>
            </li>
            <li className="funcionalidades">
              <FontAwesomeIcon icon={faTrash} /> 
              <span>Select the "Delete Account" option in the settings menu</span>
            </li>
          </ul>

          <div className="text">
            <h2 className="titles">What Will Be Deleted?</h2>
            <p className="sobre">
              When you delete your account, all your data will be permanently removed from the system, including:
            </p>
            <ul className="funcionalidades-list">
              <li className="funcionalidades">
                <FontAwesomeIcon icon={faExclamationTriangle} /> 
                <span>Personal information (email, password, profile data)</span>
              </li>
              <li className="funcionalidades">
                <FontAwesomeIcon icon={faExclamationTriangle} /> 
                <span>Watch history</span>
              </li>
              <li className="funcionalidades">
                <FontAwesomeIcon icon={faExclamationTriangle} /> 
                <span>Watchlist</span>
              </li>
              <li className="funcionalidades">
                <FontAwesomeIcon icon={faExclamationTriangle} /> 
                <span>All your posts and comments</span>
              </li>
              <li className="funcionalidades">
                <FontAwesomeIcon icon={faExclamationTriangle} /> 
                <span>Your likes and interactions</span>
              </li>
              <li className="funcionalidades">
                <FontAwesomeIcon icon={faExclamationTriangle} /> 
                <span>You will be removed from other users' followers list</span>
              </li>
            </ul>
          </div>

          <div className="text">
            <p className="sobre">
              <strong>Important:</strong> This action is irreversible. After deletion, it will not be possible 
              to recover your data. Make sure to back up any important information before proceeding with 
              account deletion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDeleteEn; 