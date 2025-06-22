import { useEffect, useRef } from 'react';

export function useWebSocket(url) {
  const wsRef = useRef(null);

  useEffect(() => {
    // Temporarily disable WebSocket since no server is running
    // wsRef.current = new WebSocket('ws://localhost:8000/ws/1');
    wsRef.current = null; // Placeholder until server is set up
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  return wsRef.current;
}