import React, { useState } from 'react';
import Card from '../../components/Card';
import InputForm from '../../components/InputForm';
import Button from '../../components/Button';

import styles from './DictionaryPage.module.scss';

enum words {
  all,
  known,
  unknown
}

const DictionaryPage = (): React.ReactElement => {
  const [selectedWords, setSelectedWords] = useState<words>(words.all);
  
  const handleSelectChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWords(Number(ev.target.value));
  }

  const handleButtonClick = () => {
    console.log(selectedWords)
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.formWrapper}>
        <select className={styles.selectWord} onChange={handleSelectChange}>
          <option value={words.all}>Все слова</option>
          <option value={words.known}>Выученные слова</option>
          <option value={words.unknown}>Невыученные слова</option>
        </select>
        <InputForm 
          name='search' 
          placeholder='Введите слово для поиска' 
          type='text'
        />
        <Button onClick={() => console.log('mock')} text={'Мне повезёт'} />
      </form>

      <div className={styles.cardsWrapper}>
          <Card 
              word={'cat'}  
              translate={'Кот'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              size={'s'}
            />
            <Card 
              translate={'mock'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              word={'mock'}  
              size={'s'}
            />
            <Card 
              translate={'mock'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              word={'mock'}  
              size={'s'}
            />
            <Card 
              translate={'mock'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              word={'mock'}  
              size={'s'}
            />
            <Card 
              translate={'mock'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              word={'mock'}  
              size={'s'}
            />
            <Card 
              translate={'mock'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              word={'mock'}  
              size={'s'}
            />
            <Card 
              translate={'mock'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              word={'mock'}  
              size={'s'}
            />
            <Card 
              translate={'mock'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              word={'mock'}  
              size={'s'}
            />
            <Card 
              translate={'mock'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              word={'mock'}  
              size={'s'}
            />
            <Card 
              translate={'mock'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              word={'mock'}  
              size={'s'}
            />
            <Card 
              translate={'mock'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              word={'mock'}  
              size={'s'}
            />
            <Card 
              translate={'mock'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              word={'mock'}  
              size={'s'}
            />
            <Card 
              translate={'mock'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              word={'mock'}  
              size={'s'}
            />
            <Card 
              translate={'mock'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              word={'mock'}  
              size={'s'}
            />
            <Card 
              translate={'mock'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              word={'mock'}  
              size={'s'}
            />
            <Card 
              translate={'mock'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              word={'mock'}  
              size={'s'}
            />
            <Card 
              translate={'mock'} 
              url={'https://www.demokot.ru/photo/img/foto-anime-koshek-1.jpg'}
              word={'mock'}  
              size={'s'}
            />
      </div>
    </div>
  )
}

export default DictionaryPage;