import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/logger';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error = err;

    logger.error(err);

    // Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        const message = 'Database operation failed';
        error = new AppError(message, 400);
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        const message = 'Validation failed';
        error = new AppError(message, 400);
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message
        });
    }

    // Default error
    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production'
            ? 'Something went wrong'
            : err.message
    });
};