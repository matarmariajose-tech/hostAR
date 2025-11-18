import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { prisma } from '../config/database';
import { AppError } from '../utils/AppError';

interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new AppError('Access token required', 401);
        }

        const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true, status: true }
        });

        if (!user) {
            throw new AppError('User not found', 401);
        }

        if (user.status !== 'ACTIVE') {
            throw new AppError('Account suspended', 401);
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new AppError('Invalid token', 401));
        } else {
            next(error);
        }
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('Authentication required', 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError('Insufficient permissions', 403));
        }

        next();
    };
};