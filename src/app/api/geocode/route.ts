import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("q");
    
    console.log("🔍 Buscando:", query); // Para debug
    
    if (!query) {
        return NextResponse.json([], { status: 200 });
    }

    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ar&addressdetails=1&limit=5`;
        
        console.log("🌐 Fetching:", url); // Para debug
        
        const response = await fetch(url, {
            headers: {
                "User-Agent": "HostAR-App/1.0 (contacto@hostar.com)",
                "Accept": "application/json",
            },
        });

        console.log("📡 Response status:", response.status); // Para debug

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Datos recibidos:", data.length, "resultados"); // Para debug
        
        return NextResponse.json(data);
    } catch (err) {
        console.error("❌ Error en API route:", err);
        return NextResponse.json([], { status: 200 }); // Retorna array vacío en lugar de error
    }
}