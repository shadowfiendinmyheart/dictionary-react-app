import React from 'react';
import { BrowserRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import Header from '../Header';
import Footer from '../Footer';
import WelcomePage from '../../pages/welcomePage';

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
              path='*'
              component={():React.ReactElement => {
                return (
                  <div>
                    404, page not found
                  </div>
                )
              }}
            />
          </Switch>
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
