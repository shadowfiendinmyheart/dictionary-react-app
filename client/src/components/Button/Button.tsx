import { type } from 'os';
import React from 'react';
import cn from "clsx";

import styles from './Button.module.scss';

type ButtonProps = {
  classNameUpdate?: string,
  type?: 'submit' | 'button' | 'reset',
  text: string,
  disabled?: boolean,
  onClick: (ev: React.SyntheticEvent) => void
}

const Button = (props: ButtonProps): React.ReactElement => {
  const { classNameUpdate, type, text, disabled, onClick } = props
  
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