import React, { useState, useEffect } from 'react';

type DynamicPaginationProps = {
    onScrollEnd: () => Promise<void | string>;
    children: JSX.Element;
}

const DynamicPagination = (props: DynamicPaginationProps): React.ReactElement => {
    const { onScrollEnd, children } = props;

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
    }, []);

    const scrollHandler = (e: any) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
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