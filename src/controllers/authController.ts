import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/config/database';
import { config } from '@/config/config';
import { AppError } from '@/utils/AppError';
import { AuthRequest } from '@/middleware/auth';
import { ApiResponse } from '@/types';

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, firstName, lastName, phone } = req.body;

            // Check if user exists
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                throw new AppError('Email already registered', 400);
            }

            // Hash password - CORREGIDO: usar 'password' en lugar de 'passwordHash'
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create user - CORREGIDO
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword, // <-- Cambiado a 'password'
                    firstName,
                    lastName,
                    phone,
                    status: 'PENDING'
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    status: true,
                    createdAt: true
                }
            });

            // Generate token
            if (!config.jwtSecret) {
                throw new AppError('JWT secret not configured', 500);
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn }
            );

            const response: ApiResponse<{ user: typeof user; token: string }> = {
                status: 'success',
                data: { user, token },
                message: 'User registered successfully'
            };

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                throw new AppError('Invalid credentials', 401);
            }

            // Check password - CORREGIDO: usar 'password' en lugar de 'passwordHash'
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new AppError('Invalid credentials', 401);
            }

            if (user.status !== 'ACTIVE') {
                throw new AppError('Account not activated', 401);
            }

            // Generate token
            if (!config.jwtSecret) {
                throw new AppError('JWT secret not configured', 500);
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn }
            );

            const response: ApiResponse<{ user: Omit<typeof user, 'password'>; token: string }> = {
                status: 'success',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        status: user.status,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt
                    },
                    token
                },
                message: 'Login successful'
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user!.id },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    role: true,
                    status: true,
                    avatar: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            const response: ApiResponse<typeof user> = {
                status: 'success',
                data: user
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { firstName, lastName, phone } = req.body;

            const user = await prisma.user.update({
                where: { id: req.user!.id },
                data: {
                    firstName,
                    lastName,
                    phone
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    role: true,
                    status: true,
                    avatar: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            const response: ApiResponse<typeof user> = {
                status: 'success',
                data: user,
                message: 'Profile updated successfully'
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { currentPassword, newPassword } = req.body;

            const user = await prisma.user.findUnique({
                where: { id: req.user!.id }
            });

            if (!user) {
                throw new AppError('User not found', 404);
            }

            // Verify current password - CORREGIDO
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new AppError('Current password is incorrect', 400);
            }

            // Hash new password
            const newHashedPassword = await bcrypt.hash(newPassword, 12);

            // Update password - CORREGIDO
            await prisma.user.update({
                where: { id: req.user!.id },
                data: { password: newHashedPassword }
            });

            const response: ApiResponse<null> = {
                status: 'success',
                message: 'Password changed successfully'
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }
}