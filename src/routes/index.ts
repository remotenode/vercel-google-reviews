import { Router } from 'express';
import { reviewsController } from '../controllers/reviewsController';
import { documentationController } from '../controllers/documentationController';

const router = Router();

// Health and info endpoints
router.get('/health', documentationController.getHealth.bind(documentationController));
router.get('/info', documentationController.getApiInfo.bind(documentationController));

// Documentation endpoints
router.get('/swagger', documentationController.getSwaggerUI.bind(documentationController));
router.get('/swagger.json', documentationController.getSwaggerSpec.bind(documentationController));

// Review endpoints
router.get('/app', reviewsController.getReviews.bind(reviewsController));
router.get('/app/info', reviewsController.getAppInfo.bind(reviewsController));
router.get('/app/search', reviewsController.searchApps.bind(reviewsController));
router.get('/app/suggestions', reviewsController.getAppSuggestions.bind(reviewsController));

// Catch-all route for undefined endpoints
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    statusCode: 404,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  });
});

export default router;
