export interface PaginationQuery {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PropertyFilters extends PaginationQuery {
    ownerId?: string;
    status?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    maxGuests?: number;
}

export interface BookingFilters extends PaginationQuery {
    userId: any;
    propertyId?: string;
    status?: string;
    platform?: string;
    checkInDate?: string;
    checkOutDate?: string;
    guestEmail?: string;
}

export interface ServiceFilters extends PaginationQuery {
    propertyId?: string;
    bookingId?: string;
    serviceType?: string;
    status?: string;
    assignedTo?: string;
    scheduledDate?: string;
}

export interface TransactionFilters extends PaginationQuery {
    ownerId?: string;
    propertyId?: string;
    bookingId?: string;
    transactionType?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface BookingCalculation {
    basePrice: number;
    totalNights: number;
    cleaningFee: number;
    serviceFee: number;
    totalAmount: number;
    commissionAmount: number;
    ownerPayout: number;
}

export interface PropertyStats {
    totalBookings: number;
    totalRevenue: number;
    occupancyRate: number;
    averageRating: number;
    upcomingBookings: number;
    currentMonthRevenue: number;
    lastMonthRevenue: number;
}

export interface OwnerReport {
    properties: PropertyStats[];
    totalRevenue: number;
    totalCommissions: number;
    totalPayouts: number;
    monthlyBreakdown: Array<{
        month: string;
        revenue: number;
        bookings: number;
    }>;
}

export interface DashboardStats {
    totalProperties: number;
    activeProperties: number;
    totalBookings: number;
    totalRevenue: number;
    averageOccupancy: number;
    pendingServices: number;
    recentBookings: Array<{
        id: string;
        propertyTitle: string;
        guestName: string;
        checkInDate: string;
        totalAmount: number;
    }>;
}

export interface FileUpload {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}

export interface S3UploadResult {
    url: string;
    key: string;
    bucket: string;
}

export interface EmailTemplate {
    to: string;
    subject: string;
    template: string;
    data: Record<string, any>;
}

export interface PricingData {
    basePrice: number;
    seasonalMultiplier: number;
    weekendMultiplier: number;
    minimumNights: number;
    maximumNights: number;
    advanceBookingDiscount: number;
}

export interface MarketData {
    averagePrice: number;
    occupancyRate: number;
    competitorCount: number;
    demandScore: number;
    seasonalTrends: Array<{
        month: number;
        multiplier: number;
    }>;
}

export interface WebhookPayload {
    event: string;
    data: Record<string, any>;
    timestamp: string;
    signature?: string;
}

export interface JobData {
    id: string;
    type: string;
    payload: Record<string, any>;
    attempts?: number;
    delay?: number;
}

export interface NotificationData {
    userId: string;
    type: 'BOOKING' | 'SERVICE' | 'PAYMENT' | 'PROPERTY';
    title: string;
    message: string;
    data?: Record<string, any>;
    channels: ('EMAIL' | 'SMS' | 'PUSH')[];
}

export interface CreateBookingData {
    userId: string;
    propertyId: string;
    startDate: Date;
    endDate: Date;
    guests: number;
    totalPrice: number;
    specialRequests?: string;
}

export interface UpdateBookingData {
    startDate?: Date;
    endDate?: Date;
    guests?: number;
    totalPrice?: number;
    status?: string;
    specialRequests?: string;
}