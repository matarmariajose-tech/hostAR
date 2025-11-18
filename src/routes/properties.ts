import { Router } from 'express';
import multer from 'multer';
import { PropertyController } from '@/controllers/propertyController';
import { authenticate, authorize } from '@/middleware/auth';
import { validate } from '@/middleware/validation';
import { propertySchemas } from '@/validation/schemas';

const router = Router();
const propertyController = new PropertyController();

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
        files: 10 // Maximum 10 files
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});