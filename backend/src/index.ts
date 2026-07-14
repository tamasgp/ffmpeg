import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './services/database/databaseService';
import { WebSocketService } from './services/websocket/websocketService';
import { DbusService } from './services/dbus/dbusService';
import { createApiRouter } from './api/routes';
import { logger } from './utils/logger';
import { AppDataSource } from './database/dataSource';

dotenv.config();

const PORT = Number.parseInt(process.env.PORT || '3001', 10);
const WS_PORT = Number.parseInt(process.env.WS_PORT || '3002', 10);

async function main(): Promise<void> {
  await initializeDatabase();

  const wsService = new WebSocketService(WS_PORT);
  const dbusService = new DbusService();
  await dbusService.connect();

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      wsClients: wsService.getClientCount(),
    });
  });

  app.use('/api', createApiRouter(wsService));

  const server = app.listen(PORT, () => {
    logger.info(`Backend server running on port ${PORT}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received, shutting down`);
    wsService.close();
    server.close();
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(0);
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
}

void main().catch((error) => {
  logger.error('Failed to start application', { error });
  process.exit(1);
});
