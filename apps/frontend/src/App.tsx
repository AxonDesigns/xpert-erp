import { useEffect } from 'react';
import api from '@frontend/lib/axios';
import { AxiosError } from 'axios';

function App() {
  useEffect(() => {
    try {
      api.get('/')
    } catch (error) {
      if (error instanceof AxiosError)
        console.error(error.response);
    }
  }, []);

  return (
    <>

    </>
  )
}

export default App
