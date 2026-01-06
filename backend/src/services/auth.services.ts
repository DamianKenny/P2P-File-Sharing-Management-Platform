import jwt from 'jsonwebtoken';
import { Secret } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { User, IUser } from '../models/User.model.js';
import { config } from '../config/environment.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

// Token payload interface
interface TokenPayload {
  userId: string;
  email: string;
}

// Token response interface
interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

// User response (without sensitive data)
interface UserResponse {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  storageUsed: number;
  storageLimit: number;
  createdAt: Date;
}

/**
 * Auth Service
 * Handles user authentication, registration, and token management
 */
export class AuthService {
  /**
   * Register a new user
   */
  static async register(
    email: string,
    password: string,
    name: string
  ): Promise<{ user: UserResponse; tokens: TokenResponse }> {
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
    });

    logger.info(`New user registered: ${email}`);

    // Generate tokens
    const tokens = this.generateTokens({
      userId: user._id.toString(),
      email: user.email,
    });

    return {
      user: this.formatUser(user),
      tokens,
    };
  }

  /**
   * Login user
   */
  static async login(
    email: string,
    password: string
  ): Promise<{ user: UserResponse; tokens: TokenResponse }> {
    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.unauthorized('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    logger.info(`User logged in: ${email}`);

    // Generate tokens
    const tokens = this.generateTokens({
      userId: user._id.toString(),
      email: user.email,
    });

    return {
      user: this.formatUser(user),
      tokens,
    };
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        config.jwt.refreshSecret
      ) as TokenPayload & { iat: number; exp: number };

      // Check if user still exists and is active
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw ApiError.unauthorized('Invalid refresh token');
      }

      // Generate new tokens
      return this.generateTokens({
        userId: user._id.toString(),
        email: user.email,
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw ApiError.unauthorized('Refresh token expired');
      }
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.unauthorized('Invalid refresh token');
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(userId: string): Promise<UserResponse> {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return this.formatUser(user);
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    updates: { name?: string; avatar?: string | null }
  ): Promise<UserResponse> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    logger.info(`User profile updated: ${user.email}`);
    return this.formatUser(user);
  }

  /**
   * Change password
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw ApiError.badRequest('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);
  }

//generate access token
  private static generateTokens(payload: TokenPayload): TokenResponse {
    const accessToken = jwt.sign({...payload}, config.jwt.secret as Secret, {
      expiresIn: config.jwt.expiresIn as any,
    });

    const refreshToken = jwt.sign({...payload}, config.jwt.refreshSecret as Secret, {
      expiresIn: config.jwt.refreshExpiresIn as any,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: config.jwt.expiresIn,
    };
  }

  //format user for response
  private static formatUser(user: IUser): UserResponse {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      avatar: user.avatar || null,
      storageUsed: user.storageUsed,
      storageLimit: user.storageLimit,
      createdAt: user.createdAt,
    };
  }
}