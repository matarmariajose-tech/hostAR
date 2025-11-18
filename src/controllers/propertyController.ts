import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/config/database';
import { AppError } from '@/utils/AppError';
import { AuthRequest } from '@/middleware/auth';
import { PropertyFilters, ApiResponse } from '@/types';
import { PropertyService } from '@/services/propertyService';

export class PropertyController {
    private propertyService = new PropertyService();

    async getProperties(req: Request, res: Response, next: NextFunction) {
        try {
            const filters: PropertyFilters = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                ownerId: req.query.ownerId as string,
                status: req.query.status as string,
                propertyType: req.query.propertyType as string,
                minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
                maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
                bedrooms: req.query.bedrooms ? parseInt(req.query.bedrooms as string) : undefined,
                maxGuests: req.query.maxGuests ? parseInt(req.query.maxGuests as string) : undefined,
                sortBy: req.query.sortBy as string || 'createdAt',
                sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'desc'
            };

            const result = await this.propertyService.getProperties(filters);

            const response: ApiResponse<typeof result.properties> = {
                status: 'success',
                data: result.properties,
                pagination: result.pagination
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async getProperty(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const property = await prisma.property.findUnique({
                where: { id },
                include: {
                    owner: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            phone: true
                        }
                    },
                    bookings: {
                        where: {
                            status: { in: ['CONFIRMED', 'CHECKED_IN'] }
                        },
                        select: {
                            id: true,
                            checkInDate: true,
                            checkOutDate: true,
                            status: true
                        },
                        orderBy: { checkInDate: 'asc' }
                    }
                }
            });

            if (!property) {
                throw new AppError('Property not found', 404);
            }

            const response: ApiResponse<typeof property> = {
                status: 'success',
                data: property
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async createProperty(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const propertyData = {
                ...req.body,
                ownerId: req.body.ownerId || req.user!.id
            };

            const property = await this.propertyService.createProperty(propertyData);

            const response: ApiResponse<typeof property> = {
                status: 'success',
                data: property,
                message: 'Property created successfully'
            };

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    async updateProperty(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const property = await this.propertyService.updateProperty(id, updateData, req.user!);

            const response: ApiResponse<typeof property> = {
                status: 'success',
                data: property,
                message: 'Property updated successfully'
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async deleteProperty(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            await this.propertyService.deleteProperty(id, req.user!);

            const response: ApiResponse<null> = {
                status: 'success',
                data: null,
                message: 'Property deleted successfully'
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }

    async uploadPhotos(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const files = req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                throw new AppError('No photos provided', 400);
            }

            const photos = await this.propertyService.uploadPhotos(id, files, req.user!);

            const response: ApiResponse<string[]> = {
                status: 'success',
                data: photos,
                message: 'Photos uploaded successfully'
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }
}