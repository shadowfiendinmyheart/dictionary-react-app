import React, { useRef, useEffect, useState } from 'react';
import cn from 'clsx';

import styles from './Popup.module.scss';

type popupProps = {
    content: JSX.Element;
    visible: boolean;
    cb: () => void;
}

const Popup = (props: popupProps): React.ReactElement => {
    const { content, visible, cb } = props;
    const backgroundRef = useRef<any>(null);

    useEffect(() => {
        const handler = (event: any) => {
            if (backgroundRef.current === event.target) {
                cb();
            }
        };

        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        };
    })

    return (
        <div 
            className={cn((!visible && styles.visible),styles.background)}
            ref={backgroundRef}
        >
            <div className={styles.content}>
                {content}
            </div>
        </div>
    )
}

export default Popup;