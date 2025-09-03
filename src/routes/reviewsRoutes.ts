import { VercelRequest, VercelResponse } from '@vercel/node';
import { ReviewsController } from '../controllers/reviewsController.js';

export class ReviewsRoutes {
  /**
   * Handle reviews route
   */
  static async handleReviews(req: VercelRequest, res: VercelResponse): Promise<void> {
    return ReviewsController.getReviews(req, res);
  }
}
