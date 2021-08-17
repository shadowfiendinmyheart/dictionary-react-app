import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';

import InputForm from '../../../../components/InputForm';
import Button from '../../../../components/Button';
import { useHttp } from '../../../../hooks/http.hook';
import user from '../../../../store/user';
import { notificationConfig } from '../../../../constants/notification';

import styles from './LoginForm.module.scss';

const LoginForm = observer((): React.ReactElement => {
  const { loading, request, error, clearAnswer } = useHttp();
  const [form, setForm] = useState({
    authLogin: '',
    authPassword: '',
  });
  
  useEffect( () => {
    if (error) {
      toast.error(error, notificationConfig);
      clearAnswer();
    }
  }, [error]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>)  => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const authHandler = async (ev: React.SyntheticEvent) => {
    if (!(form.authLogin && form.authPassword)) return;
    ev.preventDefault();
    ev.stopPropagation();

    try {
      const data = await request('api/auth/login', 'POST', {...form});
      user.login(data.accessToken);
      toast.success('Вы успешно вошли!', notificationConfig);
    } catch (e) {}
  }


  return(
    <form action={'/login'} method={'post'} className={styles.container}>
      <h2>Авторизация</h2>
      <InputForm type={'text'} placeholder={'Введите логин'} name={'authLogin'} onChange={changeHandler} />
      <InputForm type={'password'} placeholder={'Введите пароль'} name={'authPassword'} onChange={changeHandler} />
      <Button type={'submit'} text={'Войти'} onClick={authHandler} disabled={loading} />
    </form>
  )
});

export default LoginForm;