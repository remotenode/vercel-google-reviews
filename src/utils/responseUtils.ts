/**
 * Response formatting utilities
 */

import { VercelResponse } from '../types/vercel';

/**
 * Send success response with data
 */
export function sendSuccessResponse(res: VercelResponse, data: any, message?: string) {
  return res.status(200).json({
    success: true,
    data: data,
    message: message || 'Reviews fetched successfully',
    timestamp: new Date().toISOString()
  });
}

/**
 * Send error response
 */
export function sendErrorResponse(res: VercelResponse, statusCode: number, error: string, details?: any) {
  return res.status(statusCode).json({
    success: false,
    error: error,
    details: details,
    statusCode: statusCode,
    timestamp: new Date().toISOString()
  });
}

/**
 * Send health check response
 */
export function sendHealthResponse(res: VercelResponse) {
  return res.status(200).json({
    success: true,
    message: 'Google Play Reviews API is healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    endpoints: {
      reviews: '/?appid={appId}&country={country}&lang={lang}&date={date}',
      health: '/health'
    }
  });
}

/**
 * Send not found response
 */
export function sendNotFoundResponse(res: VercelResponse, message?: string) {
  return res.status(404).json({
    success: false,
    error: message || 'Endpoint not found',
    statusCode: 404,
    timestamp: new Date().toISOString()
  });
}
