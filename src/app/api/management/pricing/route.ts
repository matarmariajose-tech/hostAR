export async function POST(request: NextRequest) {
  const { propertyId, startDate, endDate } = await request.json()
  
  // Generar precios para un rango de fechas
  const dates = generateDateRange(new Date(startDate), new Date(endDate))
  
  const prices = await Promise.all(
    dates.map(date => calculateOptimalPrice({
      propertyId,
      date,
      externalFactors: await getExternalFactors(date)
    }))
  )
  
  return NextResponse.json({ success: true, data: prices })
}

// app/api/chat/webhook/route.ts (WhatsApp)
export async function POST(request: NextRequest) {
  const { from, body } = await request.json() // Mensaje de WhatsApp
  
  // Buscar conversación activa
  let conversation = await prisma.chatConversation.findFirst({
    where: { phoneNumber: from, isActive: true },
    include: { messages: { orderBy: { createdAt: 'desc' }, take: 10 } }
  })
  
  const response = await handleGuestMessage({
    bookingId: conversation!.bookingId,
    guestMessage: body,
    conversationHistory: conversation!.messages
  })
  
  // Enviar respuesta por WhatsApp
  await sendWhatsAppMessage(from, response)
  
  return NextResponse.json({ success: true })
}

// app/api/cleaning/verify/route.ts
export async function POST(request: NextRequest) {
  const { taskId, photos } = await request.json()
  
  const verification = await verifyCleaningQuality(taskId, photos)
  
  // Si score < 85, notificar que necesita rehacer
  if (verification.overallScore < 85) {
    await notifyCleanerToRetry(taskId, verification.issues)
  }
  
  return NextResponse.json({ success: true, data: verification })
}