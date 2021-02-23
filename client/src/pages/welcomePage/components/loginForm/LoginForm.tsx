import React, { useState, useEffect } from 'react';
import InputForm from '../../../../components/InputForm';
import Button from '../../../../components/Button';
import { useHttp } from '../../../../hooks/http.hook';

import styles from './LoginForm.module.scss';

const LoginForm = (): React.ReactElement => {
  
  const { loading, error, request, message, clearError, clearMessage } = useHttp();
  const [form, setForm] = useState({
    authLogin: '',
    authPassword: '',
  });

  useEffect( () => {
    if (error) {
      alert(error); // Добавить нормальный вывод ошибки ! ! !
      clearError();
    }
  }, [error]);

  useEffect( () => {
    if (message) {
      alert(message); // Добавить нормальный вывод ошибки ! ! !
      clearMessage();
    }
  }, [message]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>)  => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const authHandler = async (ev: React.SyntheticEvent) => {
    try {
      ev.preventDefault();
      ev.stopPropagation();
      await request('api/auth/login', 'POST', {...form})
    } catch (e) {}
  }

  return(
    <form action={'/login'} method={'post'}>
      <div className={styles.container}>
        <h2>LOGIN</h2>
        <InputForm type={'text'} placeholder={'Введите логин'} name={'authLogin'} onChange={changeHandler} />
        <InputForm type={'password'} placeholder={'Введите пароль'} name={'authPassword'} onChange={changeHandler} />
        <Button type={'submit'} text={'Войти'} onClick={authHandler}/>
      </div>
    </form>
  )
};

export default LoginForm;