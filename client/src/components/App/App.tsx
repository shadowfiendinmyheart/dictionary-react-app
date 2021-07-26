import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AuthRouter from '../AuthRouter';

import Header from '../Header';
import Footer from '../Footer';

import styles from './App.module.scss';

const App = ():React.ReactElement => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <BrowserRouter>
          <Header/>
            <AuthRouter/>
          <Footer/>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
