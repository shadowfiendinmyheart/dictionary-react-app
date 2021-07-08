import React from 'react';
import Card from '../../../../components/Card';

import styles from './CreateCard.module.scss';

type createCardProps = {
    card: {
        word: string,
        translate: string,
        url: string
    },
    onCancelClick: () => void,
    onConfirmClick: () => void,
} 

const CreateCard = (props: createCardProps): React.ReactElement => {
    const { card, onCancelClick, onConfirmClick } = props;
    const { word, translate, url } = card;

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.header}>Сохранить карточку в словарь?</h3>
            <Card word={word} translate={translate} url={url} />
            <div className={styles.buttonsWrapper}>
                <svg onClick={onCancelClick} className={styles.test} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
                </svg>
                <svg onClick={onConfirmClick} className={styles.test} xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
                    <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                </svg>
            </div>
        </div>
    )
}

export default CreateCard;