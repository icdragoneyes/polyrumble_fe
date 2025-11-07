import { useEffect, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import websocketService from '../services/websocket';
import type {
  PoolUpdatedEvent,
  PoolCreatedEvent,
  PoolStatusChangedEvent,
  PoolCancelledEvent,
} from '../services/websocket';

export function useWebSocket() {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = websocketService.connect();

    const handleConnect = () => {
      console.log('[useWebSocket] Connected');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('[useWebSocket] Disconnected');
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    setIsConnected(socket.connected);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  const onPoolUpdated = useCallback(
    (callback: (event: PoolUpdatedEvent) => void) => {
      websocketService.onPoolUpdated((event) => {
        console.log('[useWebSocket] Pool updated:', event);
        callback(event);
        queryClient.invalidateQueries({ queryKey: ['pools'] });
      });

      return () => websocketService.off('pool:updated');
    },
    [queryClient]
  );

  const onPoolCreated = useCallback(
    (callback: (event: PoolCreatedEvent) => void) => {
      websocketService.onPoolCreated((event) => {
        console.log('[useWebSocket] Pool created:', event);
        callback(event);
        queryClient.invalidateQueries({ queryKey: ['pools'] });
      });

      return () => websocketService.off('pool:created');
    },
    [queryClient]
  );

  const onPoolStatusChanged = useCallback(
    (callback: (event: PoolStatusChangedEvent) => void) => {
      websocketService.onPoolStatusChanged((event) => {
        console.log('[useWebSocket] Pool status changed:', event);
        callback(event);
        queryClient.invalidateQueries({ queryKey: ['pools'] });
      });

      return () => websocketService.off('pool:status_changed');
    },
    [queryClient]
  );

  const onPoolCancelled = useCallback(
    (callback: (event: PoolCancelledEvent) => void) => {
      websocketService.onPoolCancelled((event) => {
        console.log('[useWebSocket] Pool cancelled:', event);
        callback(event);
        queryClient.invalidateQueries({ queryKey: ['pools'] });
      });

      return () => websocketService.off('pool:cancelled');
    },
    [queryClient]
  );

  return {
    isConnected,
    onPoolUpdated,
    onPoolCreated,
    onPoolStatusChanged,
    onPoolCancelled,
  };
}
