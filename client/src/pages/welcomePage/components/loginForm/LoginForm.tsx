import React, { useState, useEffect, useContext } from 'react';
import InputForm from '../../../../components/InputForm';
import Button from '../../../../components/Button';
import { useHttp } from '../../../../hooks/http.hook';
import AuthContext from '../../../../context/AuthContext';

import styles from './LoginForm.module.scss';

const LoginForm = (): React.ReactElement => {
  
  const { loading, request, answer, clearAnswer } = useHttp();
  const [form, setForm] = useState({
    authLogin: '',
    authPassword: '',
  });
  const { token, userId, login, logout, isAuth } = useContext(AuthContext);

  useEffect( () => {
    if (answer) {
      alert(answer); // Добавить нормальный вывод ошибки ! ! !
      clearAnswer();
    }
  }, [answer]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>)  => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const authHandler = async (ev: React.SyntheticEvent) => {
    try {
      ev.preventDefault();
      ev.stopPropagation();
      const data = await request('api/auth/login', 'POST', {...form});
      console.log('handler', data);
      login(data.token, data.userId);
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