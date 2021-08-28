import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { observer } from 'mobx-react-lite';
import { toast } from "react-toastify";

import user from '../../../../store/user';
import DynamicPagination from "../../../../components/DynamicPagination";
import SearchImage from "../SearchImage";
import { notificationConfig } from "../../../../constants/notification";
import { useHttp } from "../../../../hooks/http.hook";
import { imageType } from '../../AddWordPage';

import styles from './ImagePagination.module.scss';

type ImagePaginationProps = {
    searchWord: string;
    images: imageType[];
    setImages: Dispatch<SetStateAction<imageType[] | undefined>>;
    setPickedImage: (images: string | ((prevImages: string) => string)) => void;
    onButtonClick: (ev: React.SyntheticEvent) => void;
    buttonText: string;
    loading?: boolean;
}

const ImagePagination = (props: ImagePaginationProps): React.ReactElement => {
    const { 
        searchWord, 
        images, 
        setImages,
        setPickedImage,
        onButtonClick,
        buttonText,
        loading
    } = props;
    const [page, setPage] = useState<number>(2);
    const [maxPage, setMaxPage] = useState<number>(2);
    const { request } = useHttp();

    useEffect(() => {
      setPage(2);
    }, [searchWord])

    const dynamicPaginationHandler = (): Promise<void | string> => {
        return new Promise((res, rej) => {
        const nextPage: Promise<void | string> = getImages(searchWord, page)
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
          toast.error(e, notificationConfig);
          console.log('ERROR:', e);
        }
    }

    const imageTile = (images: imageType[], chunks: number) => {
        const columns = [...Array(chunks)].map((_, c) => images.filter((_, i) => i % chunks === c));
        return columns.map(column => column.map(el=> {
          return (
            <SearchImage 
              key={el.url} 
              url={el.url} 
              buttonText={buttonText}
              active={el.active} 
              loading={loading} 
              onClickCard={() => {
                const index = images.findIndex(image => image.url === el.url);
                const updatedImages = images.map((image, i) => {
                  if (i === index) return {url: image.url, active: true}
                  return {url: image.url, active: false}
                })
                setImages(updatedImages);
                setPickedImage(el.url);
              }}
              onButtonClick={onButtonClick}
            />
          )
        }))
    }

    return (
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
    )
}

export default observer(ImagePagination);