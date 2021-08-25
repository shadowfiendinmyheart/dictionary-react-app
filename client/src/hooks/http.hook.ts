import { useState, useCallback } from 'react';
import user from '../store/user';

export const useHttp = () => {
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null);

  const request: any = useCallback(async (
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
          const refresh = await fetch('api/auth/refresh', {method: 'GET', headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }});

          const answer = await refresh.json();
          if (!refresh.ok) {
            return new Error(answer.message || 'Error . . .')
          }
          user.refresh(answer.tokens.accessToken);

          return await request(url, method, body, {...headers, Authorization: `Bearer ${user.token}`});
        }

        if (!response.ok) {
          throw new Error(`${response.status} ${data.message}` || 'Error . . .')
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
