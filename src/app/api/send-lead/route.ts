import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const leadData = await request.json();
        
        // Aquí puedes procesar y guardar los datos del lead
        // Por ejemplo:
        // 1. Guardar en tu base de datos
        // 2. Enviar email de notificación
        // 3. Integrar con CRM (Hubspot, Salesforce, etc.)
        // 4. Enviar a Google Sheets
        
        console.log('Lead received:', {
            ...leadData,
            receivedAt: new Date().toISOString()
        });
        
        // Guardar en Airtable
        await saveToAirtable(leadData);
        
        // Enviar email
        await sendNotificationEmail(leadData);
        
        return NextResponse.json({ 
            success: true, 
            message: 'Lead received successfully' 
        });
        
    } catch (error) {
        console.error('Error saving lead:', error);
        return NextResponse.json(
            { error: 'Failed to save lead' },
            { status: 500 }
        );
    }
}

async function saveToAirtable(data: any) {
    // Implementar integración con Airtable
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) return;
    
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Leads`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fields: {
                'Nombre': data.fullName,
                'Email': data.email,
                'Teléfono': data.phone,
                'Dirección': data.address,
                'Tipo Propiedad': data.propertyType,
                'Ingreso Mensual': data.monthlyIncome,
                'Ingreso Anual': data.annualIncome,
                'Ocupación': data.occupancy,
                'Fecha': new Date().toISOString(),
                'Fuente': data.source || 'calculator_2026'
            }
        })
    });
    
    return response.json();
}

async function sendNotificationEmail(data: any) {
    // Implementar envío de email (Resend, SendGrid, etc.)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) return;
    
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'HostAR <notificaciones@hostar.com>',
            to: ['ventas@hostar.com', data.email],
            subject: `Nuevo lead: ${data.fullName} - ${data.address}`,
            html: `
                <h2>Nuevo Lead Calculadora 2026</h2>
                <p><strong>Nombre:</strong> ${data.fullName}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Teléfono:</strong> ${data.phone}</p>
                <p><strong>Dirección:</strong> ${data.address}</p>
                <p><strong>Tipo propiedad:</strong> ${data.propertyType}</p>
                <p><strong>Ingreso mensual estimado:</strong> $${data.monthlyIncome?.toLocaleString('es-AR')}</p>
                <p><strong>Ingreso anual:</strong> $${data.annualIncome?.toLocaleString('es-AR')}</p>
                <p><strong>Ocupación zona:</strong> ${data.occupancy}</p>
                <hr>
                <p><em>Enviado desde la calculadora 2026 - ${new Date().toLocaleString('es-AR')}</em></p>
            `
        })
    });
    
    return response.json();
}