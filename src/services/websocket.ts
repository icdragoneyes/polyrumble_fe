import { io, Socket } from 'socket.io-client';
import { env } from '../config/env';

export interface PoolUpdatedEvent {
  type: 'pool:updated';
  data: {
    poolId: string;
    poolNumber: number;
    poolATotal: string;
    poolBTotal: string;
    totalPoolSize: string;
  };
  timestamp: string;
}

export interface PoolCreatedEvent {
  type: 'pool:created';
  data: {
    poolId: string;
    poolNumber: number;
    rumbleId: string;
    traderAAddress: string;
    traderBAddress: string;
    totalPoolSize: string;
    status: string;
  };
  timestamp: string;
}

export interface PoolStatusChangedEvent {
  type: 'pool:status_changed';
  data: {
    poolId: string;
    poolNumber: number;
    oldStatus: string;
    newStatus: string;
    metadata?: Record<string, any>;
  };
  timestamp: string;
}

export interface PoolCancelledEvent {
  type: 'pool:cancelled';
  data: {
    poolId: string;
    poolNumber: number;
    status: string;
    isCancelled: boolean;
  };
  timestamp: string;
}

export type WebSocketEvent =
  | PoolUpdatedEvent
  | PoolCreatedEvent
  | PoolStatusChangedEvent
  | PoolCancelledEvent;

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const wsUrl = env.apiUrl.replace('/api/v1', '');

    this.socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();

    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[WebSocket] Connected to server');
      this.reconnectAttempts = 0;
      this.socket?.emit('join_room', { room: 'global' });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('[WebSocket] Max reconnection attempts reached');
      }
    });

    this.socket.on('error', (error) => {
      console.error('[WebSocket] Error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  onPoolUpdated(callback: (event: PoolUpdatedEvent) => void) {
    this.socket?.on('pool:updated', callback);
  }

  onPoolCreated(callback: (event: PoolCreatedEvent) => void) {
    this.socket?.on('pool:created', callback);
  }

  onPoolStatusChanged(callback: (event: PoolStatusChangedEvent) => void) {
    this.socket?.on('pool:status_changed', callback);
  }

  onPoolCancelled(callback: (event: PoolCancelledEvent) => void) {
    this.socket?.on('pool:cancelled', callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
