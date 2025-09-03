import { VercelRequest, VercelResponse } from '@vercel/node';
import { HealthController } from '../controllers/healthController.js';

export class HealthRoutes {
  /**
   * Handle health check route
   */
  static handleHealth(req: VercelRequest, res: VercelResponse): void {
    return HealthController.getHealth(req, res);
  }
}
