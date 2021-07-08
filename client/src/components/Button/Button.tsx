import React from 'react';
import cn from "clsx";

import styles from './Button.module.scss';

type ButtonProps = {
  text: string,
  onClick: (ev: React.SyntheticEvent) => void
  type?: 'submit' | 'button' | 'reset',
  disabled?: boolean,
  classNameUpdate?: string,
}

const Button = (props: ButtonProps): React.ReactElement => {
  const { text, onClick, type, disabled, classNameUpdate } = props
  
  return (
    <button 
      className={cn(styles.btn, classNameUpdate)} 
      type={type} 
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  )
};

export default Button;