import React from 'react';
import Loader from '../../components/Loader';

import styles from './LoadingPage.module.scss';

const LoadingPage = (): React.ReactElement => {
    return (
        <div className={styles.wrapper}>
            <Loader />
        </div>
    )
}

export default LoadingPage;