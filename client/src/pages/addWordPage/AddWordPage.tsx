import React from 'react';

import InputForm from '../../components/InputForm';
import Button from '../../components/Button';

import styles from './AddWordPage.module.scss';

const onChangeHandler = () => {
  console.log("i'm pretty fine work")
}

const AddWordPage = ():React.ReactElement => {
  return (
    <div className={styles.wrapper}>
      <form className={styles.add}>
        <InputForm type={'text'} name={'add'} onChange={onChangeHandler} placeholder={'word'} />
        <InputForm type={'text1'} name={'add1'} onChange={onChangeHandler} placeholder={'translate'} />
        <Button onClick={onChangeHandler} text={'Перевести'} />
        <Button onClick={onChangeHandler} text={'Добавить в словарь'} />
      </form>
    </div>
  )
}

export default AddWordPage;