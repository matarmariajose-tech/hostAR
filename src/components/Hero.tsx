"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface NominatimResult {
    display_name: string;
    lat: string;
    lon: string;
}

interface AirbnbData {
    neighborhood: string;
    city: string;
    average_price: number;
    occupancy_rate: number;
    revenue_per_month: number;
    listings_count: number;
    average_rating: number;
    property_type_distribution: Record<string, number>;
}

interface Results {
    income: number;
    occupancy: string;
    dailyRate: number;
    annualIncome: number;
    projected2026: {
        income: number;
        dailyRate: number;
        annualIncome: number;
    };
    marketInsights: {
        averageRating: number;
        listingsCount: number;
        demandTrend: string;
    };
}

interface Amenity {
    id: string;
    label: string;
    value: string;
    impact: number;
}

export default function Hero() {
    const [step, setStep] = useState(1);
    const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
    const [results, setResults] = useState<Results | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const amenitiesRef = useRef<HTMLDivElement>(null);

    const [airbnbDataCache, setAirbnbDataCache] = useState<Record<string, AirbnbData>>({});
    
    const amenitiesOptions: Amenity[] = [
        { id: "pool", label: "Pileta", value: "pool", impact: 0.15 },
        { id: "gym", label: "Gimnasio", value: "gym", impact: 0.08 },
        { id: "wifi", label: "WiFi Premium", value: "wifi", impact: 0.05 },
        { id: "ac", label: "Aire Acondicionado", value: "ac", impact: 0.12 },
        { id: "heating", label: "Calefacción", value: "heating", impact: 0.10 },
        { id: "kitchen", label: "Cocina Equipada", value: "kitchen", impact: 0.20 },
        { id: "tv", label: "Smart TV", value: "tv", impact: 0.05 },
        { id: "laundry", label: "Lavandería", value: "laundry", impact: 0.07 },
        { id: "parking", label: "Estacionamiento", value: "parking", impact: 0.18 },
        { id: "elevator", label: "Ascensor", value: "elevator", impact: 0.10 },
        { id: "security", label: "Seguridad 24hs", value: "security", impact: 0.09 },
        { id: "garden", label: "Jardín/Patio", value: "garden", impact: 0.12 },
        { id: "bbq", label: "Parrilla", value: "bbq", impact: 0.08 },
        { id: "terrace", label: "Terraza", value: "terrace", impact: 0.15 },
        { id: "workspace", label: "Espacio de trabajo", value: "workspace", impact: 0.10 },
        { id: "netflix", label: "Streaming Premium", value: "netflix", impact: 0.04 },
    ];

    const [formData, setFormData] = useState({
        address: "",
        propertyType: "",
        rooms: "2",
        bathrooms: "1",
        amenities: [] as string[],
        selectedAmenitiesLabels: [] as string[],
        garageType: "none",
        garageQuantity: "1",
        fullName: "",
        email: "",
        phone: "",
        squareMeters: "60",
    });

    // Event listener para clicks fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setSuggestions([]);
            }
            if (amenitiesRef.current && !amenitiesRef.current.contains(event.target as Node)) {
                const dropdown = document.querySelector('.amenities-dropdown');
                if (dropdown) {
                    (dropdown as HTMLElement).style.display = 'none';
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Buscar dirección con Nominatim
    const searchAddress = useCallback(async (query: string) => {
        if (!query || query.trim().length < 3) {
            setSuggestions([]);
            return;
        }

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ar&limit=5&addressdetails=1`,
                    {
                        headers: {
                            'User-Agent': 'HostAR-App/1.0 (contacto@hostar.com)',
                            'Accept': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setSuggestions(data || []);
            } catch (err) {
                console.error("Search error:", err);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);
    }, []);

    const selectSuggestion = (item: NominatimResult) => {
        setFormData({ ...formData, address: item.display_name });
        setSuggestions([]);
    };

    const toggleAmenity = (amenity: Amenity) => {
        setFormData((prev) => {
            const isSelected = prev.amenities.includes(amenity.value);
            return {
                ...prev,
                amenities: isSelected
                    ? prev.amenities.filter((a) => a !== amenity.value)
                    : [...prev.amenities, amenity.value],
                selectedAmenitiesLabels: isSelected
                    ? prev.selectedAmenitiesLabels.filter((l) => l !== amenity.label)
                    : [...prev.selectedAmenitiesLabels, amenity.label],
            };
        });
    };

    const toggleAmenitiesDropdown = () => {
        const dropdown = document.querySelector('.amenities-dropdown');
        if (dropdown) {
            const isVisible = (dropdown as HTMLElement).style.display === 'block';
            (dropdown as HTMLElement).style.display = isVisible ? 'none' : 'block';
        }
    };

    // Detectar ciudad y provincia
    const detectLocation = (address: string) => {
        const lower = address.toLowerCase();
        
        // Mapeo de ciudades con sus datos base
        const locations: Record<string, { city: string, basePrice: number, multiplier: number, occupancy: number }> = {
            // Buenos Aires - Capital Federal
            "buenos aires": { city: "buenos-aires", basePrice: 45000, multiplier: 1.0, occupancy: 0.72 },
            "caba": { city: "buenos-aires", basePrice: 45000, multiplier: 1.0, occupancy: 0.72 },
            "capital federal": { city: "buenos-aires", basePrice: 45000, multiplier: 1.0, occupancy: 0.72 },
            
            // Buenos Aires - Provincia (zonas premium)
            "san isidro": { city: "san-isidro", basePrice: 55000, multiplier: 1.22, occupancy: 0.73 },
            "tigre": { city: "tigre", basePrice: 58000, multiplier: 1.29, occupancy: 0.60 },
            "nordelta": { city: "tigre", basePrice: 62000, multiplier: 1.38, occupancy: 0.65 },
            "vicente lópez": { city: "vicente-lopez", basePrice: 42000, multiplier: 0.93, occupancy: 0.66 },
            "vicente lopez": { city: "vicente-lopez", basePrice: 42000, multiplier: 0.93, occupancy: 0.66 },
            "la plata": { city: "la-plata", basePrice: 38000, multiplier: 0.84, occupancy: 0.62 },
            
            // Mar del Plata
            "mar del plata": { city: "mar-del-plata", basePrice: 55000, multiplier: 1.22, occupancy: 0.65 },
            
            // Córdoba
            "córdoba": { city: "cordoba", basePrice: 38000, multiplier: 0.84, occupancy: 0.68 },
            "cordoba": { city: "cordoba", basePrice: 38000, multiplier: 0.84, occupancy: 0.68 },
            
            // Mendoza
            "mendoza": { city: "mendoza", basePrice: 42000, multiplier: 0.93, occupancy: 0.67 },
            
            // Santa Fe
            "rosario": { city: "rosario", basePrice: 40000, multiplier: 0.89, occupancy: 0.64 },
            "santa fe": { city: "santa-fe", basePrice: 35000, multiplier: 0.78, occupancy: 0.61 },
            "santa fé": { city: "santa-fe", basePrice: 35000, multiplier: 0.78, occupancy: 0.61 },
            
            // Bariloche
            "bariloche": { city: "bariloche", basePrice: 60000, multiplier: 1.33, occupancy: 0.58 },
            "san carlos de bariloche": { city: "bariloche", basePrice: 60000, multiplier: 1.33, occupancy: 0.58 },
            
            // Salta
            "salta": { city: "salta", basePrice: 38000, multiplier: 0.84, occupancy: 0.61 },
            
            // Tierra del Fuego
            "ushuaia": { city: "ushuaia", basePrice: 65000, multiplier: 1.44, occupancy: 0.55 },
            
            // Misiones
            "iguazú": { city: "iguazu", basePrice: 58000, multiplier: 1.29, occupancy: 0.59 },
            "iguazu": { city: "iguazu", basePrice: 58000, multiplier: 1.29, occupancy: 0.59 },
            "puerto iguazú": { city: "iguazu", basePrice: 58000, multiplier: 1.29, occupancy: 0.59 },
            "puerto iguazu": { city: "iguazu", basePrice: 58000, multiplier: 1.29, occupancy: 0.59 },
            
            // Neuquén
            "neuquén": { city: "neuquen", basePrice: 45000, multiplier: 1.0, occupancy: 0.63 },
            "neuquen": { city: "neuquen", basePrice: 45000, multiplier: 1.0, occupancy: 0.63 },
            
            // Tucumán
            "tucumán": { city: "tucuman", basePrice: 35000, multiplier: 0.78, occupancy: 0.60 },
            "tucuman": { city: "tucuman", basePrice: 35000, multiplier: 0.78, occupancy: 0.60 },
            "san miguel de tucumán": { city: "tucuman", basePrice: 35000, multiplier: 0.78, occupancy: 0.60 },
            "san miguel de tucuman": { city: "tucuman", basePrice: 35000, multiplier: 0.78, occupancy: 0.60 },
        };

        for (const [key, value] of Object.entries(locations)) {
            if (lower.includes(key)) {
                return value;
            }
        }

        // Default: Buenos Aires
        return { city: "buenos-aires", basePrice: 45000, multiplier: 1.0, occupancy: 0.70 };
    };

    // Detectar barrio dentro de la ciudad
    const detectNeighborhood = (address: string, city: string) => {
        const lower = address.toLowerCase();
        
        // Barrios por ciudad
        const neighborhoodsByCity: Record<string, Record<string, string>> = {
            "buenos-aires": {
                "palermo": "palermo",
                "recoleta": "recoleta",
                "belgrano": "belgrano",
                "san telmo": "san_telmo",
                "puerto madero": "puerto_madero",
                "microcentro": "microcentro",
                "retiro": "retiro",
                "almagro": "almagro",
                "caballito": "caballito",
                "villa crespo": "villa_crespo",
                "núñez": "nunez",
                "nuñez": "nunez",
                "nunez": "nunez",
                "boedo": "boedo",
                "flores": "flores",
                "versalles": "versalles",
                "villa urquiza": "villa_urquiza",
                "saavedra": "saavedra",
                "colegiales": "colegiales",
                "chacarita": "chacarita",
                "villa del parque": "villa_del_parque",
                "villa devoto": "villa_devoto",
                "villa pueyrredón": "villa_pueyrredon",
                "villa santa rita": "villa_santa_rita",
                "monte castro": "monte_castro",
                "velez sarsfield": "velez_sarsfield",
                "floresta": "floresta",
                "villa general mitre": "villa_general_mitre",
                "villa ortúzar": "villa_ortuzar",
                "agronomía": "agronomia",
                "parque patricios": "parque_patricios",
                "parque chacabuco": "parque_chacabuco",
                "parque avellaneda": "parque_avellaneda",
            },
            "mar-del-plata": {
                "centro": "centro",
                "playa grande": "playa_grande",
                "bristol": "bristol",
                "la perla": "la_perla",
                "punta mogotes": "punta_mogotes",
                "los troncos": "los_troncos",
                "sierra de los padres": "sierra_padres",
                "las canteras": "las_canteras",
                "barrio privado": "barrio_privado",
                "puerto": "puerto",
            },
            "cordoba": {
                "centro": "centro",
                "nueva córdoba": "nueva_cordoba",
                "nueva cordoba": "nueva_cordoba",
                "alberdi": "alberdi",
                "general paz": "general_paz",
                "güemes": "guemes",
                "cerro de las rosas": "cerro_rosas",
                "barrio jardín": "jardin",
                "altos de villa cabrera": "villa_cabrera",
                "zona norte": "zona_norte",
            },
            // Agregar más ciudades según necesidad
        };

        const cityNeighborhoods = neighborhoodsByCity[city];
        if (cityNeighborhoods) {
            for (const [key, value] of Object.entries(cityNeighborhoods)) {
                if (lower.includes(key)) {
                    return value;
                }
            }
        }

        return "default";
    };

    // Obtener datos de Airbnb (con fallback inteligente)
    const fetchAirbnbData = useCallback(async (address: string) => {
        const location = detectLocation(address);
        const neighborhood = detectNeighborhood(address, location.city);
        
        const cacheKey = `${location.city}_${neighborhood}`;
        
        // Usar cache si existe
        if (airbnbDataCache[cacheKey]) {
            return airbnbDataCache[cacheKey];
        }

        setIsFetchingData(true);
        try {
            // Intentar obtener datos reales del backend
            const response = await fetch(
                `/api/airbnb-data?city=${encodeURIComponent(location.city)}&neighborhood=${encodeURIComponent(neighborhood)}`
            );
            
            if (response.ok) {
                const data: AirbnbData = await response.json();
                setAirbnbDataCache(prev => ({
                    ...prev,
                    [cacheKey]: data
                }));
                return data;
            } else {
                // Fallback a datos estimados
                return getEstimatedData(location, neighborhood);
            }
        } catch (error) {
            console.error("Error fetching Airbnb data:", error);
            // Fallback a datos estimados
            return getEstimatedData(location, neighborhood);
        } finally {
            setIsFetchingData(false);
        }
    }, [airbnbDataCache]);

    // Datos estimados con FALLBACK SEGURO
    const getEstimatedData = (location: any, neighborhood: string): AirbnbData => {
        // Datos base que siempre existen
        const baseData = {
            neighborhood,
            city: location.city,
            listings_count: Math.round(150 * location.multiplier),
            average_rating: 4.7 - (1 - location.multiplier) * 0.2,
            property_type_distribution: {
                "apartamento": 65,
                "casa": 25,
                "habitacion": 10
            }
        };

        // Precios por barrio específico (si existe)
        // Para evitar claves duplicadas como "centro" en distintas ciudades, definimos overrides
        // por ciudad usando keys compuestas y luego intentamos buscar por city_neighborhood antes
        // de caer en un nombre de barrio genérico o en el default.
        const neighborhoodPrices: Record<string, number> = {
            // Buenos Aires
            "palermo": 52000,
            "recoleta": 50000,
            "belgrano": 47000,
            "san_telmo": 45000,
            "puerto_madero": 65000,
            "microcentro": 42000,
            "retiro": 48000,
            "almagro": 38000,
            "caballito": 35000,
            "villa_crespo": 40000,
            "nunez": 44000,
            // San Isidro
            "san_isidro": 55000,
            // Tigre
            "tigre": 58000,
            // Vicente López
            "vicente_lopez": 42000,
            // Mar del Plata (override con key compuesta)
            "mar-del-plata_centro": 58000,
            "playa_grande": 62000,
            // Córdoba (override con key compuesta)
            "cordoba_nueva_cordoba": 42000,
            "cordoba_centro": 38000,
            "nueva_cordoba": 42000,
            // Default (usa el precio base de la ciudad)
            "default": location.basePrice
        };

        // Ocupación por barrio
        const neighborhoodOccupancy: Record<string, number> = {
            "palermo": 0.74,
            "recoleta": 0.72,
            "belgrano": 0.70,
            "puerto_madero": 0.76,
            "default": location.occupancy
        };

        // Intentar clave compuesta city_neighborhood primero para soportar barrios con mismo nombre
        const compositeKey = `${location.city}_${neighborhood}`;
        const averagePrice = neighborhoodPrices[compositeKey] ?? neighborhoodPrices[neighborhood] ?? neighborhoodPrices.default;
        const occupancyRate = neighborhoodOccupancy[neighborhood] ?? neighborhoodOccupancy.default;
        const monthlyRevenue = averagePrice * 30 * occupancyRate;

        return {
            ...baseData,
            average_price: averagePrice,
            occupancy_rate: occupancyRate,
            revenue_per_month: monthlyRevenue
        };
    };

    // Proyección 2026 ajustada por ciudad
    const calculateProjection2026 = (currentPrice: number, city: string) => {
        const inflation2026 = 1.35; // 35% inflación estimada
        const marketGrowth = 1.12; // 12% crecimiento mercado
        
        // Factores de crecimiento por tipo de ciudad
        const cityFactors: Record<string, number> = {
            "buenos-aires": 1.15,
            "mar-del-plata": 1.25, // Mayor crecimiento en destinos turísticos
            "bariloche": 1.30,
            "ushuaia": 1.28,
            "iguazu": 1.27,
            "cordoba": 1.10,
            "mendoza": 1.12,
            "rosario": 1.08,
            "default": 1.05
        };
        
        const cityFactor = cityFactors[city] || cityFactors.default;
        const seasonalFactor = city.includes("mar-del-plata") || city.includes("bariloche") ? 1.15 : 1.08;
        
        const projectedPrice = currentPrice * inflation2026 * marketGrowth * seasonalFactor * cityFactor;
        
        return Math.round(projectedPrice);
    };

    // Cálculo de ingresos mejorado
    const calculateIncome = async (address: string, propertyType: string, formData: any) => {
        const airbnbData = await fetchAirbnbData(address);
        
        // Multiplicadores por tipo de propiedad
        const propertyTypeMultipliers: Record<string, number> = {
            "apartamento": 1.0,
            "casa": 1.35,
            "habitacion": 0.45
        };
        
        // Precio base según propiedad
        const baseDailyRate = airbnbData.average_price * (propertyTypeMultipliers[propertyType] || 1.0);
        
        let adjustedDailyRate = baseDailyRate;
        
        // Ajustes por características
        const roomsMultiplier = 1 + (parseInt(formData.rooms) - 2) * 0.12;
        adjustedDailyRate *= roomsMultiplier;
        
        const bathroomsMultiplier = 1 + (parseInt(formData.bathrooms) - 1) * 0.08;
        adjustedDailyRate *= bathroomsMultiplier;
        
        // Ajustes por amenities
        let amenitiesMultiplier = 1;
        formData.amenities.forEach((amenity: string) => {
            const amenityData = amenitiesOptions.find(a => a.value === amenity);
            if (amenityData) {
                amenitiesMultiplier += amenityData.impact;
            }
        });
        adjustedDailyRate *= amenitiesMultiplier;
        
        // Ajustes por cochera
        if (formData.garageType !== "none") {
            const garageMultiplier = formData.garageType === "cubierta" ? 1.10 : 1.06;
            adjustedDailyRate *= garageMultiplier * parseInt(formData.garageQuantity);
        }
        
        // Ajustes por tamaño
        const squareMeters = parseInt(formData.squareMeters) || 60;
        const sizeMultiplier = Math.sqrt(squareMeters / 60);
        adjustedDailyRate *= sizeMultiplier;
        
        // Ajuste por ciudad (ciudades turísticas pagan más por m²)
        const cityAdjustment = airbnbData.city.includes("mar-del-plata") || 
                              airbnbData.city.includes("bariloche") || 
                              airbnbData.city.includes("ushuaia") ? 1.15 : 1.0;
        adjustedDailyRate *= cityAdjustment;
        
        // Cálculo final
        const occupancyRate = airbnbData.occupancy_rate;
        const monthlyIncome = adjustedDailyRate * 30 * occupancyRate;
        const annualIncome = monthlyIncome * 12;
        
        // Proyección 2026
        const projectedDailyRate2026 = calculateProjection2026(adjustedDailyRate, airbnbData.city);
        const projectedMonthly2026 = projectedDailyRate2026 * 30 * (occupancyRate * 1.03);
        const projectedAnnual2026 = projectedMonthly2026 * 12;
        
        // Determinar tendencia de demanda
        let demandTrend = "Demanda media";
        if (occupancyRate > 0.75) demandTrend = "Alta demanda";
        if (occupancyRate < 0.60) demandTrend = "Demanda baja";
        
        return {
            dailyRate: Math.round(adjustedDailyRate),
            monthlyIncome: Math.round(monthlyIncome),
            annualIncome: Math.round(annualIncome),
            occupancy: `${Math.round(occupancyRate * 100)}%`,
            projected2026: {
                dailyRate: Math.round(projectedDailyRate2026),
                income: Math.round(projectedMonthly2026),
                annualIncome: Math.round(projectedAnnual2026)
            },
            marketInsights: {
                averageRating: airbnbData.average_rating,
                listingsCount: airbnbData.listings_count,
                demandTrend: demandTrend
            }
        };
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.address.trim() || !formData.propertyType) {
            alert("Por favor, completa la dirección y el tipo de propiedad para continuar.");
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
            alert("Por favor, completa tus datos de contacto para recibir el cálculo preciso.");
            return;
        }

        setIsLoading(true);
        
        try {
            const calculation = await calculateIncome(formData.address, formData.propertyType, formData);
            
            setResults({
                income: calculation.monthlyIncome,
                dailyRate: calculation.dailyRate,
                annualIncome: calculation.annualIncome,
                occupancy: calculation.occupancy,
                projected2026: calculation.projected2026,
                marketInsights: calculation.marketInsights
            });
            setSubmitted(true);

            // Enviar lead a backend
            const leadData = {
                ...formData,
                amenities: formData.selectedAmenitiesLabels,
                monthlyIncome: calculation.monthlyIncome,
                dailyRate: calculation.dailyRate,
                annualIncome: calculation.annualIncome,
                occupancy: calculation.occupancy,
                projected2026: calculation.projected2026,
                marketInsights: calculation.marketInsights,
                timestamp: new Date().toISOString(),
                source: "calculator_2026_inside_airbnb"
            };

            await fetch('/api/send-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leadData)
            });

        } catch (error) {
            console.error("Error en el cálculo:", error);
            alert("Hubo un error al calcular. Por favor, intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="hero">
            <div className="hero-container">
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="hero-badge">
                            <span className="badge-star">★</span>
                            +2500 propiedades gestionadas
                        </div>
                        
                        <h1 className="hero-title">
                            Convertí tu propiedad en una fuente de ingresos
                            <span className="highlight-2026">  para 2026</span>
                        </h1>
                        
                        <p className="hero-description"> 
                            Con datos reales de Airbnb y proyecciones precisas para el próximo año.
                            Nos encargamos de todo: huéspedes, limpieza y administración.
                        </p>

                        <div className="value-props">
                            <div className="value-prop">
                                <svg className="value-icon" width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm4 5.7L7.4 10.3c-.2.2-.5.2-.7 0L4 7.6c-.2-.2-.2-.5 0-.7s.5-.2.7 0L7 9.3l4.3-4.3c.2-.2.5-.2.7 0s.2.5 0 .7z"/>
                                </svg>
                                <span>Proyecciones 2026 ajustadas por ciudad</span>
                            </div>
                            <div className="value-prop">
                                <svg className="value-icon" width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm4 5.7L7.4 10.3c-.2.2-.5.2-.7 0L4 7.6c-.2-.2-.2-.5 0-.7s.5-.2.7 0L7 9.3l4.3-4.3c.2-.2.5-.2.7 0s.2.5 0 .7z"/>
                                </svg>
                                <span>Cobertura en toda Argentina</span>
                            </div>
                        </div>
                    </div>

                    <div className="calculator">
                        <div className="calculator-card">
                            <div className="calculator-header">
                                <h2 className="calculator-title">
                                    ¿Cuánto podés ganar con tu propiedad en 2026?
                                </h2>
                                <div className="calculator-subtitle">
                                    Calculá en 1 minuto usando datos reales
                                </div>
                            </div>
                            
                            {isFetchingData && (
                                <div className="data-loading">
                                    <div className="loading-spinner"></div>
                                    <span>Analizando datos del mercado...</span>
                                </div>
                            )}
                            
                            {!submitted ? (
                                <>
                                    {step === 1 && (
                                        <form onSubmit={handleNextStep} className="calculator-form">
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Dirección de la propiedad
                                                    </label>
                                                    <div className="input-wrapper">
                                                        <svg className="icon icon-location" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                            <path d="M8 0C4.1 0 1 3.1 1 7c0 1.9.7 3.7 2.1 5 .1.1 4.9 4.9 4.9 4.9s4.9-4.8 4.9-4.9c1.4-1.3 2.1-3.1 2.1-5C15 3.1 11.9 0 8 0zm0 10c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
                                                        </svg>
                                                        <input
                                                            type="text"
                                                            placeholder="Ej: Av. Corrientes 1234, Palermo, Buenos Aires"
                                                            value={formData.address}
                                                            onChange={(e) => { 
                                                                setFormData({ ...formData, address: e.target.value }); 
                                                                searchAddress(e.target.value);
                                                            }}
                                                            onFocus={(e) => {
                                                                if (e.target.value.length >= 3) {
                                                                    searchAddress(e.target.value);
                                                                }
                                                            }}
                                                            autoComplete="off"
                                                            required
                                                            className="form-input"
                                                        />
                                                        {isLoading && (
                                                            <div className="loading-spinner"></div>
                                                        )}
                                                    </div>
                                                    {suggestions.length > 0 && (
                                                        <div className="suggestions-dropdown" ref={suggestionsRef}>
                                                            {suggestions.map((s, idx) => (
                                                                <div 
                                                                    key={`${s.lat}-${s.lon}-${idx}`}
                                                                    className="suggestion-item"
                                                                    onClick={() => selectSuggestion(s)}
                                                                >
                                                                    <svg className="icon icon-pin" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                                                        <path d="M8 0C4.1 0 1 3.1 1 7c0 1.9.7 3.7 2.1 5 .1.1 4.9 4.9 4.9 4.9s4.9-4.8 4.9-4.9c1.4-1.3 2.1-3.1 2.1-5C15 3.1 11.9 0 8 0zm0 10c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
                                                                    </svg>
                                                                    <span className="suggestion-text">{s.display_name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">Tipo de propiedad</label>
                                                    <div className="input-wrapper">
                                                        <svg className="icon icon-home" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                            <path d="M8 0L0 6v10h6v-6h4v6h6V6L8 0z"/>
                                                        </svg>
                                                        <select 
                                                            value={formData.propertyType} 
                                                            onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })} 
                                                            required
                                                            className="form-select"
                                                        >
                                                            <option value="" disabled>Seleccioná tu propiedad</option>
                                                            <option value="apartamento">Departamento</option>
                                                            <option value="casa">Casa</option>
                                                            <option value="habitacion">Habitación</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="features-grid">
                                                <div className="feature-group">
                                                    <label className="form-label">
                                                        <svg className="icon icon-bed" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                                        </svg>
                                                        Ambientes
                                                    </label>
                                                    <div className="input-wrapper">
                                                        <svg className="icon icon-bed" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                                            <path d="M2 4v8h1V7h10v5h1V4H2zm3 5H3V5h2v4zm3 0H6V5h2v4zm3 0H9V5h2v4z"/>
                                                        </svg>
                                                        <select 
                                                            value={formData.rooms} 
                                                            onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                                                            className="form-select"
                                                        >
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5+</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                                <div className="feature-group">
                                                    <label className="form-label">
                                                        <svg className="icon icon-bath" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                                        </svg>
                                                        Baños
                                                    </label>
                                                    <div className="input-wrapper">
                                                        <svg className="icon icon-bath" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                                            <path d="M5 2a2 2 0 00-2 2v1h10V4a2 2 0 00-2-2H5zm9 3H2v6c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5z"/>
                                                        </svg>
                                                        <select 
                                                            value={formData.bathrooms} 
                                                            onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                                                            className="form-select"
                                                        >
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4+</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="feature-group">
                                                    <label className="form-label">
                                                        <svg className="icon icon-size" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                                        </svg>
                                                        M²
                                                    </label>
                                                    <div className="input-wrapper">
                                                        <svg className="icon icon-size" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                                          <path d="M14 4h-3V2c0-1.1-.9-2-2-2H7C5.9 0 5 .9 5 2v2H2C.9 4 0 4.9 0 6v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7 2h2v2H7V2zm7 12H2V6h12v8z"/>
                                                        </svg>
                                                        <select 
                                                            value={formData.squareMeters} 
                                                            onChange={(e) => setFormData({ ...formData, squareMeters: e.target.value })}
                                                            className="form-select"
                                                        >
                                                            <option value="30">30-40 m²</option>
                                                            <option value="50">41-60 m²</option>
                                                            <option value="70">61-80 m²</option>
                                                            <option value="90">81-100 m²</option>
                                                            <option value="120">100+ m²</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group" ref={amenitiesRef}>
                                                <label className="form-label">Amenities Principales</label>
                                                <div className="input-wrapper">
                                                    <svg className="icon icon-amenities" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                        <path d="M14 4h-3V2c0-1.1-.9-2-2-2H7C5.9 0 5 .9 5 2v2H2C.9 4 0 4.9 0 6v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7 2h2v2H7V2zm7 12H2V6h12v8z"/>
                                                    </svg>
                                                    <div 
                                                        className="amenities-selector"
                                                        onClick={toggleAmenitiesDropdown}
                                                    >
                                                        <div className="amenities-selected">
                                                            {formData.selectedAmenitiesLabels.length > 0 ? (
                                                                <div className="selected-tags">
                                                                    {formData.selectedAmenitiesLabels.slice(0, 3).map((label, index) => (
                                                                        <span key={index} className="selected-tag">
                                                                            {label}
                                                                        </span>
                                                                    ))}
                                                                    {formData.selectedAmenitiesLabels.length > 3 && (
                                                                        <span className="more-count">
                                                                            +{formData.selectedAmenitiesLabels.length - 3}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="amenities-placeholder">Seleccionar amenities</span>
                                                            )}
                                                        </div>
                                                        <svg className="icon icon-chevron" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                                            <path d="M8 11.4l-4-4L5.4 6 8 8.6 10.6 6 12 7.4l-4 4z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                
                                                <div className="amenities-dropdown" style={{ display: 'none' }}>
                                                    <div className="amenities-grid-dropdown">
                                                        {amenitiesOptions.map((amenity) => (
                                                            <div 
                                                                key={amenity.id}
                                                                className={`amenity-option ${formData.amenities.includes(amenity.value) ? 'selected' : ''}`}
                                                                onClick={() => toggleAmenity(amenity)}
                                                            >
                                                                <span className="amenity-label">{amenity.label}</span>
                                                                <span className="amenity-check">
                                                                    {formData.amenities.includes(amenity.value) ? '✓' : ''}
                                                                </span>
                                                                <span className="amenity-impact">+{Math.round(amenity.impact * 100)}%</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="amenities-footer">
                                                        <button 
                                                            type="button" 
                                                            className="amenities-clear"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setFormData({
                                                                    ...formData,
                                                                    amenities: [],
                                                                    selectedAmenitiesLabels: []
                                                                });
                                                            }}
                                                        >
                                                            Limpiar
                                                        </button>
                                                        <span className="selected-count">
                                                            {formData.amenities.length} seleccionadas
                                                        </span>
                                                        <button 
                                                            type="button" 
                                                            className="amenities-done"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const dropdown = document.querySelector('.amenities-dropdown');
                                                                if (dropdown) {
                                                                    (dropdown as HTMLElement).style.display = 'none';
                                                                }
                                                            }}
                                                        >
                                                            Aplicar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="garage-section">
                                                <label className="form-label">Cochera</label>
                                                <div className="garage-grid">
                                                    <div className="form-group">
                                                        <select 
                                                            value={formData.garageType} 
                                                            onChange={(e) => setFormData({ ...formData, garageType: e.target.value })}
                                                            className="form-select"
                                                        >
                                                            <option value="none">Sin cochera</option>
                                                            <option value="cubierta">Cubierta</option>
                                                            <option value="descubierta">Descubierta</option>
                                                        </select>
                                                    </div>
                                                    {formData.garageType !== "none" && (
                                                        <div className="form-group">
                                                            <select 
                                                                value={formData.garageQuantity} 
                                                                onChange={(e) => setFormData({ ...formData, garageQuantity: e.target.value })}
                                                                className="form-select"
                                                            >
                                                                <option value="1">1</option>
                                                                <option value="2">2</option>
                                                                <option value="3">3</option>
                                                                <option value="4">4+</option>
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <button type="submit" className="btn btn-primary btn-next">
                                                Ver proyección 2026
                                                <svg className="icon icon-arrow-right" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                    <path d="M11.7 7.3L7.7 3.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4L8.6 7H2c-.6 0-1 .4-1 1s.4 1 1 1h6.6l-2.3 2.3c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l4-4c.4-.4.4-1 0-1.4z"/>
                                                </svg>
                                            </button>
                                        </form>
                                    )}

                                    {step === 2 && (
                                        <form onSubmit={handleSubmit} className="calculator-form">
                                            <div className="contact-subtitle">
                                                Te contactamos con los números exactos y proyección 2026 para tu propiedad
                                            </div>
                                            
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-label">Tu nombre</label>
                                                    <div className="input-wrapper">
                                                        <svg className="icon icon-user" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                            <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"/>
                                                            <path d="M7 11h2V7H7v4zm0-6h2V5H7v0z"/>
                                                        </svg>
                                                        <input 
                                                            type="text" 
                                                            placeholder="Nombre y apellido" 
                                                            value={formData.fullName} 
                                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} 
                                                            required
                                                            className="form-input"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="form-group">
                                                    <label className="form-label">Tu email</label>
                                                    <div className="input-wrapper">
                                                        <svg className="icon icon-email" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                            <path d="M14 3H2c-.6 0-1 .4-1 1v8c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V4c0-.6-.4-1-1-1zm0 2l-6 4-6-4V4l6 4 6-4v1z"/>
                                                        </svg>
                                                        <input 
                                                            type="email" 
                                                            placeholder="tu@email.com" 
                                                            value={formData.email} 
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                                            required
                                                            className="form-input"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Tu teléfono</label>
                                                <div className="input-wrapper">
                                                    <svg className="icon icon-phone" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                        <path d="M3 2h10c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm10 10V4H3v8h10z"/>
                                                    </svg>
                                                    <input 
                                                        type="tel" 
                                                        placeholder="Tu número de teléfono" 
                                                        value={formData.phone} 
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                                                        required
                                                        className="form-input"
                                                    />
                                                </div>
                                            </div>

                                            <div className="privacy-notice">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                    <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zm0 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"/>
                                                    <path d="M7 11h2V7H7v4zm0-6h2V5H7v0z"/>
                                                </svg>
                                                <span>Tu información está 100% protegida</span>
                                            </div>

                                            <div className="form-actions">
                                                <button 
                                                    type="button" 
                                                    onClick={() => setStep(1)}
                                                    className="btn btn-secondary"
                                                >
                                                    <svg className="icon icon-arrow-left" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                        <path d="M4.3 7.3l4-4c.4-.4 1-.4 1.4 0s.4 1 0 1.4L7.4 7H14c.6 0 1 .4 1 1s-.4 1-1 1H7.4l2.3 2.3c.4.4.4 1 0 1.4-.2.2-.5.3-.7.3s-.5-.1-.7-.3l-4-4c.4-.4.4-1 0-1.4z"/>
                                                    </svg>
                                                    Atrás
                                                </button>
                                                <button type="submit" className="btn btn-primary">
                                                    Ver mi proyección 2026
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </>
                            ) : (
                                <div className="results-section">
                                    <div className="results-header">
                                        <svg className="icon icon-success" width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm4 5.7L7.4 10.3c-.2.2-.5.2-.7 0L4 7.6c-.2-.2-.2-.5 0-.7s.5-.2.7 0L7 9.3l4.3-4.3c.2-.2.5-.2.7 0s.2.5 0 .7z"/>
                                        </svg>
                                        <h3 className="results-title">Tu propiedad tiene gran potencial para 2026</h3>
                                    </div>
                                    
                                    <div className="results-subtitle">
                                        Estos son los números estimados para tu propiedad:
                                    </div>
                                    
                                    <div className="results-grid">
                                        <div className="result-card highlight">
                                            <div className="result-label">Podés cobrar por día (2025)</div>
                                            <div className="result-value">${results?.dailyRate.toLocaleString("es-AR")}</div>
                                        </div>
                                        <div className="result-card highlight">
                                            <div className="result-label">Al año podés ganar (2025)</div>
                                            <div className="result-value">${results?.annualIncome.toLocaleString("es-AR")}</div>
                                        </div>
                                        <div className="result-card">
                                            <div className="result-label">Ocupación en tu zona</div>
                                            <div className="result-value">{results?.occupancy}</div>
                                        </div>
                                        <div className="result-card">
                                            <div className="result-label">Vs alquiler tradicional</div>
                                            <div className="result-value">+25%</div>
                                        </div>
                                    </div>
                                    
                                    <div className="projection-2026">
                                        <h4 className="projection-title">
                                            <svg className="icon icon-trend" width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                                                <path d="M16 6l-3-3-5 5-2-2-5 5v2h16V6zM0 14h16v2H0z"/>
                                            </svg>
                                            Proyección para 2026
                                        </h4>
                                        <div className="projection-grid">
                                            <div className="projection-card">
                                                <div className="projection-label">Tarifa diaria estimada</div>
                                                <div className="projection-value">${results?.projected2026.dailyRate.toLocaleString("es-AR")}</div>
                                                <div className="projection-change">+{Math.round(((results?.projected2026.dailyRate || 0) / (results?.dailyRate || 1) - 1) * 100)}%</div>
                                            </div>
                                            <div className="projection-card">
                                                <div className="projection-label">Ingreso anual proyectado</div>
                                                <div className="projection-value">${results?.projected2026.annualIncome.toLocaleString("es-AR")}</div>
                                                <div className="projection-change">+{Math.round(((results?.projected2026.annualIncome || 0) / (results?.annualIncome || 1) - 1) * 100)}%</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="market-insights">
                                        <h4 className="insights-title">Insights de tu barrio</h4>
                                        <div className="insights-grid">
                                            <div className="insight-card">
                                                <div className="insight-label">Promedio de calificación</div>
                                                <div className="insight-value">{results?.marketInsights.averageRating.toFixed(1)} ★</div>
                                            </div>
                                            <div className="insight-card">
                                                <div className="insight-label">Propiedades activas</div>
                                                <div className="insight-value">{results?.marketInsights.listingsCount}</div>
                                            </div>
                                            <div className="insight-card">
                                                <div className="insight-label">Tendencia de demanda</div>
                                                <div className={`insight-value ${results?.marketInsights.demandTrend.includes('Alta') ? 'high-demand' : results?.marketInsights.demandTrend.includes('media') ? 'medium-demand' : 'low-demand'}`}>
                                                    {results?.marketInsights.demandTrend}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="results-cta">
                                        <p className="success-message">
                                            Un especialista de tu zona te va a contactar para darte los números exactos 
                                            y contarte cómo empezar a ganar más con tu propiedad en 2026.
                                        </p>
                                        <p className="email-notice">
                                            Los detalles y proyección completa han sido enviados a tu email: <strong>{formData.email}</strong>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hero {
                    background: #ffffff;
                    color: #333333;
                    padding: 5rem 0 3rem 0;
                    position: relative;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                }
                
                .hero-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }
                
                .hero-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    align-items: start;
                }
                
                .hero-text {
                    max-width: 420px;
                    padding-top: 1rem;
                }
                
                .hero-badge {
                    background: #74acdf;
                    color: white;
                    padding: 0.8rem 1.2rem;
                    border-radius: 24px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 4px 12px rgba(116, 172, 223, 0.3);
                }
                
                .badge-star {
                    font-size: 0.9rem;
                }
                
                .hero-title {
                    font-size: 2.2rem;
                    font-weight: 700;
                    line-height: 1.2;
                    margin-bottom: 1.2rem;
                    color: #333333;
                }
                
                .highlight-2026 {
                    color: #74acdf;
                    background: linear-gradient(45deg, #74acdf, #0c5db9ff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-weight: 800;
                    display: inline-block;
                }
                
                .hero-description {
                    font-size: 1.1rem;
                    color: #666666;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }
                
                .value-props {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .value-prop {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    font-size: 1rem;
                    color: #333333;
                    font-weight: 500;
                }
                
                .value-icon {
                    color: #74acdf;
                    flex-shrink: 0;
                }
                
                .calculator {
                    max-width: 520px;
                }
                
                .calculator-card {
                    background: #ffffff;
                    border-radius: 20px;
                    padding: 2.5rem;
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(253, 250, 247, 0.5);
                    color: #333333;
                }
                
                .calculator-header {
                    margin-bottom: 1.8rem;
                }
                
                .calculator-title {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #333333;
                    margin: 0 0 0.5rem 0;
                    line-height: 1.3;
                }
                
                .calculator-subtitle {
                    font-size: 0.95rem;
                    color: #666666;
                    line-height: 1.5;
                }
                
                .contact-subtitle {
                    font-size: 0.9rem;
                    color: #74acdf;
                    font-weight: 600;
                    margin-bottom: 1.8rem;
                    text-align: center;
                    padding: 1rem;
                    background: rgba(116, 172, 223, 0.1);
                    border-radius: 10px;
                }
                
                .data-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    gap: 1rem;
                }
                
                .data-loading .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #74acdf;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .calculator-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.2rem;
                }
                
                .form-group {
                    position: relative;
                }
                
                .form-label {
                    display: block;
                    font-size: 0.95rem;
                    font-weight: 600;
                    margin-bottom: 0.6rem;
                    color: #333333;
                }
                
                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    width: 100%;
                }
                
                .icon {
                    position: absolute;
                    left: 1rem;
                    color: #666666;
                    z-index: 2;
                    pointer-events: none;
                }
                
                .form-input, .form-select {
                    width: 100%;
                    padding: 1rem 1rem 1rem 3rem;
                    border: 2px solid #e1e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    background: white;
                    color: #333333;
                    height: 48px;
                    font-family: inherit;
                }
                
                .form-input:focus, .form-select:focus {
                    outline: none;
                    border-color: #74acdf;
                    box-shadow: 0 0 0 3px rgba(116, 172, 223, 0.1);
                }
                
                .loading-spinner {
                    position: absolute;
                    right: 1rem;
                    width: 16px;
                    height: 16px;
                    border: 2px solid #e1e8f0;
                    border-top: 2px solid #74acdf;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                .suggestions-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 2px solid #74acdf;
                    border-top: none;
                    border-radius: 0 0 12px 12px;
                    max-height: 220px;
                    overflow-y: auto;
                    z-index: 10;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                }
                
                .suggestion-item {
                    padding: 1rem;
                    cursor: pointer;
                    border-bottom: 1px solid #f1f3f4;
                    transition: background 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    font-size: 0.95rem;
                }
                
                .suggestion-item:hover {
                    background: #f8f9fa;
                }
                
                .suggestion-text {
                    color: #333333;
                    font-size: 0.95rem;
                }
                
                .features-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 1.2rem;
                    margin-top: 0.5rem;
                }
                
                .feature-group {
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }
                
                .feature-group .form-label {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    margin-bottom: 0.6rem;
                }
                
                .feature-group .form-select {
                    padding-left: 3rem;
                    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-position: right 1rem center;
                    background-size: 16px;
                    cursor: pointer;
                }
                
                .feature-group .input-wrapper .icon {
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                }
                
                .amenities-selector {
                    width: 100%;
                    padding: 1rem 1rem 1rem 3rem;
                    border: 2px solid #e1e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    background: white;
                    color: #333333;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.3s ease;
                    height: 48px;
                }
                
                .amenities-selector:hover {
                    border-color: #74acdf;
                }
                
                .amenities-selected {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    overflow: hidden;
                }
                
                .selected-tags {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                    flex-wrap: wrap;
                }
                
                .selected-tag {
                    background: #e8f2fc;
                    color: #74acdf;
                    padding: 0.4rem 0.8rem;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    white-space: nowrap;
                }
                
                .more-count {
                    background: #e9ecef;
                    color: #6c757d;
                    padding: 0.4rem 0.8rem;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                
                .amenities-placeholder {
                    color: #6c757d;
                    font-size: 1rem;
                }
                
                .icon-chevron {
                    position: static;
                    margin-left: auto;
                    transition: transform 0.3s ease;
                }
                
                .amenities-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 2px solid #74acdf;
                    border-radius: 12px;
                    margin-top: 0.5rem;
                    z-index: 20;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    max-height: 320px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                
                .amenities-grid-dropdown {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.5rem;
                    padding: 1rem;
                    overflow-y: auto;
                    max-height: 250px;
                }
                
                .amenity-option {
                    padding: 0.9rem;
                    border: 1.5px solid #e1e8f0;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    transition: all 0.2s ease;
                    font-size: 0.95rem;
                    background: white;
                }
                
                .amenity-option:hover {
                    border-color: #74acdf;
                    background: #f8fbff;
                    transform: translateY(-1px);
                }
                
                .amenity-option.selected {
                    border-color: #74acdf;
                    background: #e8f2fc;
                    font-weight: 600;
                }
                
                .amenity-label {
                    flex: 1;
                    font-weight: 500;
                }
                
                .amenity-check {
                    color: #74acdf;
                    font-weight: bold;
                    font-size: 1.1rem;
                    margin-left: 0.5rem;
                }
                
                .amenity-impact {
                    font-size: 0.8rem;
                    color: #408ed7ff;
                    font-weight: 600;
                    margin-left: 0.5rem;
                }
                
                .amenities-footer {
                    padding: 1rem;
                    border-top: 1px solid #e1e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #f8f9fa;
                }
                
                .selected-count {
                    font-size: 0.85rem;
                    color: #6c757d;
                    font-weight: 500;
                }
                
                .amenities-clear, .amenities-done {
                    padding: 0.5rem 1.2rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    border: none;
                    font-family: inherit;
                }
                
                .amenities-clear {
                    background: #f8f9fa;
                    border: 1.5px solid #dee2e6;
                    color: #6c757d;
                }
                
                .amenities-clear:hover {
                    background: #e9ecef;
                }
                
                .amenities-done {
                    background: #74acdf;
                    color: white;
                }
                
                .amenities-done:hover {
                    background: #5a8bc7;
                }
                
                .garage-section {
                    margin-top: 0.5rem;
                }
                
                .garage-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.2rem;
                }
                
                .privacy-notice {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    font-size: 0.85rem;
                    color: #666666;
                    text-align: center;
                    justify-content: center;
                    padding: 0.8rem;
                    background: #f8f9fa;
                    border-radius: 8px;
                    margin-top: 0.5rem;
                }
                
                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.6rem;
                    padding: 1rem 2rem;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    height: 50px;
                    font-family: inherit;
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #74acdf 0%, #5a8bc7 100%);
                    color: white;
                }
                
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(116, 172, 223, 0.4);
                }
                
                .btn-secondary {
                    background: #f8f9fa;
                    color: #333333;
                    border: 2px solid #e1e8f0;
                }
                
                .btn-secondary:hover {
                    background: #e8e2dc;
                }
                
                .form-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.2rem;
                }
                
                .form-actions .btn {
                    flex: 1;
                }
                
                .results-section {
                    text-align: center;
                }
                
                .results-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.8rem;
                    margin-bottom: 1.2rem;
                }
                
                .icon-success {
                    color: #408ed7ff;
                }
                
                .results-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #74acdf;
                    margin: 0;
                    line-height: 1.3;
                }
                
                .results-subtitle {
                    font-size: 0.95rem;
                    color: #666666;
                    margin-bottom: 2rem;
                }
                
                .results-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                
                .result-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 2px solid #e1e8f0;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .result-card.highlight {
                    border-color: #74acdf;
                    background: linear-gradient(135deg, #f8fbff 0%, #f0f7ff 100%);
                }
                
                .result-label {
                    font-size: 0.85rem;
                    color: #666666;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }
                
                .result-value {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #333333;
                }
                
                .projection-2026 {
                    background: linear-gradient(135deg, #f8fff8 0%, #f0f7ff 100%);
                    border: 2px solid #408ed7ff;
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                
                .projection-title {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #408ed7ff;
                    font-size: 1.1rem;
                    margin-bottom: 1rem;
                }
                
                .projection-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                
                .projection-card {
                    background: white;
                    padding: 1rem;
                    border-radius: 8px;
                    border: 1px solid #E8F5E9;
                }
                
                .projection-label {
                    font-size: 0.85rem;
                    color: #666666;
                    margin-bottom: 0.3rem;
                }
                
                .projection-value {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #408ed7ff;
                }
                
                .projection-change {
                    font-size: 0.8rem;
                    color: #408ed7ff;
                    font-weight: 600;
                }
                
                .market-insights {
                    margin-top: 1.5rem;
                    padding: 1.5rem;
                    background: #f8f9fa;
                    border-radius: 12px;
                    margin-bottom: 1.5rem;
                }
                
                .insights-title {
                    font-size: 1rem;
                    color: #333333;
                    margin-bottom: 1rem;
                    font-weight: 600;
                }
                
                .insights-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                }
                
                .insight-card {
                    background: white;
                    padding: 1rem;
                    border-radius: 8px;
                    text-align: center;
                }
                
                .insight-label {
                    font-size: 0.8rem;
                    color: #666666;
                    margin-bottom: 0.5rem;
                }
                
                .insight-value {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #333333;
                }
                
                .high-demand {
                    color: #408ed7ff;
                }
                
                .medium-demand {
                    color: #63a2cdff;
                }
                
                .low-demand {
                    color: #74acdf;
                }
                
                .results-cta {
                    margin-top: 2rem;
                }
                
                .success-message {
                    color: #333333;
                    font-weight: 500;
                    font-size: 0.95rem;
                    margin: 0 0 1rem 0;
                    line-height: 1.5;
                }
                
                .email-notice {
                    color: #74acdf;
                    font-size: 0.9rem;
                    font-weight: 600;
                    padding: 0.8rem;
                    background: rgba(116, 172, 223, 0.1);
                    border-radius: 8px;
                }
                
                @media (max-width: 1024px) {
                    .hero-content {
                        gap: 3rem;
                    }
                    
                    .hero-text {
                        max-width: 380px;
                    }
                    
                    .calculator {
                        max-width: 480px;
                    }
                }
                
                @media (max-width: 768px) {
                    .hero {
                        padding: 4rem 0 2rem 0;
                    }
                    
                    .hero-content {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }
                    
                    .hero-text {
                        max-width: 100%;
                        text-align: center;
                        padding-top: 0;
                    }
                    
                    .hero-title {
                        font-size: 2rem;
                    }
                    
                    .hero-description {
                        font-size: 1rem;
                    }
                    
                    .value-props {
                        flex-direction: row;
                        justify-content: center;
                        flex-wrap: wrap;
                        gap: 1.5rem;
                    }
                    
                    .value-prop {
                        font-size: 0.95rem;
                    }
                    
                    .calculator {
                        max-width: 100%;
                    }
                    
                    .calculator-card {
                        padding: 2rem;
                    }
                    
                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 1.2rem;
                    }
                    
                    .features-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .amenities-grid-dropdown {
                        grid-template-columns: 1fr;
                    }
                    
                    .garage-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    
                    .results-grid, .projection-grid, .insights-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .form-actions {
                        flex-direction: column;
                    }
                }
                
                @media (max-width: 480px) {
                    .hero {
                        padding: 3rem 0 1.5rem 0;
                    }
                    
                    .calculator-card {
                        padding: 1.5rem;
                    }
                    
                    .form-input, .form-select, .amenities-selector {
                        padding: 0.9rem 0.9rem 0.9rem 2.8rem;
                        font-size: 0.95rem;
                        height: 46px;
                    }
                    
                    .btn {
                        padding: 0.9rem 1.5rem;
                        font-size: 0.95rem;
                        height: 48px;
                    }
                    
                    .results-grid, .projection-grid, .insights-grid {
                        gap: 0.8rem;
                    }
                    
                    .result-card, .projection-card, .insight-card {
                        padding: 1.2rem;
                    }
                }
            `}</style>
        </section>
    );
}