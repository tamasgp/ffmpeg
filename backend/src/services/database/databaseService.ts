import { AppDataSource } from '../../database/dataSource';
import { logger } from '../../utils/logger';

export async function initializeDatabase(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    logger.info('Database connection established');
  } catch (error) {
    logger.error('Failed to connect to database', { error });
    throw error;
  }
}
