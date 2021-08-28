import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { toast } from "react-toastify";

import Card from '../../../../components/Card';
import InputForm from '../../../../components/InputForm';
import Button from '../../../../components/Button';
import ImagePagination from '../ImagePagination';

import user from '../../../../store/user';
import useInput from '../../../../hooks/input.hook';
import { useHttp } from '../../../../hooks/http.hook';
import { imageType } from '../../AddWordPage';
import { sizeVariant } from '../../../../components/Card/Card'
import { notificationConfig } from "../../../../constants/notification";

import styles from './EditCard.module.scss';

type EditCardProps = {
    card: {
        word: string;
        translate: string;
        url: string;
    }
}

const EditCard = (props: EditCardProps): React.ReactElement => {
    const { card } = props;

    const [images, setImages] = useState<imageType[]>();
    const [pickedImage, setPickedImage] = useState<string>(card.url);

    const inputTranslate = useInput(card.translate);
    const inputImage = useInput(card.word);
    const { loading, request } = useHttp();

    const changeTranslationHandler = async (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        ev.stopPropagation();

        console.log('card', card);
    }

    const findImageHandler = async (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        ev.stopPropagation();

        const images = await getImages(inputImage.value, 1);
        if (images) {
            setImages(images);
        } else {
            toast.error('Что-то пошло не так . . .');
        } 
    }

    const updateCardImageHandler = async (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
        
        try {
            await request(
                'words/setImage',
                'POST',
                {reqWord: card.word, reqImageURL: pickedImage},
                {Authorization: `Bearer ${user.token}`},
            );
            
            toast.success('Картинка была обновлена');
        } catch(e) {
            toast.error('Ошибка', e);
        }
    }

    // TODO: повторяется в нескольких файлах
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
          toast.error(e, notificationConfig);
          console.log('ERROR:', e);
        }
    }

    useEffect(() => {
        const setInitImages = async () => {
            const images = await getImages(card.word, 1);
            setImages(images);
        }

        setInitImages();
    }, [])

    return (
        <div className={styles.wrapper}> 
            <Card 
                word={card.word} 
                translate={inputTranslate.value} 
                url={pickedImage} 
                size={sizeVariant.s} 
            />
            <form>
                <InputForm 
                    name={'translation'} 
                    placeholder={'Введите перевод'} 
                    type={'text'}
                    {...inputTranslate}
                />
                <Button onClick={changeTranslationHandler} text={'Поменять перевод'} disabled={loading} />
            </form>
            <form>
                <InputForm 
                    name={'image'} 
                    placeholder={'Введите поиск для картинки'} 
                    type={'text'}
                    {...inputImage}
                />
                <Button onClick={findImageHandler} text={'Найти картинки'} disabled={loading} />
            </form>
            <div className={styles.images}>
                {images ?
                    <ImagePagination
                        searchWord={inputImage.value}
                        images={images}
                        setImages={setImages}
                        setPickedImage={setPickedImage}
                        onButtonClick={updateCardImageHandler}
                        buttonText={'Поменять картинку'}
                        loading={loading}
                    /> : <span />
                }
            </div>
        </div>
    )
}

export default observer(EditCard);