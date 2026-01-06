import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

interface ValidationSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

//validate request using zod
export function validateRequest(schemas: ValidationSchemas) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors: Record<string, string[]> = {};

      if (schemas.body) {
        try {
          req.body = schemas.body.parse(req.body);
        } catch (error) {
          if (error instanceof ZodError) {
            errors.body = error.errors.map(
              (e) => `${e.path.join('.')}: ${e.message}`
            );
          }
        }
      }

      if (schemas.params) {
        try {
          req.params = schemas.params.parse(req.params) as typeof req.params;
        } catch (error) {
          if (error instanceof ZodError) {
            errors.params = error.errors.map(
              (e) => `${e.path.join('.')}: ${e.message}`
            );
          }
        }
      }

      if (schemas.query) {
        try {
          req.query = schemas.query.parse(req.query) as typeof req.query;
        } catch (error) {
          if (error instanceof ZodError) {
            errors.query = error.errors.map(
              (e) => `${e.path.join('.')}: ${e.message}`
            );
          }
        }
      }

      if (Object.keys(errors).length > 0) {
        throw ApiError.badRequest('Validation failed', errors);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}