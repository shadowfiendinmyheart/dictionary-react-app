import React from 'react';
import InputForm from '../../../../components/InputForm';
import Button from '../../../../components/Button';

import styles from './LoginForm.module.scss';

const LoginForm = (): React.ReactElement => {
  return(
    <form action={'/login'} method={'post'}>
      <div className={styles.container}>
        <h2>LOGIN</h2>
        <InputForm type={'text'} placeholder={'Введите логин'} name={'auth_login'} />
        <InputForm type={'password'} placeholder={'Введите пароль'} name={'auth_password'} />
        <Button type={'submit'} text={'Войти'} />
      </div>
    </form>
  )
};

export default LoginForm;