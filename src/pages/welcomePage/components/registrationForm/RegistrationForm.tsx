import React from 'react';
import InputForm from '../../../../components/InputForm';
import Button from '../../../../components/Button';

import styles from './RegistrationForm.module.scss';

const RegistrationPage = ():React.ReactElement => {
  return (
    <form action={'/registration'} method={'post'}>
      <div className={styles.container}>
        <h2>REGISTRATION</h2>

        <InputForm type={'text'} placeholder={'Введите никнейм'} name={'reg_nickname'} />
        <InputForm type={'text'} placeholder={'Придумайте логин'} name={'reg_login'} />
        <InputForm type={'password'} placeholder={'Придумайте пароль'} name={'reg_password'} />
        <InputForm type={'password'} placeholder={'Повторите пароль'} name={'reg_password_repeat'} />
        <Button type={'submit'} text={'Зарегистрироваться'}/>
        
      </div>
    </form>
  )
};

export default RegistrationPage;