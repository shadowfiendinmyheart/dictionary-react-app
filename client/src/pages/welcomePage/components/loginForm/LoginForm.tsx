import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import InputForm from '../../../../components/InputForm';
import Button from '../../../../components/Button';
import { useHttp } from '../../../../hooks/http.hook';
import user from '../../../../store/user';

import styles from './LoginForm.module.scss';

const LoginForm = observer((): React.ReactElement => {
  const { loading, request, error, clearAnswer } = useHttp();
  const [form, setForm] = useState({
    authLogin: '',
    authPassword: '',
  });

  useEffect( () => {
    if (error) {
      alert(error); // Добавить нормальный вывод ошибки ! ! !
      clearAnswer();
    }
  }, [error]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>)  => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const authHandler = async (ev: React.SyntheticEvent) => {
    try {
      ev.preventDefault();
      ev.stopPropagation();
      const data = await request('api/auth/login', 'POST', {...form});
      user.login(data.accessToken);
    } catch (e) {}
  }

  return(
    <form action={'/login'} method={'post'}>
      <div className={styles.container}>
        <h2>Авторизация</h2>
        <InputForm type={'text'} placeholder={'Введите логин'} name={'authLogin'} onChange={changeHandler} />
        <InputForm type={'password'} placeholder={'Введите пароль'} name={'authPassword'} onChange={changeHandler} />
        <Button type={'submit'} text={'Войти'} onClick={authHandler} disabled={loading} />
      </div>
    </form>
  )
});

export default LoginForm;