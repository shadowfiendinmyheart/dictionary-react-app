import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import user from '../../store/user';
import { useHttp } from '../../hooks/http.hook';
import useInput from '../../hooks/input.hook';
import InputForm from '../../components/InputForm';
import Button from '../../components/Button';
import Popup from '../../components/Popup';
import AboutCard from './components/AboutCard';
import SearchImage from './components/SearchImage';

import DynamicPagination from '../../components/DynamicPagination';

import styles from './AddWordPage.module.scss';

type imageType = {
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
  const [page, setPage] = useState<number>(2);
  const [maxPage, setMaxPage] = useState<number>(3);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isExistCard, setIsExistCard] = useState<boolean>(false);
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

      setMaxPage(Number(imageList.headers['number-of-page']));
      
      const images = imageList.message.map((img: string) => {
        return {url: img, active: false}
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
      setPage(2);
      setMaxPage(3);
      const checkCardExist = await request(
        `words/getEngWord?reqWord=${inputWord.value}`, 
        'GET', 
        null, 
        {Authorization: `Bearer ${user.token}`}
      );

      if (checkCardExist.message?.word) {
        const card = checkCardExist.message;
        setShowPopup(true);
        setIsExistCard(true);
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
        inputTranslate.setValue(translateFromServer.message);
        inputImage.setValue(translateFromServer.message);
        setImages(await getImages(translateFromServer.message, 1));
      }
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
      console.log(e);
      return false;
    }
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

      setShowPopup(false);
      inputWord.setValue('');
      inputImage.setValue('');
      setImages([]);
      inputTranslate.setValue('');
    } catch (e) {
      const code = Number(e.toString().split(' ')[1]);
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

  const dynamicPaginationHandler = (): Promise<void | string> => {
    return new Promise((res, rej) => {
      const nextPage: Promise<void | string> = getImages(inputImage.value, page)
        .then((res) => {
          if (images && res) {
            setImages([...images, ...res]);
            setPage(prev => prev + 1);
          }
        })
        .catch((rej) => `got error - ${rej}`);

      res(nextPage);
      rej(nextPage);
    })
  }

  // {inputWord.value && inputTranslate.value && pickedImage && <Button onClick={createCardHandler} text={'Создать карточку'} disabled={loading} />}

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
        <DynamicPagination onScrollEnd={dynamicPaginationHandler} currentPage={page} maxPage={maxPage}> 
          <div className={styles.wrapperPickImage}>
            {images && imageTile(images, 3).map((column: JSX.Element[], index: number) => {
              return (
                <div className={styles.imageColumn} key={`${index}-column`}>
                  {column}
                </div>
              )})}
          </div>
        </DynamicPagination>
      </div>
      <Popup visible={showPopup} onClosePopup={() => setShowPopup(!showPopup)}>
        {(isExistCard && existCard) ? (
          <AboutCard
            title={'У вас уже есть карточка с таким словом. Редактировать ?'}
            card={{...existCard}} 
            loading={loading}
            onCancelClick={() => {
              setShowPopup(!showPopup);
              setIsExistCard(false);
            }} 
            onConfirmClick={async () => {
              setShowPopup(!showPopup)
              setIsExistCard(false);
              inputTranslate.setValue(existCard.translate);
              inputImage.setValue(existCard.word);
              try {
                const images = await getImages(existCard.word, page);
                setImages(images);
              } catch (e) {
                console.log('ERROR:', e);
              }
            }}
          />
        ) : (
          <AboutCard
            title={'Сохранить карточку в словарь?'}
            card={{word: inputWord.value, translate: inputTranslate.value, url: pickedImage}} 
            loading={loading}
            onCancelClick={() => setShowPopup(!showPopup)} 
            onConfirmClick={confirmClickHandler}
          />
        )}
      </Popup>
    </div>
  )
});

export default AddWordPage;