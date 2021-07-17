import { useState, useCallback } from 'react';

export const useHttp = () => {
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null);

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
        
        if (!response.ok) {
          throw new Error(data.message || 'Error . . .')
        }
        
        setLoading(false);

        const headersFromRes: any = {};
        response.headers.forEach((value, name) => {
          headersFromRes[name] = value;
        });
        data['headers'] = headersFromRes;

        return data;
      } catch (e) {
        setLoading(false);
        setError(e.message);
        throw e;
      }
    }, [])

  const clearAnswer = useCallback(() => setError(null), []);

  return { loading, request, error, clearAnswer }
}
