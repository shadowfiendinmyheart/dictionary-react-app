import React, { useContext, useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import AuthContext from '../../context/AuthContext';
import InputForm from '../../components/InputForm';
import Button from '../../components/Button';
import SearchImage from './SearchImage';

import styles from './AddWordPage.module.scss';

type imageType = {
  url: string;
  active: boolean;
}

const AddWordPage = ():React.ReactElement => {
  const [word, setWord] = useState<string>('');
  const [translate, setTranslate] = useState<string>('');
  const [images, setImages] = useState<imageType[]>();
  const [pickedImage, setPickedImage] = useState<string>();
  const [page, setPage] = useState<number>(1);

  const { loading, request } = useHttp();
  const auth = useContext(AuthContext);

  const getImages = async (findImage: string, numberOfPage: number) => {
    if (!findImage) return;

    try {
      const imageList = await request(
        `images/list?search=${word}&page=${numberOfPage}`,
        'GET',
        null, 
        {Authorization: `Bearer ${auth.token}`}
      );
      const images = imageList.message.results.map((img: { urls: string; }) => {
        return {url: img.urls.small, active: false}
      })
      setImages(images);
    } catch (e) {
      console.log('ERROR:', e);
    }
  }


  // TODO: подумать над некой "обёрткой" для кнопок
  const translateHandler = async (ev: React.SyntheticEvent) => {
    if (!word) return console.log('Введите слово для перевода');
    try {
      ev.preventDefault();
      ev.stopPropagation();
      const translateFromServer = await request(
        `words/translate?word=${word}`, 
        'GET', 
        null, 
        {Authorization: `Bearer ${auth.token}`}
      );
      setTranslate(translateFromServer.message);
      await getImages(translateFromServer.message, page);
    } catch (e) {
      console.log('ERROR: ', e);
    }
  }
  
  const onWordHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setWord(ev.target.value);
  }

  const onTranslateHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setTranslate(ev.target.value);
  }
  
  const addWordHandler = async (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    // TODO: сделать вывод ошибки
    if (!word) return console.log('Введите слово для перевода');
    if (!translate) return console.log('Укажите перевод');
    
    try {
      const saveTranslateWord = await request(
        'words/saveTranslation', 
        'POST', 
        {reqWord: word, reqTranslation: translate}, 
        {Authorization: `Bearer ${auth.token}`}
      );
      console.log('done saveTranslateWord', saveTranslateWord);
    } catch (e) {
      console.log('ERROR:', e);
    }
  };

  const imageTile = (images: imageType[], chunks: number) => {
    const columns = [...Array(chunks)].map((_, c) => images.filter((_, i) => i % chunks === c)); 
    return columns.map(column => column.map(el=> {
      return (
        <SearchImage key={el.url} url={el.url} active={el.active} cb={() => {
            const index = images.findIndex(image => image.url === el.url);
            const updatedImages = images.map((image, i) => {
              if (i === index) return {url: image.url, active: true}
              return {url: image.url, active: false}
            })
            setImages(updatedImages);
            setPickedImage(el.url);
          }}
        />
      )
    }))
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.wrapperForm}>
        <div className={styles.inpForm}>
          <InputForm
            type={'text'} 
            name={'word'} 
            onChange={onWordHandler} 
            placeholder={'Введите слово для перевода'} 
          />
        </div>
        <Button onClick={translateHandler} text={'Перевести'} disabled={loading} />
        <div className={styles.inpForm}>
          <InputForm 
            type={'text'} 
            name={'translate'} 
            onChange={onTranslateHandler} 
            placeholder={'Перевод'} 
            value={translate}
          />
        </div>
        <Button onClick={addWordHandler} text={'Добавить в словарь'} disabled={loading} />
      </form>
      <div>
        <div className={styles.wrapperPickImage}>
          {images && imageTile(images, 3).map((column: JSX.Element[], index: number) => <div key={`${index}-column`}>{column}</div>)}
        </div>
      </div>
    </div>
  )
}

export default AddWordPage;