import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AuthRouter from '../AuthRouter';
import user from '../../store/user';

import Header from '../Header';
import Footer from '../Footer';

import styles from './App.module.scss';
import 'react-toastify/dist/ReactToastify.css';

const App = ():React.ReactElement => {
  useEffect(() => {
    user.checkAuth();
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <BrowserRouter>
          <Header/>
            <AuthRouter/>
          <Footer/>
        </BrowserRouter>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
