import { logger } from '../../utils/logger';

export interface SystemdServiceInfo {
  name: string;
  description: string;
  loadState: string;
  activeState: string;
  subState: string;
}

export class DbusService {
  private connected = false;

  async connect(): Promise<void> {
    try {
      logger.info('D-Bus connection simulated (development mode)');
      this.connected = true;
    } catch (error) {
      logger.warn('D-Bus not available, running in simulation mode', { error });
      this.connected = false;
    }
  }

  async startService(serviceName: string): Promise<boolean> {
    if (!this.connected) {
      logger.info(`[DBUS SIM] Starting service: ${serviceName}`);
      return true;
    }

    try {
      logger.info(`Starting systemd service: ${serviceName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to start service ${serviceName}`, { error });
      return false;
    }
  }

  async stopService(serviceName: string): Promise<boolean> {
    if (!this.connected) {
      logger.info(`[DBUS SIM] Stopping service: ${serviceName}`);
      return true;
    }

    try {
      logger.info(`Stopping systemd service: ${serviceName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to stop service ${serviceName}`, { error });
      return false;
    }
  }

  async getServiceStatus(serviceName: string): Promise<SystemdServiceInfo | null> {
    if (!this.connected) {
      return {
        name: serviceName,
        description: `FFmpeg service ${serviceName}`,
        loadState: 'loaded',
        activeState: 'active',
        subState: 'running',
      };
    }

    try {
      return null;
    } catch (error) {
      logger.error(`Failed to get status for service ${serviceName}`, { error });
      return null;
    }
  }

  async listServices(pattern = 'ffmpeg-*'): Promise<SystemdServiceInfo[]> {
    if (!this.connected) {
      logger.info(`[DBUS SIM] Listing services matching: ${pattern}`);
      return [];
    }

    return [];
  }
}
