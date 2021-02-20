import React from 'react';
import { BrowserRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import Header from '../Header';
import Footer from '../Footer';
import WelcomePage from '../../pages/welcomePage';
import HomePage from '../../pages/homePage';
import ErrorPage from '../../pages/errorPage';

import styles from './App.module.scss';

function App():React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route 
              exact={true}
              path="/"
              component={WelcomePage}
            />
            <Route
              path="/home"
              component={HomePage}
            />
            <Route 
              path='*'
              component={ErrorPage}
            />
          </Switch>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
