import React from 'react';
import './cssComponents/buttonStyle.css'

type ButtonProps = {
  onClick: () => void;  // Defina o tipo do evento onClick, aqui é um exemplo simples
  children: React.ReactNode;  // Aceita qualquer conteúdo React válido
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className='customButton'>
      {children}
    </button>
  );
}

export default Button;
