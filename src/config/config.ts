import dotenv from 'dotenv';
dotenv.config();

export const config = {
    // Server
    port: parseInt(process.env.PORT || '3000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

    // Database
    databaseUrl: process.env.DATABASE_URL!,
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

    // JWT
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

    // AWS S3
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        region: process.env.AWS_REGION || 'us-east-1',
        s3Bucket: process.env.AWS_S3_BUCKET!,
    },

    // Email
    smtp: {
        host: process.env.SMTP_HOST!,
        port: parseInt(process.env.SMTP_PORT || '587'),
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
    },

    // Payment providers
    mercadoPago: {
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
        publicKey: process.env.MERCADOPAGO_PUBLIC_KEY!,
    },

    // External APIs
    priceLabs: {
        apiKey: process.env.PRICELABS_API_KEY!,
    },
    uplisting: {
        apiKey: process.env.UPLISTING_API_KEY!,
    },
};