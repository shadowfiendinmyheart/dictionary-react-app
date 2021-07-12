import React, { useContext, useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import useInput from '../../hooks/input.hook';
import AuthContext from '../../context/AuthContext';
import InputForm from '../../components/InputForm';
import Button from '../../components/Button';
import Popup from '../../components/Popup';
import CreateCard from './components/CreateCard';
import SearchImage from './components/SearchImage';
import Loader from '../../components/Loader';

import styles from './AddWordPage.module.scss';

type imageType = {
  url: string;
  active: boolean;
}

const AddWordPage = ():React.ReactElement => {
  const inputWord = useInput('');
  const inputTranslate = useInput('');
  const inputImage = useInput('');

  const [images, setImages] = useState<imageType[]>();
  const [pickedImage, setPickedImage] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [showPopup, setShowPopup] = useState<boolean>(false);


  const { loading, request } = useHttp();
  const auth = useContext(AuthContext);

  const getImages = async (findImage: string, numberOfPage: number) => {
    if (!findImage) return;

    try {
      const imageList = await request(
        `images/list?search=${findImage}&page=${numberOfPage}`,
        'GET',
        null, 
        {Authorization: `Bearer ${auth.token}`}
      );
      const images = imageList.message.results.map((img: { urls: string; }) => {
        return {url: img.urls.small, active: false}
      })
      return images;
    } catch (e) {
      console.log('ERROR:', e);
    }
  }

  // TODO: подумать над некой "обёрткой" для кнопок
  const translateHandler = async (ev: React.SyntheticEvent) => {
    if (!inputWord.value) return console.log('Введите слово для перевода');
    try {
      ev.preventDefault();
      ev.stopPropagation();
      const translateFromServer = await request(
        `words/translate?word=${inputWord.value}`, 
        'GET', 
        null, 
        {Authorization: `Bearer ${auth.token}`}
      );
      inputTranslate.setValue(translateFromServer.message);
      inputImage.setValue(translateFromServer.message);
      setImages(await getImages(inputWord.value, page));
    } catch (e) {
      console.log('ERROR: ', e);
    }
  }
  
  const createCardHandler = (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    // TODO: сделать вывод ошибки
    if (!inputWord.value) return console.log('Введите слово для перевода');
    if (!inputTranslate.value) return console.log('Укажите перевод');

    setShowPopup(true);
  }
  
  const confirmClickHandler = async () => {
    try {
      const saveTranslateWord = await request(
        'words/saveTranslation', 
        'POST', 
        {reqWord: inputWord.value, reqTranslation: inputTranslate.value, reqImageURL: pickedImage}, 
        {Authorization: `Bearer ${auth.token}`}
      );
      console.log('done saveTranslateWord', saveTranslateWord);

      setShowPopup(false);
      inputWord.setValue('');
      inputImage.setValue('');
      setImages([]);
      inputTranslate.setValue('');
    } catch (e) {
      console.log('ERROR:', e);
    }  
  }

  const searchImageHandler = async (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (!inputImage.value) return console.log('Заполните поле для поиска ассоциации');

    try {
      const images =  await getImages(inputImage.value, page);
      setImages(images);
    } catch (e) {
      console.log('ERROR:', e);
    }
  }


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
            placeholder={'Введите слово для перевода'}
            value={inputWord.value}
            onChange={inputWord.onChange}
          />
        </div>
        <Button onClick={translateHandler} text={'Перевести'} disabled={loading} />
        <div className={styles.inpForm}>
          <InputForm 
            type={'text'}
            name={'translate'}
            placeholder={'Перевод'}
            value={inputTranslate.value}
            onChange={inputTranslate.onChange}
          />
        </div>
        {inputWord.value && inputTranslate.value && pickedImage && <Button onClick={createCardHandler} text={'Создать карточку'} disabled={loading} />}
        <div className={styles.inpForm}>
          <InputForm 
            type={'text'}
            name={'imageSearch'}
            placeholder={'Визуальная ассоциация'}
            value={inputImage.value}
            onChange={inputImage.onChange}
          />
        </div>
        <Button onClick={searchImageHandler} text={'Найти ассоциацию'} disabled={loading} />
      </form>
      <div>
        <div className={styles.wrapperPickImage}>
          {images && imageTile(images, 3).map((column: JSX.Element[], index: number) => <div key={`${index}-column`}>{column}</div>)}
        </div>
      </div>
      <Popup visible={showPopup} onClosePopup={() => setShowPopup(!showPopup)}>
        <CreateCard 
          card={{word: inputWord.value, translate: inputTranslate.value, url: pickedImage}} 
          loading={loading}
          onCancelClick={() => setShowPopup(!showPopup)} 
          onConfirmClick={confirmClickHandler}
        />
      </Popup>
    </div>
  )
}

export default AddWordPage;