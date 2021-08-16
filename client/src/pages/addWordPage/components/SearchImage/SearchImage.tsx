import React from 'react';
import Button from '../../../../components/Button';

import styles from './SearchImage.module.scss';

type searchImageProps = {
    url: string;
    active: boolean;
    onClickCard: () => void;
    onCreateCard: (ev: React.SyntheticEvent) => void;
}

const SearchImage = (props: searchImageProps):React.ReactElement => {
    const { url, active, onClickCard, onCreateCard } = props;

    return (
        active ? (
            <div className={styles.pickedImage}>
                <img
                    className={styles.searchImage}
                    onClick={onClickCard}
                    src={url}
                />
                <Button 
                    onClick={onCreateCard} 
                    text={'Добавить карточку'}
                    classNameUpdate={styles.pickButton} 
                />
            </div>
        ) : (
            <img
              className={styles.searchImage}
              onClick={onClickCard}
              src={url}
            />
        )
    )
}

export default SearchImage;