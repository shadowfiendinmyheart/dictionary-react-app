import { useState, useCallback, useEffect } from 'react';

const storageName: string = 'userData';

const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const login = useCallback((jwtToken: string, id: string) => {
    console.log()
    setToken(jwtToken);
    setUserId(id);
    
    localStorage.setItem(storageName, JSON.stringify({
      userId: id, token: jwtToken
    }))
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);

    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data: {userId: string | null, token: string | null} = JSON.parse(localStorage.getItem(storageName) || '{}');
    if (data && data.token && data.userId) {
      login(data.token, data.userId);
    }
  }, [login])

  return { login, logout, token, userId }
}

export default useAuth;