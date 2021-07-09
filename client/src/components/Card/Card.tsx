import React, { useState } from 'react';
import cn from 'clsx';

import styles from './Card.module.scss';

interface cardProps {
    word: string;
    translate: string;
    url: string;
    size?: 's' | 'm' | 'l';
}


const Card = (props: cardProps): React.ReactElement => {
    const { word, translate, url, size } = props;

    const [roll, setRoll] = useState(false);

    let px;
    switch (size) {
        case 's':
            px = '250px'
            break
        case 'm':
            px = '500px'
            break
        case 'l':
            px = '750px'
            break
        default:
            px = '500px'
    }
    
    const wrapperStyle = {
        width: px,
        height: px,
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