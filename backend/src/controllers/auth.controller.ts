import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.services.js';
import { ApiResponse } from '../utils/ApiResponse.js';

//auth controller handles http requests
export class AuthController {
  //POST auth/register
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, name } = req.body;
      
      const result = await AuthService.register(email, password, name);
      
      res.status(201).json(
        ApiResponse.created(result, 'Registration successful').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

  //POST auth/login
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      
      const result = await AuthService.login(email, password);
      
      res.json(
        ApiResponse.success(result, 'Login successful').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

  //POST auth/refresh
  static async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;
      
      const tokens = await AuthService.refreshToken(refreshToken);
      
      res.json(
        ApiResponse.success(tokens, 'Token refreshed').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

  //GET auth/profiles
  static async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      
      const profile = await AuthService.getProfile(userId);
      
      res.json(
        ApiResponse.success(profile).toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

  //PATCH auth/profiles
  static async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const updates = req.body;
      
      const profile = await AuthService.updateProfile(userId, updates);
      
      res.json(
        ApiResponse.success(profile, 'Profile updated').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

  //POST /auth/change-password
  static async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { currentPassword, newPassword } = req.body;
      
      await AuthService.changePassword(userId, currentPassword, newPassword);
      
      res.json(
        ApiResponse.success(null, 'Password changed successfully').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }
}