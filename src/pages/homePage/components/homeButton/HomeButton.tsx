import React from 'react';
import cn from 'clsx';

import styles from './HomeButton.module.scss';

type HomeButtonProps = {
  classNameGrid: string,
  text: string,
  href: string,
}

const HomeButton = (props: HomeButtonProps): React.ReactElement => {

  const { classNameGrid, text, href } = props;

  return (
    <div className={cn(classNameGrid, styles.container)}>
      <a className={styles.btn} href={href}>
        {text}
      </a>
    </div>
  )
};

export default HomeButton;