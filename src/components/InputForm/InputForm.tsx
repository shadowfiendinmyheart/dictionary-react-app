import React from 'react';
import cn from 'clsx';

import styles from './InputForm.module.scss'

type InputProps = {
  classNameUpdate?: string,
  id?: string,
  type: string,
  placeholder: string,
  name: string,
}

const Input = (props: InputProps):React.ReactElement => {
  const { classNameUpdate, id, type, placeholder, name} = props;
  
  return (
    <div className={styles.form__group}>
      <input className={cn(styles.form__field, classNameUpdate)} id={name} type={type} placeholder={placeholder} name={name} required></input>
      <label htmlFor={name} className={styles.form__label}>{placeholder}</label>
      </div>
    )
};

export default Input;