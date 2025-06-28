import { useEffect, useRef } from 'react';

export function useWebSocket(url) {
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket('wss://katlavan24.uz/api/v1/ws/customer/user1'); // Updated to real URL
    wsRef.current.onopen = () => console.log('WebSocket connected');
    wsRef.current.onmessage = (event) => console.log('Message received:', event.data);
    wsRef.current.onerror = (error) => console.error('WebSocket error:', error);
    wsRef.current.onclose = () => console.log('WebSocket disconnected');

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  return wsRef.current;
}