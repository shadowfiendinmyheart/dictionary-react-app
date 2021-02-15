import React, { useState } from 'react';
import InputForm from '../../../../components/InputForm';
import Button from '../../../../components/Button';

import styles from './LoginForm.module.scss';

const LoginForm = (): React.ReactElement => {
  const [form, setForm] = useState({
    auth_login: '',
    auth_password: '',
  });

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>)  => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  return(
    <form action={'/login'} method={'post'}>
      <div className={styles.container}>
        <h2>LOGIN</h2>
        <InputForm type={'text'} placeholder={'Введите логин'} name={'auth_login'} onChange={changeHandler} />
        <InputForm type={'password'} placeholder={'Введите пароль'} name={'auth_password'} onChange={changeHandler} />
        <Button type={'submit'} text={'Войти'} />
      </div>
    </form>
  )
};

export default LoginForm;