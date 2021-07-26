import React, { useEffect, useState } from 'react';
import InputForm from '../../../../components/InputForm';
import Button from '../../../../components/Button';
import { useHttp } from '../../../../hooks/http.hook';

import styles from './RegistrationForm.module.scss';

const RegistrationPage = ():React.ReactElement => {
  const { loading, request, error, clearAnswer } = useHttp();
  const [form, setForm] = useState({
    regNickname: '',
    regLogin: '',
    regPassword: '',
    regPasswordRepeat: '',
  });

  useEffect(() => {
    if (error) {
      alert(error); // Добавить нормальный вывод ошибки ! ! !
      clearAnswer();
    }
  }, [error]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>)  => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const registerHandler = async (ev: React.SyntheticEvent) => {
    try {
      ev.preventDefault();
      ev.stopPropagation();
      await request('api/auth/registration', 'POST', {...form});
    } catch (e) {}
  }
  
  return (
      <div className={styles.container}>
        <h2>Регистрация</h2>
        <form>
          <InputForm type={'text'} placeholder={'Введите никнейм'} name={'regNickname'} onChange={changeHandler} />
          <InputForm type={'text'} placeholder={'Придумайте логин'} name={'regLogin'} onChange={changeHandler} />
          <InputForm type={'password'} placeholder={'Придумайте пароль'} name={'regPassword'} onChange={changeHandler} />
          <InputForm type={'password'} placeholder={'Повторите пароль'} name={'regPasswordRepeat'} onChange={changeHandler} />
          <Button type={'submit'} text={'Зарегистрироваться'} onClick={registerHandler} disabled={loading} />
        </form>
      </div>
  )
};

export default RegistrationPage;