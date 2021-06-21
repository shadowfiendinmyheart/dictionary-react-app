import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import WelcomePage from './pages/welcomePage';
import HomePage from './pages/homePage';
import AddWordPage from './pages/addWordPage';
import ErrorPage from './pages/errorPage';

import { ROUTES } from './constants/routes';

const useRoutes = (isAuth: boolean) => {
  if (isAuth) {
    return (
      <Switch>
        <Route path={ROUTES.HOME_PAGE} exact={true}>
          <HomePage />
        </Route>
        <Route path={ROUTES.ADD_WORD_PAGE}  >
          <AddWordPage />
        </Route>
        <Route path={ROUTES.ERROR_PAGE}  >
          <ErrorPage />
        </Route>

        <Redirect to={ROUTES.ERROR_PAGE} />
      </Switch>
    )
  }

  return (
    <Switch>
        <Route path={ROUTES.WELCOME_PAGE} exact={true}>
          <WelcomePage />
        </Route>
    </Switch>
  )
}

export default useRoutes;