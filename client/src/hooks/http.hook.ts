import { useState, useCallback } from 'react';

export const useHttp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

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

      const response: Response = await fetch(url, {method, body, headers})
      const data: any = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error . . .')
      }
      
      setLoading(false);
      setMessage(data.message);
      return data;
    } catch (e) {
      setLoading(false);
      setError(e.message);
      throw e;
    }
  }, [])

  const clearError = () => setError(null);
  const clearMessage = () => setMessage('');

  return { loading, request, error, message, clearError, clearMessage }
}
