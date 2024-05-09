import React from 'react';

interface ButtonProps {
  onClick: () => void;
  text: string;
  icon: string;
  buttonClass?: string;
}

const Button = ({ onClick, text, icon, buttonClass }: ButtonProps) => {
  return (
    <button className={`button ${buttonClass}`} onClick={onClick}>
      <span className="button-text">{text}</span>
      <span className="button-icon">
        <img width={20} src={icon} alt="button-icon" />
      </span>
    </button>
  );
};

export default Button;
