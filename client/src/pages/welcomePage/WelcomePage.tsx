import React from 'react';

import LoginForm from './components/loginForm';
import RegistrationForm from './components/registrationForm';

import styles from './WelcomePage.module.scss';

const WelcomePage = ():React.ReactElement => {
	return (
		<div className={styles.container}>
			<div className={styles.authWindow}>
				<div className={styles.login}>
					<LoginForm />
				</div>
				<hr className={styles.split} />
				<div className={styles.registration}>
					<RegistrationForm />
				</div>
			</div>
		</div>
	)
};

export default WelcomePage;