import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { propertySchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const query = {
      city: searchParams.get('city'),
      checkIn: searchParams.get('checkIn'),
      checkOut: searchParams.get('checkOut'),
      guests: searchParams.get('guests'),
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      bedrooms: searchParams.get('bedrooms'),
      amenities: searchParams.getAll('amenities'),
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
    }

    const where: any = {
      isPublished: true,
      isAvailable: true,
    }

    if (query.city) {
      where.city = {
        contains: query.city,
        mode: 'insensitive',
      }
    }

    if (query.minPrice || query.maxPrice) {
      where.pricePerNight = {}
      if (query.minPrice) where.pricePerNight.gte = parseFloat(query.minPrice)
      if (query.maxPrice) where.pricePerNight.lte = parseFloat(query.maxPrice)
    }

    if (query.bedrooms) {
      where.bedrooms = { gte: parseInt(query.bedrooms) }
    }

    if (query.guests) {
      where.maxGuests = { gte: parseInt(query.guests) }
    }

    if (query.amenities.length > 0) {
      where.amenities = { hasEvery: query.amenities }
    }

    if (query.checkIn && query.checkOut) {
      const overlappingBookings = await prisma.booking.findMany({
        where: {
          propertyId: { in: [] },
          status: { in: ['CONFIRMED', 'PENDING'] },
          OR: [
            {
              checkIn: { lte: new Date(query.checkOut) },
              checkOut: { gte: new Date(query.checkIn) },
            },
          ],
        },
        select: { propertyId: true },
      })

      const unavailablePropertyIds = overlappingBookings.map(b => b.propertyId)
      if (unavailablePropertyIds.length > 0) {
        where.id = { notIn: unavailablePropertyIds }
      }
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          host: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: query.city ? { rating: 'desc' } : { createdAt: 'desc' },
      }),
      prisma.property.count({ where }),
    ])

    const propertiesWithStats = properties.map(property => ({
      ...property,
      averageRating: property.reviews.length > 0
        ? property.reviews.reduce((acc, r) => acc + r.rating, 0) / property.reviews.length
        : null,
      reviewCount: property.reviews.length,
    }))

    return NextResponse.json({
      success: true,
      data: propertiesWithStats,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    })

  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { success: false, error: 'Error fetching properties' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = propertySchema.parse(body)
    
    // TODO: Get user from session
    const userId = 'temp-user-id' // Replace with actual user ID from auth

    const property = await prisma.property.create({
      data: {
        ...validatedData,
        hostId: userId,
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(
      { success: true, data: property },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating property:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Error creating property' },
      { status: 500 }
    )
  }
}