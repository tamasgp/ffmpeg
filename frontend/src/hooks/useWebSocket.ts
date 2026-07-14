import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketMessage } from '../types';

const WS_URL = (import.meta.env.VITE_WS_URL as string | undefined) || 'ws://localhost:3002';

export function useWebSocket() {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const unmountedRef = useRef(false);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  const connect = useCallback(() => {
    if (unmountedRef.current || socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    socketRef.current = new WebSocket(WS_URL);

    socketRef.current.onopen = () => {
      setConnected(true);
    };

    socketRef.current.onmessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data as string) as WebSocketMessage;
        setLastMessage(message);
      } catch {
        // Ignore parse errors from unexpected payloads.
      }
    };

    socketRef.current.onclose = () => {
      setConnected(false);
      if (!unmountedRef.current) {
        reconnectTimerRef.current = window.setTimeout(() => {
          connect();
        }, 3000);
      }
    };

    socketRef.current.onerror = () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      unmountedRef.current = true;
      if (reconnectTimerRef.current !== null) {
        window.clearTimeout(reconnectTimerRef.current);
      }
      socketRef.current?.close();
    };
  }, [connect]);

  return { connected, lastMessage };
}
