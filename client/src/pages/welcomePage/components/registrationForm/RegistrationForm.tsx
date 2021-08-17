import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import InputForm from '../../../../components/InputForm';
import Button from '../../../../components/Button';
import { useHttp } from '../../../../hooks/http.hook';
import { notificationConfig } from '../../../../constants/notification';

import styles from './RegistrationForm.module.scss';

interface IForm {
  [key: string]: string;
}

const RegistrationPage = ():React.ReactElement => {
  const { loading, request, error, clearAnswer } = useHttp();
  const [form, setForm] = useState<IForm>({
    regNickname: '',
    regLogin: '',
    regPassword: '',
    regPasswordRepeat: '',
  });

  useEffect(() => {
    if (error) {
      toast.error(error, notificationConfig);
      clearAnswer();
    }
  }, [error]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>)  => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const registerHandler = async (ev: React.SyntheticEvent) => {
    for (const prop in form) {
      if (!form[prop]) {
        return;
      }
    }

    ev.preventDefault();
    ev.stopPropagation();
    
    try {
      await request('api/auth/registration', 'POST', {...form});
      toast.success('Аккаунт создан!', notificationConfig);
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