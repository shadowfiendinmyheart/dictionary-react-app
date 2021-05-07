import React, { useContext, useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import AuthContext from '../../context/AuthContext';
import InputForm from '../../components/InputForm';
import Button from '../../components/Button';

import styles from './AddWordPage.module.scss';

const AddWordPage = ():React.ReactElement => {
  const [word, setWord] = useState('');
  const [translate, setTranslate] = useState('');
  const { loading, request, answer, clearAnswer } = useHttp();
  const auth = useContext(AuthContext);

  console.log('auth', auth);

  const translateHandler = async (ev: React.SyntheticEvent) => {
    try {
      ev.preventDefault();
      ev.stopPropagation();
      const translateFromServer = await request(`words/translate?word=${word}`, 'GET', null, {Authorization: `Bearer ${auth.token}`});
      setTranslate(translateFromServer.message);
      
    } catch (e) {
      alert(e);
      console.log('ERROR: ', e);
    }
  }
  
  const onWordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWord(event.target.value);
  }
  
  const emptyHandler = async () => {
    // if (!translate) return console.log('Сделать вывод ошибки, йо')
    
    // const saveTranslateWord = await request(`words/saveTranslation`, 'POST', {reqWord: word, reqTranslation: translate}, {Authorization: `Bearer ${auth.token}`});

    // saveTranslateWord

    console.log('done');
  };  

  return (
    <div className={styles.wrapper}>
      <form className={styles.wrapperForm}>
        <InputForm type={'text'} name={'word'} onChange={onWordHandler} placeholder={'Введите слово для перевода'} />
        <InputForm type={'text'} name={'translate'} placeholder={'Перевод'} value={translate} />
        <Button onClick={translateHandler} text={'Перевести'} />
        <Button onClick={emptyHandler} text={'Добавить в словарь'} />
      </form>
      <div>
      <div className={styles.wrapperPickImage}>
        see u later
      </div>
      </div>
    </div>
  )
}

export default AddWordPage;