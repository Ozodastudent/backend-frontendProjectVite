import axios from 'axios';
import { useEffect, useState } from 'react';

function MyComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => setData(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      {data.map(item => <p key={item.id}>{item.title}</p>)}
    </div>
  );
}

export default MyComponent;