"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

interface NominatimResult {
    display_name: string;
    lat: string;
    lon: string;
}

interface Results {
    income: number;
    occupancy: string;
}

export default function Hero() {
    const mapRef = useRef<any>(null);
    const leafletRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    const [step, setStep] = useState(1);
    const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
    const [results, setResults] = useState<Results | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        address: "",
        propertyType: "",
        rooms: "",
        bathrooms: "",
        fullName: "",
        email: "",
    });

    // Inicializar Leaflet
    useEffect(() => {
        import("leaflet").then((L) => {
            leafletRef.current = L;

            if (!mapRef.current) {
                mapRef.current = L.map("map").setView([-38.4161, -63.6167], 5);
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "&copy; OpenStreetMap contributors",
                    maxZoom: 19,
                }).addTo(mapRef.current);
            }
        });
    }, []);

    // Buscar direcciones usando el API proxy
    const searchAddress = async (query: string) => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        try {
            const res = await fetch(`/api/searchAddress?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setSuggestions(data);
        } catch (err) {
            console.error("Error buscando direcciones:", err);
        }
    };

    const selectSuggestion = (item: NominatimResult) => {
        setFormData({ ...formData, address: item.display_name });
        setSuggestions([]);

        if (!mapRef.current || !leafletRef.current) return;

        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);

        mapRef.current.setView([lat, lon], 16);

        if (markerRef.current) {
            markerRef.current.setLatLng([lat, lon]);
        } else {
            markerRef.current = leafletRef.current.marker([lat, lon]).addTo(mapRef.current);
        }
    };

    const detectNeighborhood = (address: string) => {
        const lower = address.toLowerCase();
        if (lower.includes("palermo")) return "palermo";
        if (lower.includes("recoleta")) return "recoleta";
        if (lower.includes("san telmo")) return "san_telmo";
        return "default";
    };

    const incomeTable: any = {
        palermo: { apartamento: 70000, casa: 90000, habitacion: 40000, mansion: 150000 },
        recoleta: { apartamento: 65000, casa: 85000, habitacion: 38000, mansion: 140000 },
        san_telmo: { apartamento: 55000, casa: 75000, habitacion: 35000, mansion: 120000 },
        default: { apartamento: 50000, casa: 70000, habitacion: 30000, mansion: 100000 },
    };

    const occupancyTable: any = {
        palermo: { apartamento: "85%", casa: "80%", habitacion: "75%", mansion: "90%" },
        recoleta: { apartamento: "80%", casa: "75%", habitacion: "70%", mansion: "85%" },
        san_telmo: { apartamento: "75%", casa: "70%", habitacion: "65%", mansion: "80%" },
        default: { apartamento: "60%", casa: "60%", habitacion: "60%", mansion: "60%" },
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.address || !formData.propertyType || !formData.rooms || !formData.bathrooms) {
            alert("Por favor completa todos los campos para continuar.");
            return;
        }
        setStep(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email) {
            alert("Por favor ingresa tu nombre completo y email.");
            return;
        }

        const neighborhood = detectNeighborhood(formData.address);
        const baseIncome = incomeTable[neighborhood]?.[formData.propertyType] || incomeTable.default[formData.propertyType];
        const income = baseIncome + parseInt(formData.rooms) * 5000 + parseInt(formData.bathrooms) * 2000;
        const occupancy = occupancyTable[neighborhood]?.[formData.propertyType] || occupancyTable.default[formData.propertyType];

        setResults({ income, occupancy });
        setSubmitted(true);
    };

    return (
        <section className="hero">
            <div className="hero-content">
                <div className="hero-text">
                    <div className="hero-badge">★ #1 EN ARGENTINA - LÍDER ABSOLUTO</div>
                    <h1 className="hero-title">Dominamos el alquiler temporario en toda Argentina</h1>
                    <p className="hero-subtitle">
                        De Buenos Aires a Bariloche, de Mar del Plata a Mendoza. Tecnología avanzada que maximiza tus ingresos en cada provincia.
                    </p>
                </div>

                <div className="calculator" id="calculator">
                    {step === 1 && (
                        <form onSubmit={handleNextStep}>
                            <div style={{ position: "relative", marginBottom: "15px" }}>
                                <input
                                    type="text"
                                    placeholder="Ubicación exacta (ej: Av. Santa Fe 1234, Palermo)"
                                    value={formData.address}
                                    onChange={(e) => { setFormData({ ...formData, address: e.target.value }); searchAddress(e.target.value); }}
                                    autoComplete="off"
                                    required
                                />
                                {suggestions.length > 0 && (
                                    <ul style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #ccc", zIndex: 1000, maxHeight: "200px", overflowY: "auto", listStyle: "none", padding: 0, margin: 0 }}>
                                        {suggestions.map((s, idx) => (
                                            <li key={idx} style={{ padding: "8px", cursor: "pointer" }} onClick={() => selectSuggestion(s)}>
                                                {s.display_name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <select value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })} required>
                                <option value="" disabled>Tipo de propiedad</option>
                                <option value="apartamento">Apartamento</option>
                                <option value="casa">Casa</option>
                                <option value="habitacion">Habitación Privada</option>
                                <option value="mansion">Casa Grande / Mansión</option>
                            </select>

                            <select value={formData.rooms} onChange={(e) => setFormData({ ...formData, rooms: e.target.value })} required>
                                <option value="" disabled>Número de habitaciones</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5+</option>
                            </select>

                            <select value={formData.bathrooms} onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })} required>
                                <option value="" disabled>Número de baños</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4+</option>
                            </select>

                            <button type="submit" className="btn">Siguiente</button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Nombre completo" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                            <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />

                            <button type="submit" className="btn">Enviar y Calcular</button>
                        </form>
                    )}

                    {submitted && results && (
                        <div id="results" style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #ddd" }}>
                            <p style={{ color: "green", fontWeight: "bold" }}>¡Tus datos fueron enviados correctamente!</p>
                            <p>Ingreso mensual estimado: <span style={{ color: "var(--accent-dark)" }}>${results.income.toLocaleString("es-AR")}</span></p>
                            <p>Ocupación aproximada: <span style={{ color: "var(--accent-dark)" }}>{results.occupancy}</span></p>
                        </div>
                    )}
                </div>

                <div id="map" style={{ height: "400px", marginTop: "20px" }}></div>
            </div>
        </section>
    );
}