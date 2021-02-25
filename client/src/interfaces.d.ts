export interface IAuthContext {
  token: null | string,
  userId: null | string,
  login: (jwtToken: string, id: string) => void,
  logout: () => void,
  isAuth: boolean,
}
