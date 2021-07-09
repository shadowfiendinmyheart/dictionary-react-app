import React from 'react';
import { NavLink } from 'react-router-dom';
import cn from 'clsx';

import styles from './Link.module.scss'

type LinkProps = {
  href: string,
  text: string,
  onClick?: () => void,
  classNameUpdate?: string,
}

const Link = (props: LinkProps): React.ReactElement => {
  const {href, text, onClick, classNameUpdate} = props;
  
  return (
    <NavLink
      className={cn(styles.button, classNameUpdate)} 
      to={href}
      onClick={onClick}
    >
      {text}
    </NavLink>
  )
}

export default Link;
