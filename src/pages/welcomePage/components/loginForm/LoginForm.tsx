import React from 'react';

import styles from './LoginForm.module.scss';

const LoginForm = (): React.ReactElement => {
  return(
    <form action={'/login'} method={'post'}>
      <div className={styles.container}>
        <h2>LOGIN</h2>

        <label htmlFor={'login'}>Логин:</label>
        <input className={styles.formInput} id={'login'} type={'text'} placeholder={'Введите логин'} name={'user_login'}></input>

        <label htmlFor={'password'}>Пароль:</label>
        <input className={styles.formInput} id={'password'} type={'password'} placeholder={'Введите пароль'} name={'user_password'}></input>

        <button type={'submit'}>Войти</button>
      </div>
    </form>
  )
};

export default LoginForm;