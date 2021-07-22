import { useState, useCallback } from 'react';
import useAuth from './auth.hook';

export const useHttp = () => {
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null);
  const { refreshToken } = useAuth();

  const request = useCallback(async (
      url: string, 
      method: string = 'GET',
      body: object | string | null = null,
      headers: any = {}
    ) => {
      try {
        if (body) {
          body = JSON.stringify(body);
          headers['Content-Type'] = 'application/json';
        }

        setLoading(true);
        const response: Response = await fetch(url, {method, body, headers});
        const data: any = await response.json();
        

        if (response.status === 401) {
          // const refresh = await fetch('api/auth/refresh', {'POST', {}, {}});
          const refresh = await fetch('api/auth/refresh', {method: 'GET', headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }});
          const answer = await refresh.json();

          refreshToken(answer.tokens.accessToken);

          const response: Response = await fetch(url, {method, body, headers: {...headers, 'Authorization': `Bearer ${answer.tokens.accessToken}`}});
          const data: any = await response.json();
        
          const headersFromRes: any = {};
          response.headers.forEach((value, name) => {
            headersFromRes[name] = value;
          });
          data['headers'] = headersFromRes;

          return data;
          /* 
          Authorization: `Bearer ${auth.token}`
          */
        }

        if (!response.ok) {
          throw new Error(data.message || 'Error . . .')
        }

        const headersFromRes: any = {};
        response.headers.forEach((value, name) => {
          headersFromRes[name] = value;
        });
        data['headers'] = headersFromRes;

        return data;
      } catch (e) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    }, [])

  const clearAnswer = useCallback(() => setError(null), []);

  return { loading, request, error, clearAnswer }
}
