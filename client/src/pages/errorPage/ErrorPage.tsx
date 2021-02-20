import React from 'react';
import Link from '../../components/Link';

import styles from './ErrorPage.module.scss';

const ErrorPage = (): React.ReactElement => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.errorWindow}>
        <p className={styles.errorText}>Поздравляю, вы попали не туда</p>
        <Link href='/' text='Вернуться назад' />
      </div>
    </div>
  )
}

export default ErrorPage;