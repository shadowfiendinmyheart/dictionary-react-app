import React from 'react';

import styles from './WelcomePage.module.scss';

const WelcomePage = ():React.ReactElement => {
	return (
		<div className={styles.container}>
			<div className={styles.authWindow}></div>
		</div>
	)
};

export default WelcomePage;