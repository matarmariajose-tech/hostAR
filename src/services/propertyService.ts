import { prisma } from '@/config/database';
import { AppError } from '@/utils/AppError';
import { PropertyFilters } from '@/types';
import { S3Service } from './s3Service';

export class PropertyService {
    private s3Service = new S3Service();

    async getProperties(filters: PropertyFilters) {
        const {
            page = 1,
            limit = 10,
            ownerId,
            status,
            propertyType,
            minPrice,
            maxPrice,
            bedrooms,
            maxGuests,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = filters;

        const skip = (page - 1) * limit;

        const where: any = {};

        if (ownerId) where.ownerId = ownerId;
        if (status) where.status = status;
        if (propertyType) where.propertyType = propertyType;
        if (bedrooms) where.bedrooms = bedrooms;
        if (maxGuests) where.maxGuests = { gte: maxGuests };

        if (minPrice || maxPrice) {
            where.basePricePerNight = {};
            if (minPrice) where.basePricePerNight.gte = minPrice;
            if (maxPrice) where.basePricePerNight.lte = maxPrice;
        }

        const [properties, total] = await Promise.all([
            prisma.property.findMany({
                where,
                include: {
                    owner: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    _count: {
                        select: {
                            bookings: {
                                where: {
                                    status: { in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] }
                                }
                            }
                        }
                    }
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit
            }),
            prisma.property.count({ where })
        ]);

        return {
            properties,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async createProperty(data: any) {
        // Validate owner exists
        const owner = await prisma.user.findUnique({
            where: { id: data.ownerId }
        });

        if (!owner) {
            throw new AppError('Owner not found', 404);
        }

        return await prisma.property.create({
            data: {
                ...data,
                amenities: data.amenities || [],
                photos: data.photos || []
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
    }

    async updateProperty(id: string, data: any, user: { id: string; role: string }) {
        // Check if property exists
        const property = await prisma.property.findUnique({
            where: { id }
        });

        if (!property) {
            throw new AppError('Property not found', 404);
        }

        // Check permissions
        if (user.role !== 'ADMIN' && property.ownerId !== user.id) {
            throw new AppError('Not authorized to update this property', 403);
        }

        return await prisma.property.update({
            where: { id },
            data,
            include: {
                owner: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
    }

    async deleteProperty(id: string, user: { id: string; role: string }) {
        // Check if property exists
        const property = await prisma.property.findUnique({
            where: { id },
            include: {
                bookings: {
                    where: {
                        status: { in: ['CONFIRMED', 'CHECKED_IN'] }
                    }
                }
            }
        });

        if (!property) {
            throw new AppError('Property not found', 404);
        }

        // Check permissions
        if (user.role !== 'ADMIN' && property.ownerId !== user.id) {
            throw new AppError('Not authorized to delete this property', 403);
        }

        // Check if property has active bookings
        if (property.bookings.length > 0) {
            throw new AppError('Cannot delete property with active bookings', 400);
        }

        await prisma.property.delete({
            where: { id }
        });
    }

    async uploadPhotos(propertyId: string, files: Express.Multer.File[], user: { id: string; role: string }) {
        // Check if property exists and user has permission
        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            throw new AppError('Property not found', 404);
        }

        if (user.role !== 'ADMIN' && property.ownerId !== user.id) {
            throw new AppError('Not authorized to upload photos for this property', 403);
        }

        // Upload files to S3
        const uploadPromises = files.map(file =>
            this.s3Service.uploadFile(file, `properties/${propertyId}`)
        );

        const uploadResults = await Promise.all(uploadPromises);
        const photoUrls = uploadResults.map(result => result.url);

        // Update property with new photos
        const currentPhotos = (property.photos as string[]) || [];
        const updatedPhotos = [...currentPhotos, ...photoUrls];

        await prisma.property.update({
            where: { id: propertyId },
            data: { photos: updatedPhotos }
        });

        return photoUrls;
    }
}