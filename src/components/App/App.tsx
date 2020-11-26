import React from 'react';
import { BrowserRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import WelcomePage from '../../pages/welcomePage';

import styles from './App.module.scss';

function App():React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <BrowserRouter>
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
      </BrowserRouter>
    </div>
  );
}

export default App;
