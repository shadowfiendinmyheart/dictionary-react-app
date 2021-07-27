import React, { useState, useEffect } from 'react';

type DynamicPaginationProps = {
    onScrollEnd: () => Promise<void | string>;
    currentPage: number;
    maxPage: number;
    children: JSX.Element | JSX.Element[];
}

const DynamicPagination = (props: DynamicPaginationProps): React.ReactElement => {
    const { onScrollEnd, currentPage, maxPage, children } = props;
    
    const [fetching, setFetching] = useState<boolean>(true);
    
    useEffect(() => {
        if (fetching) {
            onScrollEnd().then(() => setFetching(false));
        }
    }, [fetching]);
    
    useEffect(() => {
        document.addEventListener('scroll', scrollHandler);
        return () => {
            document.removeEventListener('scroll', scrollHandler);
        }
    }, [currentPage, maxPage]);

    const scrollHandler = (e: any) => {
        if ((e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) && (currentPage <= maxPage)) {
            setFetching(true);
        }
    }

    return (
        <>
            {children}
        </>
    )
}

export default DynamicPagination;