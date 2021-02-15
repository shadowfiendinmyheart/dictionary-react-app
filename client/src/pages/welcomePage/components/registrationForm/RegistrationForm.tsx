import React, { useState } from 'react';
import InputForm from '../../../../components/InputForm';
import Button from '../../../../components/Button';

import styles from './RegistrationForm.module.scss';

const RegistrationPage = ():React.ReactElement => {

  const [form, setForm] = useState({
    reg_nickname: '',
    reg_login: '',
    reg_password: '',
    reg_password_repeat: '',
  });

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>)  => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  return (
    <form action={'/registration'} method={'post'}>
      <div className={styles.container}>
        <h2>REGISTRATION</h2>

        <InputForm type={'text'} placeholder={'Введите никнейм'} name={'reg_nickname'} onChange={changeHandler} />
        <InputForm type={'text'} placeholder={'Придумайте логин'} name={'reg_login'} onChange={changeHandler} />
        <InputForm type={'password'} placeholder={'Придумайте пароль'} name={'reg_password'} onChange={changeHandler} />
        <InputForm type={'password'} placeholder={'Повторите пароль'} name={'reg_password_repeat'} onChange={changeHandler} />
        <Button type={'submit'} text={'Зарегистрироваться'}/>
        
      </div>
    </form>
  )
};

export default RegistrationPage;