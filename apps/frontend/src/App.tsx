import { useEffect } from 'react';
import apiClient from '@repo/api-client';

function App() {
  useEffect(() => {
    const test = async () => {
      const client = apiClient('http://localhost:3000/api/');
      const result = await client.auth.me.$get({}, {
        init: {
          credentials: 'include'
        }
      });
      const data = await result.json();
      if (result.status === 200) {
        console.log(data);
      } else {
        const loginRes = await client.auth.login.$post({
          json: {
            email: 'admin@admin.com',
            password: '12345678'
          }
        }, {
          init: {
            credentials: 'include'
          }
        });
        console.log(await loginRes.json());
      }
    }
    test();
  }, []);

  return (
    <>

    </>
  )
}

export default App
