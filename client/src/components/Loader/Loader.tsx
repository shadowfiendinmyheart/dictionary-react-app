import React from 'react';

import styles from './Loader.module.scss';

type loaderProps = {
    size?: 's' | 'm' | 'l';
}

const Loader = (props: loaderProps):React.ReactElement => {
    const { size } = props;

    let px;
    switch(size) {
        case 's': 
            px = '24px';
            break;
        case 'm': 
            px = '36px';
            break;
        case 'l': 
            px = '48px';
            break;
        default:
            px = '36px' 
    } 

    return (
        <svg className={styles.spinner} width={px} height={px} viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle className={styles.path} fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
        </svg>
    )
}

export default Loader;