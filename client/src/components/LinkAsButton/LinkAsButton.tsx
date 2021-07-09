import React from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'clsx';

import styles from './LinkAsButton.module.scss';

type LinkAsButtonProps = {
  classNameGrid: string,
  text: string,
  to: string,
}

const LinkAsButton = (props: LinkAsButtonProps): React.ReactElement => {

  const { classNameGrid, text, to } = props;

  return (
    <div className={cn(classNameGrid, styles.container)}>
      <NavLink className={styles.btn} to={to}>
        {text}
      </NavLink>
    </div>
  )
};

export default LinkAsButton;