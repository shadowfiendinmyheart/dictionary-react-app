import React from 'react';

import styles from './Card.module.scss';

type cardProps = {
    word: string;
    translate: string;
    url: string;
}

const Card = (props: cardProps): React.ReactElement => {
    const { word, translate, url } = props;

    return (
        <div className={styles.wrapper} style={{ backgroundImage: `url(${url})` }}>
            <div className={styles.word}>{word}</div>
            <div className={styles.translate}>{translate}</div>
        </div>
    )
}

export default Card;