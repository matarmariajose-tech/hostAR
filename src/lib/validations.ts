import { z } from 'zod'

export const propertySchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(100),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(2000),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  country: z.string().min(2, 'El país debe tener al menos 2 caracteres'),
  pricePerNight: z.number().positive('El precio debe ser mayor a 0'),
  bedrooms: z.number().int().min(1, 'Debe tener al menos 1 dormitorio'),
  bathrooms: z.number().int().min(1, 'Debe tener al menos 1 baño'),
  maxGuests: z.number().int().min(1, 'Debe aceptar al menos 1 huésped'),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string().url()).min(1, 'Debe subir al menos 1 imagen'),
  houseRules: z.array(z.string()).optional(),
})

export const bookingSchema = z.object({
  propertyId: z.string().uuid(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  guests: z.number().int().min(1),
  specialRequests: z.string().optional(),
})

export const leadSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().max(500, 'El mensaje no puede exceder 500 caracteres').optional(),
  source: z.string().optional(),
})