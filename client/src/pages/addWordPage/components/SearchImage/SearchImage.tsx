import React from 'react';
import Button from '../../../../components/Button';

import styles from './SearchImage.module.scss';

type searchImageProps = {
    url: string;
    active: boolean;
    buttonText: string;
    onClickCard: () => void;
    onButtonClick: (ev: React.SyntheticEvent) => void;
    loading?: boolean;
}

const SearchImage = (props: searchImageProps):React.ReactElement => {
    const { url, active, buttonText, onClickCard, onButtonClick, loading } = props;

    return (
        active ? (
            <div className={styles.pickedImage}>
                <img
                    className={styles.searchImage}
                    onClick={onClickCard}
                    src={url}
                />
                <Button 
                    onClick={onButtonClick} 
                    text={buttonText}
                    classNameUpdate={styles.pickButton}
                    disabled={loading}
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