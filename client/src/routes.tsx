import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import WelcomePage from './pages/welcomePage';
import HomePage from './pages/homePage';
import AddWordPage from './pages/addWordPage';
import ErrorPage from './pages/errorPage';

import { ROUTES } from './constants/routes';

const useRoutes = (isAuth: boolean) => {
  console.log('useRoutes', isAuth);
  if (isAuth) {
    return (
      <Switch>
        <Route path={ROUTES.HOME_PAGE} exact={true}>
          <HomePage />
        </Route>
        <Route path={ROUTES.ADD_WORD_PAGE} >
          <AddWordPage />
        </Route>

        <Redirect to={ROUTES.HOME_PAGE} />
      </Switch>
    )
  }

  return (
    <Switch>
        <Route path={ROUTES.WELCOME_PAGE} exact={true}>
          <WelcomePage />
        </Route>

        <Redirect to={ROUTES.WELCOME_PAGE} />
    </Switch>
  )
}

export default useRoutes;