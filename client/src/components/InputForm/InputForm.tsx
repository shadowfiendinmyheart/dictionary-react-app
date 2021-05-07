import React from 'react';
import cn from 'clsx';

import styles from './InputForm.module.scss'

type InputProps = {
  classNameUpdate?: string,
  id?: string,
  type: string,
  placeholder: string,
  name: string,
  value?: string,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = (props: InputProps):React.ReactElement => {
  const { classNameUpdate, id, type, placeholder, name, onChange, value} = props;
  
  return (
    <div className={styles.form__group}>
      <input 
        className={cn(styles.form__field, classNameUpdate)} 
        id={name} 
        type={type} 
        placeholder={placeholder}
        name={name} 
        onChange={onChange}
        value={value}
        required 
      />
      <label htmlFor={name} className={styles.form__label}>{placeholder}</label>
      </div>
    )
};

export default Input;