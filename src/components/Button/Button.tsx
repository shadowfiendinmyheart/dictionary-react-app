import { type } from 'os';
import React from 'react';
import cn from "clsx";

import styles from './Button.module.scss';

type ButtonProps = {
  classNameUpdate?: string,
  type: 'submit' | 'button' | 'reset',
  text: string
}

const Button = (props: ButtonProps): React.ReactElement => {
  const { classNameUpdate, type, text } = props
  
  return (
    <button className={cn(styles.btn, classNameUpdate)} type={type}>
      {text}
    </button>
  )
};

export default Button;