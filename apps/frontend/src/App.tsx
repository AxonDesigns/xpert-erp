import { useEffect } from 'react';
import apiClient from '@repo/api-client'

function App() {
  useEffect(() => {
    const client = apiClient('http://localhost:3000/api/');

    client.users.$get().then((res) => res.json()).then(e => console.log(e));
  }, []);

  return (
    <>

    </>
  )
}

export default App
