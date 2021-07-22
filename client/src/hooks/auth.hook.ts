import { useState, useCallback, useEffect } from 'react';

const storageName: string = 'userData';

const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const login = useCallback((jwtToken: string, id: string) => {
    setToken(jwtToken);
    
    localStorage.setItem(storageName, JSON.stringify({
      userId: id, token: jwtToken
    }))
  }, []);

  const logout = useCallback(() => {
    setToken(null);

    localStorage.removeItem(storageName);
  }, []);

  const refreshToken = (token: string) => {
    setToken(prev => token);

    console.log('token', token);

    localStorage.setItem(storageName, JSON.stringify({
      token: token
    }))
  } 

  useEffect(() => {
    const data: {userId: string | null, token: string | null} = JSON.parse(localStorage.getItem(storageName) || '{}');
    console.log('data', data);
    if (data && data.token) {
      login(data.token, 'mock');
    }
  }, [login])

  return { login, logout, token, userId, refreshToken }
}

export default useAuth;