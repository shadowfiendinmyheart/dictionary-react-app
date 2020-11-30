import { format } from 'path';
import React from 'react';

import styles from './RegistrationForm.module.scss';

const RegistrationPage = ():React.ReactElement => {
  return (
    <form action={'/registration'} method={'post'}>
      <div className={styles.container}>
        <h2>REGISTRATION</h2>

        <label htmlFor={'username'}>Nickname:</label>
        <input className={styles.formInput} id={'username'} type={'text'} placeholder={'Как к вам обращаться?'} name={'user_username'}></input>

        <label htmlFor={'login'}>Логин:</label>
        <input className={styles.formInput} id={'login'} type={'text'} placeholder={'Введите логин'} name={'user_login'}></input>

        <label htmlFor={'password'}>Пароль:</label>
        <input className={styles.formInput} id={'password'} type={'password'} placeholder={'Введите пароль'} name={'user_password'}></input>

        <label htmlFor={'passwordRepeat'}>Повторите пароль:</label>
        <input className={styles.formInput} id={'passwordRepeat'} type={'password'} placeholder={'Повторите пароль'} name={'user_passwordRepeat'}></input>
        
        <button type={'submit'}>Зарегистрироваться</button>
      </div>
    </form>
  )
};

export default RegistrationPage;