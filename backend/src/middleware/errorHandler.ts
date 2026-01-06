import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/environment.js';

//global error handler
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // ApiError (custom errors)
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
      ...(config.server.isDevelopment && { stack: error.stack }),
    });
    return;
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.message,
    });
    return;
  }

  // Mongoose CastError (invalid ObjectId)
  if (error.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
    return;
  }

  // Mongoose duplicate key error
  if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyValue)[0];
    res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
    return;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
    return;
  }

  // Unknown errors
  res.status(500).json({
    success: false,
    message: config.server.isProduction
      ? 'Internal server error'
      : error.message,
    ...(config.server.isDevelopment && { stack: error.stack }),
  });
}

//404 handler
export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  next(ApiError.notFound(`Route ${req.method} ${req.path} not found`));
}