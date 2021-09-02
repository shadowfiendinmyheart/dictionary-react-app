import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';

import user from '../../store/user';
import { useHttp } from '../../hooks/http.hook';
import useInput from '../../hooks/input.hook';
import InputForm from '../../components/InputForm';
import Button from '../../components/Button';
import Popup from '../../components/Popup';
import AboutCard from './components/AboutCard';
import EditCard from './components/EditCard';
import SearchImage from './components/SearchImage';
import DynamicPagination from '../../components/DynamicPagination';
import { notificationConfig } from '../../constants/notification';

import styles from './AddWordPage.module.scss';
import Loader from '../../components/Loader';
import ImagePagination from './components/ImagePagination';

export type imageType = {
  url: string;
  active: boolean;
}

type cardType = {
  word: string;
  translate: string;
  url: string;
}

const AddWordPage = observer(():React.ReactElement => {
  const inputWord = useInput('');
  const inputTranslate = useInput('');
  const inputImage = useInput('');

  const [images, setImages] = useState<imageType[]>();
  const [pickedImage, setPickedImage] = useState<string>('');
  const [isExistCardPopup, setIsExistCardPopup] = useState<boolean>(false);
  const [saveCardPopup, setSaveCardPopup] = useState<boolean>(false);
  const [editCardPopup, setEditCardPopup] = useState<boolean>(false);
  const [existCard, setExistCard] = useState<cardType>();

  const { loading, request } = useHttp();

  const getImages = async (findImage: string, numberOfPage: number) => {
    if (!findImage) return;

    try {
      const imageList = await request(
        `images/list?search=${findImage}&page=${numberOfPage}`,
        'GET',
        null, 
        {Authorization: `Bearer ${user.token}`}
      );

      const images = imageList.message.map((img: string) => {
        return {url: img, active: false}
      })
      return images;
    } catch (e) {
      toast.error(String(e), notificationConfig);
      console.log('ERROR:', e);
    }
  }

  const createDictionary = async () => {
    try {
      const create = await request(
        'words/createDictionary', 
        'POST', 
        null, 
        {Authorization: `Bearer ${user.token}`}
      );
      console.log(create);
      return true;
    } catch(e) {
      toast.error(String(e), notificationConfig);
      console.log(e);
      return false;
    }
  }

  // TODO: подумать над некой "обёрткой" для кнопок
  // TODO: показывать инпуты для перевода и посика картинки, только после нажатия этой кнопки -
  const translateHandler = async (ev: React.SyntheticEvent) => {
    if (!inputWord.value) return console.log('Введите слово для перевода');
    try {
      ev.preventDefault();
      ev.stopPropagation();

      const checkCardExist = await request(
        `words/getEngWord?reqWord=${inputWord.value}`, 
        'GET', 
        null, 
        {Authorization: `Bearer ${user.token}`}
      );

      if (checkCardExist.message?.word) {
        const card = checkCardExist.message;
        setIsExistCardPopup(true);
        setExistCard({
          word: card.word,
          translate: card.translations[0],
          url: card.imageURL
        })
      } else {
        const translateFromServer = await request(
          `words/translate?word=${inputWord.value}`, 
          'GET', 
          null, 
          {Authorization: `Bearer ${user.token}`}
        );
        const mainTranslation = translateFromServer.message.split(', ')[0];

        inputTranslate.setValue(translateFromServer.message);
        inputImage.setValue(mainTranslation);
        setImages(await getImages(mainTranslation, 1));
      }
    } catch (e) {
      toast.error(String(e), notificationConfig);
      const code = Number(String(e).toString().split(' ')[1]);
      if (code === 400) await createDictionary();
      console.log('ERROR:', e);
    }
  }
  
  const createCardHandler = (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    
    if (!inputWord.value) {
      toast.error(String('Введите слово для перевода'), notificationConfig);
      return;
    }
    if (!inputTranslate.value) {
      toast.error(String('Укажите перевод'), notificationConfig);
      return;
    } 

    setSaveCardPopup(true);
  }

  
  const confirmClickHandler = async () => {
    try {
      const saveTranslateWord = await request(
        'words/saveTranslation', 
        'POST', 
        {reqWord: inputWord.value, reqTranslation: inputTranslate.value, reqImageURL: pickedImage}, 
        {Authorization: `Bearer ${user.token}`}
      );
      console.log('done saveTranslateWord', saveTranslateWord);
      toast.success('Карточка успешно создана и ждёт вас в словаре :)', notificationConfig);

      setSaveCardPopup(false);
      inputWord.setValue('');
      inputImage.setValue('');
      setImages([]);
      inputTranslate.setValue('');
    } catch (e) {
      toast.error(String(e), notificationConfig);
      const code = Number(String(e).split(' ')[1]);
      if (code === 400) {
        // TODO: когда будет готова реализация нескольких словарей,
        // сделать попап с предложением создать словарь с новым языком
        const isSuccess = await createDictionary();
        if (isSuccess) confirmClickHandler();
      }
      console.log('ERROR:', e);
    }  
  }

  const searchImageHandler = async (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (!inputImage.value) return console.log('Заполните поле для поиска ассоциации');

    try {
      const images =  await getImages(inputImage.value, 1);
      setImages(images);
    } catch (e) {
      toast.error(String(e), notificationConfig);
      console.log('ERROR:', e);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperForm}>
        <form autoComplete='off' className={styles.searchForm}>
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
        </form>
        <div className={styles.inpForm}>
          <InputForm 
            autoComplete='off'
            type={'text'}
            name={'translate'}
            placeholder={'Перевод'}
            value={inputTranslate.value}
            onChange={inputTranslate.onChange}
          />
        </div>
        <form autoComplete='off' className={styles.searchForm}>
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
      </div>
      <div>
        {images ? 
          <ImagePagination 
            searchWord={inputTranslate.value}
            images={images}
            setImages={setImages}
            setPickedImage={setPickedImage}
            buttonText={'Добавить карточку'}
            onButtonClick={createCardHandler}
          /> : <span />
        }
      </div>
      <Popup visible={saveCardPopup} onClosePopup={() => setSaveCardPopup(!saveCardPopup)}>
        <AboutCard
              title={'Сохранить карточку в словарь?'}
              card={{word: inputWord.value, translate: inputTranslate.value, url: pickedImage}} 
              loading={loading}
              onCancelClick={() => setSaveCardPopup(false)} 
              onConfirmClick={confirmClickHandler}
            />
      </Popup>
      <Popup visible={isExistCardPopup} onClosePopup={() => setIsExistCardPopup(!isExistCardPopup)}>
        {existCard ?
          <AboutCard
            title={'У вас уже есть карточка с таким словом. Редактировать ?'}
            card={{...existCard}} 
            loading={loading}
            onCancelClick={() => setIsExistCardPopup(false)} 
            onConfirmClick={async () => {
              setIsExistCardPopup(false);
              setEditCardPopup(true);
            }}
          /> : <Loader />
        }
      </Popup>
      <Popup visible={editCardPopup} onClosePopup={() => setEditCardPopup(!editCardPopup)}>
        {existCard ? 
          <EditCard 
            card={{...existCard}} 
          /> : <Loader />
        }
      </Popup>
    </div>
  )
});

export default AddWordPage;