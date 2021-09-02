import React, { useRef, useEffect } from 'react';
import cn from 'clsx';

import styles from './Popup.module.scss';

type popupProps = {
    children: JSX.Element;
    visible: boolean;
    onClosePopup: () => void;
}

// TODO: фиксануть position(!) 
const Popup = (props: popupProps): React.ReactElement => {
    const { children, visible, onClosePopup } = props;
    const backgroundRef = useRef<any>(null);

    useEffect(() => {
        const handler = (event: Event) => {
            if (backgroundRef.current === event.target) {
                onClosePopup();
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
            {children}
        </div>
    )
}

export default Popup;