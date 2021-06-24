import React from 'react';
import cn from 'clsx';

import styles from './SearchImage.module.scss';

type searchImageProps = {
    url: string;
    active: boolean;
    cb: () => void;
}

const SearchImage = (props: searchImageProps):React.ReactElement => {
    const { url, active, cb } = props;

    return (
        <img
          className={cn(styles.searchImage, (active && styles.pickedImage))}
          onClick={() => cb()} 
          src={url}
        />
    )
}

export default SearchImage;