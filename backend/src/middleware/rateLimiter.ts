import rateLimit from 'express-rate-limit';
import { config } from '../config/environment.js';
import { ApiError } from '../utils/ApiError.js';

//standard rate limiter
export const standardLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests());
  },
});

//strict limiter for auth routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests('Too many login attempts'));
  },
});

//upload rate limiter
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests('Upload limit reached'));
  },
});