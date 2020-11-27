import React from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'clsx';

import styles from './HeaderButton.module.scss'

type HeaderButtonProps = {
  href: string,
  text: string,
  classNameUpdate?: string,
}

const HeaderButton = (props: HeaderButtonProps): React.ReactElement => {
  const {href, text, classNameUpdate} = props;
  
  return (
    <NavLink className={cn(styles.button, classNameUpdate)} to={href}>
      {text}
    </NavLink>
  )
}

export default HeaderButton;
