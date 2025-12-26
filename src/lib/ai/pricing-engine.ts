import { prisma } from '@/lib/prisma'
import { analyzeMarketData } from './market-analyzer'

interface PricingContext {
  propertyId: string
  date: Date
  historicalData: PricingHistory[]
  externalFactors: {
    dolarBlue: number
    inflation: number
    localEvents: string[]
    weather: string
    isHoliday: boolean
  }
}

export async function calculateOptimalPrice(context: PricingContext): Promise<number> {
  // 1. Obtener data histórica de la propiedad
  const historical = await prisma.pricingHistory.findMany({
    where: {
      propertyManagement: {
        propertyId: context.propertyId
      },
      date: {
        gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // último año
      }
    },
    orderBy: { date: 'desc' }
  })

  // 2. Analizar competencia en la zona
  const marketData = await analyzeMarketData(context.propertyId)

  // 3. Feature engineering para el modelo ML
  const features = {
    dayOfWeek: context.date.getDay(),
    isWeekend: [0, 6].includes(context.date.getDay()),
    monthOfYear: context.date.getMonth(),
    daysUntilDate: Math.floor((context.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    
    // Factores externos
    dolarBlueRate: context.externalFactors.dolarBlue,
    inflationRate: context.externalFactors.inflation,
    hasLocalEvents: context.externalFactors.localEvents.length > 0,
    isHoliday: context.externalFactors.isHoliday,
    
    // Métricas históricas
    avgOccupancyLast30Days: calculateAvgOccupancy(historical, 30),
    avgPriceLast30Days: calculateAvgPrice(historical, 30),
    
    // Mercado
    competitorAvgPrice: marketData.avgPrice,
    competitorOccupancy: marketData.avgOccupancy,
    marketDemandScore: marketData.demandScore // 0-100
  }

  // 4. Por ahora: algoritmo rule-based (después lo reemplazás con ML real)
  const basePrice = calculateBasePrice(historical)
  const adjustments = calculatePriceAdjustments(features, marketData)
  
  const suggestedPrice = basePrice * adjustments.multiplier

  // 5. Guardar en historial para entrenar modelo después
  await prisma.pricingHistory.create({
    data: {
      propertyManagement: {
        connect: {
          propertyId: context.propertyId
        }
      },
      date: context.date,
      suggestedPrice,
      appliedPrice: suggestedPrice, // Después se actualiza con el real
      dayOfWeek: features.dayOfWeek,
      isWeekend: features.isWeekend,
      isHoliday: features.isHoliday,
      dolarBlueRate: features.dolarBlueRate,
      inflationRate: features.inflationRate,
      competitorAvgPrice: features.competitorAvgPrice
    }
  })

  return Math.round(suggestedPrice)
}

function calculatePriceAdjustments(features: any, marketData: any) {
  let multiplier = 1.0

  // Ajustes por día
  if (features.isWeekend) multiplier *= 1.15
  if (features.isHoliday) multiplier *= 1.25
  
  // Ajustes por demanda
  if (features.hasLocalEvents) multiplier *= 1.20
  if (marketData.demandScore > 80) multiplier *= 1.10
  if (marketData.demandScore < 40) multiplier *= 0.90

  // Ajustes por anticipación de reserva
  if (features.daysUntilDate < 7) multiplier *= 0.95 // Última semana: bajar un poco
  if (features.daysUntilDate > 60) multiplier *= 1.05 // Reserva anticipada: subir

  // Ajustes por competencia
  if (marketData.competitorOccupancy > 85) multiplier *= 1.08 // Alta demanda
  if (marketData.competitorOccupancy < 60) multiplier *= 0.92 // Baja demanda

  return { multiplier }
}