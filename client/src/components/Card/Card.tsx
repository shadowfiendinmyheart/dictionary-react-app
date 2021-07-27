import React, { useState } from 'react';
import cn from 'clsx';

import styles from './Card.module.scss';

export enum sizeVariant {
    s = '250px',
    m = '500px',
    l = '750px'
}

interface cardProps {
    word: string;
    translate: string;
    url: string;
    size?: sizeVariant;
}


const Card = (props: cardProps): React.ReactElement => {
    const { word, translate, url, size } = props;

    const [roll, setRoll] = useState(false);
    
    const wrapperStyle = {
        width: size,
        height: size,
    }

    return (
        <div className={styles.wrapper} style={wrapperStyle}>
            <div 
                onClick={() => setRoll(!roll)} 
                className={cn(styles.card, roll && styles.roll)}
            >
                <div 
                    className={cn(styles.front, styles.side)} 
                    style={{backgroundImage: `url(${url})`}}
                >
                    <div className={styles.word}>{word}</div>
                </div>
                <div className={cn(styles.back, styles.side)}>
                    <div className={styles.translate}>
                        {translate}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card;