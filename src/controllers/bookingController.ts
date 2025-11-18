import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/config/database';
import { AppError } from '@/utils/AppError';
import { AuthRequest } from '@/middleware/auth';
import { BookingFilters, ApiResponse } from '@/types';
import { BookingService } from './services/bookingService';

export class BookingController {
    private bookingService = new BookingService();

    async getBookings(req: Request, res: Response, next: NextFunction) {
        try {
            const filters: BookingFilters = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                propertyId: req.query.propertyId as string,
                status: req.query.status as string,
                platform: req.query.platform as string,
                checkInDate: req.query.checkInDate as string,
                checkOutDate: req.query.checkOutDate as string,
                guestEmail: req.query.guestEmail as string,
                sortBy: req.query.sortBy as string || 'createdAt',
                sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'desc'
            };

            const result = await this.bookingService.getBookings(filters);

            const response: ApiResponse<typeof result.bookings> = {
                status: 'success',
                data: result.bookings,
                pagination: result.pagination
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async getBooking(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const booking = await prisma.booking.findUnique({
                where: { id },
                include: {
                    property: {
                        include: {
                            owner: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    phone: true
                                }
                            }
                        }
                    },
                    serviceOrders: {
                        include: {
                            assignedUser: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    phone: true
                                }
                            }
                        }
                    },
                    transactions: true
                }
            });

            if (!booking) {
                throw new AppError('Booking not found', 404);
            }

            const response: ApiResponse<typeof booking> = {
                status: 'success',
                data: booking
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async createBooking(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const bookingData = req.body;
            const booking = await this.bookingService.createBooking(bookingData);

            const response: ApiResponse<typeof booking> = {
                status: 'success',
                data: booking,
                message: 'Booking created successfully'
            };

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    async updateBookingStatus(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const booking = await this.bookingService.updateBookingStatus(id, status, req.user!);

            const response: ApiResponse<typeof booking> = {
                status: 'success',
                data: booking,
                message: 'Booking status updated successfully'
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async checkIn(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { checkInTime } = req.body;

            const booking = await this.bookingService.checkIn(id, checkInTime);

            const response: ApiResponse<typeof booking> = {
                status: 'success',
                data: booking,
                message: 'Check-in completed successfully'
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async checkOut(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { checkOutTime } = req.body;

            const booking = await this.bookingService.checkOut(id, checkOutTime);

            const response: ApiResponse<typeof booking> = {
                status: 'success',
                data: booking,
                message: 'Check-out completed successfully'
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async getCalendar(req: Request, res: Response, next: NextFunction) {
        try {
            const { propertyId } = req.params;
            const { startDate, endDate } = req.query;

            const calendar = await this.bookingService.getPropertyCalendar(
                propertyId,
                startDate as string,
                endDate as string
            );

            const response: ApiResponse<typeof calendar> = {
                status: 'success',
                data: calendar
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }
}