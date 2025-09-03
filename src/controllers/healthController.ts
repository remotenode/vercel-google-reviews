import { VercelRequest, VercelResponse } from '@vercel/node';
import { HealthResponse } from '../types/index.js';

export class HealthController {
  /**
   * Handle health check request
   */
  static getHealth(req: VercelRequest, res: VercelResponse): void {
    const healthResponse: HealthResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '2.0.0'
    };
    
    res.status(200).json(healthResponse);
  }
}
