import Joi from 'joi';

export const authSchemas = {
    register: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        phone: Joi.string().optional()
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
};

export const propertySchemas = {
    create: Joi.object({
        title: Joi.string().min(10).max(100).required(),
        description: Joi.string().min(50).max(2000).required(),
        address: Joi.string().required(),
        propertyType: Joi.string().valid('APARTMENT', 'HOUSE', 'STUDIO', 'ROOM').required(),
        bedrooms: Joi.number().min(1).max(10).required(),
        bathrooms: Joi.number().min(0.5).max(10).required(),
        maxGuests: Joi.number().min(1).max(20).required(),
        basePricePerNight: Joi.number().min(0).required(),
        checkInMethod: Joi.string().valid('PERSONAL', 'LOCKBOX', 'SMART_LOCK').default('LOCKBOX'),
        lockboxCode: Joi.string().when('checkInMethod', {
            is: Joi.valid('LOCKBOX', 'SMART_LOCK'),
            then: Joi.required()
        }),
        wifiName: Joi.string().optional(),
        wifiPassword: Joi.string().optional(),
        houseRules: Joi.string().max(1000).optional(),
        amenities: Joi.array().items(Joi.string()).optional(),
        cleaningFee: Joi.number().min(0).default(6500),
        serviceFee: Joi.number().min(0).default(0)
    }),

    update: Joi.object({
        title: Joi.string().min(10).max(100),
        description: Joi.string().min(50).max(2000),
        address: Joi.string(),
        propertyType: Joi.string().valid('APARTMENT', 'HOUSE', 'STUDIO', 'ROOM'),
        bedrooms: Joi.number().min(1).max(10),
        bathrooms: Joi.number().min(0.5).max(10),
        maxGuests: Joi.number().min(1).max(20),
        basePricePerNight: Joi.number().min(0),
        checkInMethod: Joi.string().valid('PERSONAL', 'LOCKBOX', 'SMART_LOCK'),
        lockboxCode: Joi.string(),
        wifiName: Joi.string(),
        wifiPassword: Joi.string(),
        houseRules: Joi.string().max(1000),
        amenities: Joi.array().items(Joi.string()),
        cleaningFee: Joi.number().min(0),
        serviceFee: Joi.number().min(0),
        status: Joi.string().valid('DRAFT', 'ACTIVE', 'MAINTENANCE', 'INACTIVE')
    }).min(1)
};

export const bookingSchemas = {
    create: Joi.object({
        propertyId: Joi.string().uuid().required(),
        guestName: Joi.string().min(2).max(100).required(),
        guestEmail: Joi.string().email().required(),
        guestPhone: Joi.string().optional(),
        checkInDate: Joi.date().iso().min('now').required(),
        checkOutDate: Joi.date().iso().greater(Joi.ref('checkInDate')).required(),
        guestsCount: Joi.number().min(1).required(),
        platform: Joi.string().valid('AIRBNB', 'BOOKING', 'MERCADOLIBRE', 'DIRECT').default('DIRECT'),
        platformBookingId: Joi.string().optional(),
        specialRequests: Joi.string().max(500).optional()
    })
};