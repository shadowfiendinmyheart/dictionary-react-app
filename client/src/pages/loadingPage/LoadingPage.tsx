import React from 'react';
import Loader from '../../components/Loader';

import styles from './LoadingPage.module.scss';

const LoadingPage = (): React.ReactElement => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.window}>
                <Loader />
            </div>
        </div>
    )
}

export default LoadingPage;