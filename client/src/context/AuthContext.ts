import { createContext } from 'react';
import { IAuthContext } from '../interfaces';

const emptyFunc = () => {}

const AuthContext = createContext<IAuthContext>( {
  token: null,
  userId: null,
  login: emptyFunc,
  logout: emptyFunc,
  isAuth: false
})

export default AuthContext;