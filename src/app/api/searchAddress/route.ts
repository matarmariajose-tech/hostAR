import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get("q");
    if (!query) return NextResponse.json({ error: "Falta query" }, { status: 400 });

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ar&addressdetails=1&limit=5`, {
            headers: {
                "User-Agent": "HostAR-App/1.0 (contacto@hostar.com)"
            }
        });
        const data = await response.json();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
    }
}