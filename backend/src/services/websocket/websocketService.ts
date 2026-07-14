import { WebSocketServer, WebSocket } from 'ws';
import { WebSocketMessage } from '../../types';
import { logger } from '../../utils/logger';

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(port = 3002) {
    this.wss = new WebSocketServer({ port });
    this.setupHandlers();
    logger.info(`WebSocket server listening on port ${port}`);
  }

  private setupHandlers(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      logger.info('New WebSocket client connected');
      this.clients.add(ws);

      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString()) as Record<string, unknown>;
          logger.debug('WebSocket message received', { message });
        } catch (error) {
          logger.error('Failed to parse WebSocket message', { error });
        }
      });

      ws.on('close', () => {
        logger.info('WebSocket client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error: Error) => {
        logger.error('WebSocket error', { error });
        this.clients.delete(ws);
      });

      const welcomeMessage: WebSocketMessage = {
        type: 'status_update',
        payload: { connected: true },
        timestamp: new Date().toISOString(),
      };
      ws.send(JSON.stringify(welcomeMessage));
    });
  }

  broadcast(message: WebSocketMessage): void {
    const data = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  getClientCount(): number {
    return this.clients.size;
  }

  close(): void {
    this.wss.close();
  }
}
