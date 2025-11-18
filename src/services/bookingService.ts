import { prisma } from '@/config/database';
import { AppError } from '@/utils/AppError';
import { BookingFilters, BookingCalculation } from '@/types';
import { isAfter, isBefore, parseISO } from 'date-fns';

export class BookingService {
    async createBooking(bookingData: any) {
        try {
            const booking = await prisma.booking.create({
                data: {
                    ...bookingData,
                    status: 'PENDING'
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true
                        }
                    },
                    property: true
                }
            });

            return booking;
        } catch (error) {
            throw new AppError('Error creating booking', 500);
        }
    }

    async getBookings(filters: BookingFilters = {}) {
        try {
            const where: any = {};

            if (filters.userId) {
                where.userId = filters.userId;
            }

            if (filters.propertyId) {
                where.propertyId = filters.propertyId;
            }

            if (filters.status) {
                where.status = filters.status;
            }

            if (filters.startDate && filters.endDate) {
                where.AND = [
                    { startDate: { gte: new Date(filters.startDate) } },
                    { endDate: { lte: new Date(filters.endDate) } }
                ];
            }

            const bookings = await prisma.booking.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true
                        }
                    },
                    property: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return bookings;
        } catch (error) {
            throw new AppError('Error fetching bookings', 500);
        }
    }

    async getBookingById(id: string) {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            phone: true
                        }
                    },
                    property: true
                }
            });

            if (!booking) {
                throw new AppError('Booking not found', 404);
            }

            return booking;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error fetching booking', 500);
        }
    }

    async updateBooking(id: string, updateData: any) {
        try {
            const booking = await prisma.booking.update({
                where: { id },
                data: updateData,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true
                        }
                    },
                    property: true
                }
            });

            return booking;
        } catch (error) {
            throw new AppError('Error updating booking', 500);
        }
    }

    async deleteBooking(id: string) {
        try {
            await prisma.booking.delete({
                where: { id }
            });

            return { message: 'Booking deleted successfully' };
        } catch (error) {
            throw new AppError('Error deleting booking', 500);
        }
    }

    async getUserBookings(userId: string) {
        try {
            const bookings = await prisma.booking.findMany({
                where: { userId },
                include: {
                    property: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return bookings;
        } catch (error) {
            throw new AppError('Error fetching user bookings', 500);
        }
    }

    async calculateBookingPrice(propertyId: string, startDate: string, endDate: string): Promise<BookingCalculation> {
        try {
            const property = await prisma.property.findUnique({
                where: { id: propertyId }
            });

            if (!property) {
                throw new AppError('Property not found', 404);
            }

            const start = parseISO(startDate);
            const end = parseISO(endDate);

            // Calculate number of nights
            const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

            if (nights <= 0) {
                throw new AppError('Invalid date range', 400);
            }

            const basePrice = property.pricePerNight * nights;
            const cleaningFee = property.cleaningFee || 0;
            const serviceFee = basePrice * 0.1; // 10% service fee
            const total = basePrice + cleaningFee + serviceFee;

            return {
                basePrice,
                cleaningFee,
                serviceFee,
                total,
                nights,
                currency: property.currency || 'USD'
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error calculating booking price', 500);
        }
    }

    async checkAvailability(propertyId: string, startDate: string, endDate: string): Promise<boolean> {
        try {
            const conflictingBookings = await prisma.booking.findMany({
                where: {
                    propertyId,
                    status: {
                        in: ['CONFIRMED', 'PENDING']
                    },
                    OR: [
                        {
                            startDate: { lte: new Date(endDate) },
                            endDate: { gte: new Date(startDate) }
                        }
                    ]
                }
            });

            return conflictingBookings.length === 0;
        } catch (error) {
            throw new AppError('Error checking availability', 500);
        }
    }

    async updateBookingStatus(id: string, status: string) {
        try {
            const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

            if (!validStatuses.includes(status)) {
                throw new AppError('Invalid booking status', 400);
            }

            const booking = await prisma.booking.update({
                where: { id },
                data: { status },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true
                        }
                    },
                    property: true
                }
            });

            return booking;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError('Error updating booking status', 500);
        }
    }
}