import { useState, useCallback } from 'react';

export const useHttp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string | null>(null);

  const request = useCallback(async (
      url: string, 
      method: string = 'GET', 
      body: any = null, //fix later ! ! ! 
      headers: any = {} //fix too ! ! !
    ) => {
    try {
      if (body) {
        body = JSON.stringify(body);
        headers['Content-Type'] = 'application/json'
      }

      console.log('request:\n', 'body:', body, '\nheaders: ', headers);
      const response: Response = await fetch(url, {method, body, headers})
      const data: any = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error . . .')
      }
      
      setLoading(false);
      if (data.message) {
        setAnswer(data.message);
      }
      return data;
    } catch (e) {
      setLoading(false);
      if (e.message) {
        setAnswer(e.message);
      }
      throw e;
    }
  }, [])

  const clearAnswer = () => setAnswer(null);

  return { loading, request, answer, clearAnswer }
}
