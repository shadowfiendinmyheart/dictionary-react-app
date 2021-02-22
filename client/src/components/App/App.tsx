import React from 'react';
import { BrowserRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import useRoutes from '../../routes';

import Header from '../Header';
import Footer from '../Footer';

import styles from './App.module.scss';

function App():React.ReactElement {
  const router = useRoutes(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <BrowserRouter>
          <Header isAuth={false}/>
          <Switch>
            {router}
          </Switch>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
