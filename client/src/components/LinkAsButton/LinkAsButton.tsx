import React from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'clsx';

import styles from './LinkAsButton.module.scss';

type LinkAsButtonProps = {
  text: string,
  to: string,
  updateClassName?: string,
}

const LinkAsButton = (props: LinkAsButtonProps): React.ReactElement => {

  const { text, to, updateClassName } = props;

  return (
    <div className={cn(updateClassName, styles.container)}>
      <NavLink className={styles.btn} to={to}>
        {text}
      </NavLink>
    </div>
  )
};

export default LinkAsButton;