import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import user from '../../store/user';

import WelcomePage from '../../pages/welcomePage';
import HomePage from '../../pages/homePage';
import AddWordPage from '../../pages/addWordPage';
import DictionaryPage from '../../pages/dictionaryPage';
import ErrorPage from '../../pages/errorPage';
import LoadingPage from '../../pages/loadingPage/LoadingPage';
import GameTranslationPage from '../../pages/gameTranslationPage';

import { ROUTES } from '../../constants/routes';

const AuthRouter = observer((): React.ReactElement => {
  if (user.loading) return <LoadingPage />

  if (user.isAuth) {
    return (
      <Switch>
        <Route path={ROUTES.HOME_PAGE} exact={true}>
          <HomePage />
        </Route>
        <Route path={ROUTES.ADD_WORD_PAGE}>
          <AddWordPage />
        </Route>
        <Route path={ROUTES.DICTIONARY_PAGE}>
          <DictionaryPage />
        </Route>
        <Route path={ROUTES.GAME_TRANSLATION_PAGE}>
          <GameTranslationPage />
        </Route>
        <Route path={ROUTES.ERROR_PAGE}>
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
});

export default AuthRouter;