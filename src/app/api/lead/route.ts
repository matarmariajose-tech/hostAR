import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { name, phone, comment } = await request.json();

        // Validar campos requeridos
        if (!name || !phone || !comment) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' },
                { status: 400 }
            );
        }

        // Aquí puedes:
        // 1. Enviar email (con Resend, Nodemailer, etc.)
        // 2. Guardar en base de datos
        // 3. Integrar con CRM
        // 4. Enviar notificación por WhatsApp

        console.log('📥 NUEVO LEAD RECIBIDO:');
        console.log('👤 Nombre:', name);
        console.log('📞 Teléfono:', phone);
        console.log('💬 Comentario:', comment);
        console.log('🕐 Fecha:', new Date().toISOString());

        // Simular envío de email (reemplaza con tu servicio de email)
        try {
            // Ejemplo con Resend (descomenta y configura)
            /*
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
              from: 'HostAR <onboarding@resend.dev>',
              to: 'tu-email@dominio.com',
              subject: `Nuevo Lead de ${name}`,
              html: `
                <h2>Nuevo Lead Recibido</h2>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Teléfono:</strong> ${phone}</p>
                <p><strong>Comentario:</strong> ${comment}</p>
                <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</p>
              `
            });
            */
        } catch (emailError) {
            console.error('Error enviando email:', emailError);
        }

        return NextResponse.json(
            {
                message: 'Lead enviado correctamente',
                data: { name, phone, comment }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('❌ Error procesando lead:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// También puedes agregar otros métodos si necesitas
export async function GET() {
    return NextResponse.json(
        { error: 'Método no permitido' },
        { status: 405 }
    );
}