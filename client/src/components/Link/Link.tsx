import React from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'clsx';

import styles from './Link.module.scss'

type LinkProps = {
  href: string,
  text: string,
  classNameUpdate?: string,
}

const Link = (props: LinkProps): React.ReactElement => {
  const {href, text, classNameUpdate} = props;
  
  return (
    <NavLink className={cn(styles.button, classNameUpdate)} to={href}>
      {text}
    </NavLink>
  )
}

export default Link;
