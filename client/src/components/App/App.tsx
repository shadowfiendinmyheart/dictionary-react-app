import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import useRoutes from '../../routes';
import useAuth from '../../hooks/auth.hook';
import AuthContext from '../../context/AuthContext';

import Header from '../Header';
import Footer from '../Footer';

import styles from './App.module.scss';

function App():React.ReactElement {
  const { login, logout, token, userId } = useAuth();
  const isAuth = Boolean(token);
  const router = useRoutes(isAuth);

  return (
    <AuthContext.Provider value={{
      token, userId, login, logout, isAuth
    }}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <BrowserRouter>
            <Header isAuth={isAuth}/>
              {router}
            <Footer />
          </BrowserRouter>
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
