"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface NominatimResult {
    display_name: string;
    lat: string;
    lon: string;
}

interface Results {
    income: number;
    occupancy: string;
    dailyRate: number;
    annualIncome: number;
}

interface Amenity {
    id: string;
    label: string;
    value: string;
}

export default function Hero() {
    const [step, setStep] = useState(1);
    const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
    const [results, setResults] = useState<Results | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const amenitiesRef = useRef<HTMLDivElement>(null);

    // Definir amenities
    const amenitiesOptions: Amenity[] = [
        { id: "pool", label: "Pileta", value: "pool" },
        { id: "gym", label: "Gimnasio", value: "gym" },
        { id: "wifi", label: "WiFi Premium", value: "wifi" },
        { id: "ac", label: "Aire Acondicionado", value: "ac" },
        { id: "heating", label: "Calefacción", value: "heating" },
        { id: "kitchen", label: "Cocina Equipada", value: "kitchen" },
        { id: "tv", label: "Smart TV", value: "tv" },
        { id: "laundry", label: "Lavandería", value: "laundry" },
        { id: "parking", label: "Estacionamiento", value: "parking" },
        { id: "elevator", label: "Ascensor", value: "elevator" },
        { id: "security", label: "Seguridad 24hs", value: "security" },
        { id: "garden", label: "Jardín/Patio", value: "garden" },
        { id: "bbq", label: "Parrilla", value: "bbq" },
        { id: "terrace", label: "Terraza", value: "terrace" },
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
    });

    // Cerrar sugerencias al hacer clic fuera
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

    // Debounce para búsqueda de direcciones
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

                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                const data = await response.json();
                setSuggestions(data || []);
            } catch (err) {
                console.error("Error en búsqueda:", err);
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

    // Función para toggle de amenities
    const toggleAmenity = (amenity: Amenity) => {
        const isSelected = formData.amenities.includes(amenity.value);
        let newAmenities: string[];
        let newLabels: string[];

        if (isSelected) {
            newAmenities = formData.amenities.filter(a => a !== amenity.value);
            newLabels = formData.selectedAmenitiesLabels.filter(l => l !== amenity.label);
        } else {
            newAmenities = [...formData.amenities, amenity.value];
            newLabels = [...formData.selectedAmenitiesLabels, amenity.label];
        }

        setFormData({
            ...formData,
            amenities: newAmenities,
            selectedAmenitiesLabels: newLabels
        });
    };

    // Función para mostrar/ocultar dropdown de amenities
    const toggleAmenitiesDropdown = () => {
        const dropdown = document.querySelector('.amenities-dropdown');
        if (dropdown) {
            const isVisible = (dropdown as HTMLElement).style.display === 'block';
            (dropdown as HTMLElement).style.display = isVisible ? 'none' : 'block';
        }
    };

    const detectNeighborhood = (address: string) => {
        const lower = address.toLowerCase();
        
        const locations: { [key: string]: string } = {
            "palermo": "palermo", "recoleta": "recoleta", "belgrano": "belgrano",
            "san telmo": "san_telmo", "puerto madero": "puerto_madero", 
            "microcentro": "microcentro", "retiro": "retiro", "almagro": "almagro",
            "caballito": "caballito", "villa crespo": "villa_crespo", "núñez": "nuñez",
            "nuñez": "nuñez", "san isidro": "san_isidro", "vicente lópez": "vicente_lopez",
            "tigre": "tigre", "nordelta": "nordelta", "la plata": "la_plata",
            "mar del plata": "mar_del_plata", "córdoba": "cordoba", "mendoza": "mendoza",
            "rosario": "rosario", "bariloche": "bariloche", "salta": "salta"
        };

        for (const [key, value] of Object.entries(locations)) {
            if (lower.includes(key)) return value;
        }
        
        return "default";
    };

    const pricingData: any = {
        palermo: { 
            apartamento: { monthly: 450000, daily: 15000, occupancy: "88%" },
            casa: { monthly: 600000, daily: 20000, occupancy: "85%" },
            habitacion: { monthly: 180000, daily: 6000, occupancy: "80%" }
        },
        recoleta: { 
            apartamento: { monthly: 420000, daily: 14000, occupancy: "86%" },
            casa: { monthly: 550000, daily: 18300, occupancy: "83%" },
            habitacion: { monthly: 160000, daily: 5300, occupancy: "78%" }
        },
        belgrano: { 
            apartamento: { monthly: 380000, daily: 12700, occupancy: "84%" },
            casa: { monthly: 500000, daily: 16700, occupancy: "80%" },
            habitacion: { monthly: 150000, daily: 5000, occupancy: "75%" }
        },
        puerto_madero: { 
            apartamento: { monthly: 600000, daily: 20000, occupancy: "90%" },
            casa: { monthly: 800000, daily: 26700, occupancy: "87%" },
            habitacion: { monthly: 250000, daily: 8300, occupancy: "82%" }
        },
        default: { 
            apartamento: { monthly: 250000, daily: 8300, occupancy: "70%" },
            casa: { monthly: 350000, daily: 11700, occupancy: "65%" },
            habitacion: { monthly: 120000, daily: 4000, occupancy: "60%" }
        }
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.address || !formData.propertyType) {
            alert("Completá la dirección y tipo de propiedad para continuar.");
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email) {
            alert("Necesitamos tus datos para calcular tus ingresos exactos.");
            return;
        }

        const neighborhood = detectNeighborhood(formData.address);
        const locationData = pricingData[neighborhood] || pricingData.default;
        const propertyData = locationData[formData.propertyType] || locationData.apartamento;

        let monthlyIncome = propertyData.monthly + 
            (parseInt(formData.rooms) - 2) * 30000 + 
            (parseInt(formData.bathrooms) - 1) * 20000;

        const amenitiesBonus = formData.amenities.length * 15000;
        monthlyIncome += amenitiesBonus;

        let garageBonus = 0;
        if (formData.garageType !== "none") {
            garageBonus = formData.garageType === "cubierta" ? 40000 : 25000;
            garageBonus *= parseInt(formData.garageQuantity);
            monthlyIncome += garageBonus;
        }

        const dailyRate = propertyData.daily;
        const annualIncome = Math.round(monthlyIncome * 12 * (parseInt(propertyData.occupancy) / 100));
        const occupancy = propertyData.occupancy;

        try {
            const leadData = {
                ...formData,
                amenities: formData.selectedAmenitiesLabels,
                monthlyIncome,
                dailyRate,
                annualIncome,
                occupancy,
                neighborhood,
                timestamp: new Date().toISOString()
            };

            console.log("Lead enviado:", leadData);
            console.log("Email destino: matarmariajose@gmail.com");
            
        } catch (error) {
            console.error("Error al enviar email:", error);
        }

        setResults({ 
            income: monthlyIncome,
            occupancy,
            dailyRate,
            annualIncome
        });
        setSubmitted(true);
    };

    return (
        <section className="hero">
            <div className="hero-container">
                <div className="hero-content">
                    {/* Texto hero - Tamaños aumentados */}
                    <div className="hero-text">
                        <div className="hero-badge">
                            <span className="badge-star">★</span>
                            +2500 propiedades gestionadas
                        </div>
                        
                        <h1 className="hero-title">
                            Convertí tu propiedad en una fuente de ingresos
                        </h1>
                        
                        <p className="hero-description"> 
                            Nos encargamos de todo: huéspedes, limpieza y administración.
                        </p>

                        <div className="value-props">
                            <div className="value-prop">
                                <svg className="value-icon" width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm4 5.7L7.4 10.3c-.2.2-.5.2-.7 0L4 7.6c-.2-.2-.2-.5 0-.7s.5-.2.7 0L7 9.3l4.3-4.3c.2-.2.5-.2.7 0s.2.5 0 .7z"/>
                                </svg>
                                <span>Ingresos mensuales garantizados</span>
                            </div>
                            <div className="value-prop">
                                <svg className="value-icon" width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm4 5.7L7.4 10.3c-.2.2-.5.2-.7 0L4 7.6c-.2-.2-.2-.5 0-.7s.5-.2.7 0L7 9.3l4.3-4.3c.2-.2.5-.2.7 0s.2.5 0 .7z"/>
                                </svg>
                                <span>Más de 85% de ocupación en CABA</span>
                            </div>
                        </div>
                    </div>

                    {/* Calculator - Tamaños aumentados */}
                    <div className="calculator">
                        <div className="calculator-card">
                            <div className="calculator-header">
                                <h2 className="calculator-title">
                                    ¿Cuánto podés ganar con tu propiedad?
                                </h2>
                                <div className="calculator-subtitle">
                                    Calculá en 1 minuto el potencial de ingresos
                                </div>
                            </div>
                            
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
                                                            placeholder="Ej: Av. Corrientes 1234, Palermo"
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
                                                            <path d="M2 4v8h1V7h10v5h1V4H2zm3 5H3V5h2v4zm3 0H6V5h2v4zm3 0H9V5h2v4z"/>
                                                        </svg>
                                                        Ambientes
                                                    </label>
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
                                                
                                                <div className="feature-group">
                                                    <label className="form-label">
                                                        <svg className="icon icon-bath" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                                            <path d="M5 2a2 2 0 00-2 2v1h10V4a2 2 0 00-2-2H5zm9 3H2v6c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5z"/>
                                                        </svg>
                                                        Baños
                                                    </label>
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

                                            {/* Selector de Amenities mejorado */}
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
                                                
                                                {/* Dropdown de Amenities mejorado */}
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

                                            {/* Sección de Cochera */}
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
                                                Ver cuánto podés ganar
                                                <svg className="icon icon-arrow-right" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                    <path d="M11.7 7.3L7.7 3.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4L8.6 7H2c-.6 0-1 .4-1 1s.4 1 1 1h6.6l-2.3 2.3c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l4-4c.4-.4.4-1 0-1.4z"/>
                                                </svg>
                                            </button>
                                        </form>
                                    )}

                                    {step === 2 && (
                                        <form onSubmit={handleSubmit} className="calculator-form">
                                            <div className="contact-subtitle">
                                                Te contactamos con los números exactos para tu propiedad
                                            </div>
                                            
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label className="form-label">Tu nombre</label>
                                                    <div className="input-wrapper">
                                                        <svg className="icon icon-user" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                                            <path d="M8 8c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.8 0-5 2.2-5 5v1h10v-1c0-2.8-2.2-5-5-5z"/>
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
                                                    Ver mis números
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
                                        <h3 className="results-title">Tu propiedad puede generar mucho más</h3>
                                    </div>
                                    
                                    <div className="results-subtitle">
                                        Estos son los números estimados para tu propiedad:
                                    </div>
                                    
                                    <div className="results-grid">
                                        <div className="result-card highlight">
                                            <div className="result-label">Podés cobrar por día</div>
                                            <div className="result-value">${results?.dailyRate.toLocaleString("es-AR")}</div>
                                        </div>
                                        <div className="result-card highlight">
                                            <div className="result-label">Al año podés ganar</div>
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
                                    
                                    <div className="results-cta">
                                        <p className="success-message">
                                            Un especialista de tu zona te va a contactar para darte los números exactos 
                                            y contarte cómo empezar a ganar más con tu propiedad.
                                        </p>
                                        <p className="email-notice">
                                            Los detalles han sido enviados a tu email: <strong>{formData.email}</strong>
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
                    background: var(--primary);
                    color: var(--text);
                    padding: 5rem 0 3rem 0;
                    position: relative;
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
                    background: var(--accent);
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
                    color: var(--text);
                }
                
                .hero-description {
                    font-size: 1.1rem;
                    color: var(--text-light);
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
                    color: var(--text);
                    font-weight: 500;
                }
                
                .value-icon {
                    color: var(--accent);
                    flex-shrink: 0;
                }
                
                .calculator {
                    max-width: 520px;
                }
                
                .calculator-card {
                    background: var(--card-bg);
                    border-radius: 20px;
                    padding: 2.5rem;
                    box-shadow: 0 15px 40px var(--shadow);
                    border: 1px solid rgba(253, 250, 247, 0.5);
                    color: var(--text);
                }
                
                .calculator-header {
                    margin-bottom: 1.8rem;
                }
                
                .calculator-title {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: var(--text);
                    margin: 0 0 0.5rem 0;
                    line-height: 1.3;
                }
                
                .calculator-subtitle {
                    font-size: 0.95rem;
                    color: var(--text-light);
                    line-height: 1.5;
                }
                
                .contact-subtitle {
                    font-size: 0.9rem;
                    color: var(--accent);
                    font-weight: 600;
                    margin-bottom: 1.8rem;
                    text-align: center;
                    padding: 1rem;
                    background: rgba(116, 172, 223, 0.1);
                    border-radius: 10px;
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
                    color: var(--text);
                }
                
                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                
                .icon {
                    position: absolute;
                    left: 1rem;
                    color: var(--text-light);
                    z-index: 2;
                }
                
                .form-input, .form-select {
                    width: 100%;
                    padding: 1rem 1rem 1rem 3rem;
                    border: 2px solid #e1e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    background: white;
                    color: var(--text);
                    height: 48px;
                }
                
                .form-input:focus, .form-select:focus {
                    outline: none;
                    border-color: var(--accent);
                    box-shadow: 0 0 0 3px rgba(116, 172, 223, 0.1);
                }
                
                .loading-spinner {
                    position: absolute;
                    right: 1rem;
                    width: 16px;
                    height: 16px;
                    border: 2px solid #e1e8f0;
                    border-top: 2px solid var(--accent);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .suggestions-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 2px solid var(--accent);
                    border-top: none;
                    border-radius: 0 0 12px 12px;
                    max-height: 220px;
                    overflow-y: auto;
                    z-index: 10;
                    box-shadow: 0 8px 25px var(--shadow);
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
                    background: var(--secondary);
                }
                
                .suggestion-text {
                    color: var(--text);
                    font-size: 0.95rem;
                }
                
                .features-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.2rem;
                }
                
                .feature-group {
                    display: flex;
                    flex-direction: column;
                }
                
                .feature-group .form-label {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                }
                
                /* Estilos para el selector de amenities mejorado */
                .amenities-selector {
                    width: 100%;
                    padding: 1rem 1rem 1rem 3rem;
                    border: 2px solid #e1e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    background: white;
                    color: var(--text);
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.3s ease;
                    height: 48px;
                }
                
                .amenities-selector:hover {
                    border-color: var(--accent);
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
                    background: var(--accent-light);
                    color: var(--accent);
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
                    border: 2px solid var(--accent);
                    border-radius: 12px;
                    margin-top: 0.5rem;
                    z-index: 20;
                    box-shadow: 0 10px 30px var(--shadow);
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
                    border-color: var(--accent);
                    background: #f8fbff;
                    transform: translateY(-1px);
                }
                
                .amenity-option.selected {
                    border-color: var(--accent);
                    background: var(--accent-light);
                    font-weight: 600;
                }
                
                .amenity-label {
                    flex: 1;
                    font-weight: 500;
                }
                
                .amenity-check {
                    color: var(--accent);
                    font-weight: bold;
                    font-size: 1.1rem;
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
                    background: var(--accent);
                    color: white;
                }
                
                .amenities-done:hover {
                    background: var(--accent-dark);
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
                    color: var(--text-light);
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
                }
                
                .btn-primary {
                    background: var(--gradient);
                    color: white;
                }
                
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(116, 172, 223, 0.4);
                }
                
                .btn-secondary {
                    background: var(--secondary);
                    color: var(--text);
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
                    color: #10B981;
                }
                
                .results-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: var(--accent);
                    margin: 0;
                    line-height: 1.3;
                }
                
                .results-subtitle {
                    font-size: 0.95rem;
                    color: var(--text-light);
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
                    box-shadow: 0 4px 12px var(--shadow);
                }
                
                .result-card.highlight {
                    border-color: var(--accent);
                    background: linear-gradient(135deg, #f8fbff 0%, #f0f7ff 100%);
                }
                
                .result-label {
                    font-size: 0.85rem;
                    color: var(--text-light);
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }
                
                .result-value {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: var(--text);
                }
                
                .results-cta {
                    margin-top: 2rem;
                }
                
                .success-message {
                    color: var(--text);
                    font-weight: 500;
                    font-size: 0.95rem;
                    margin: 0 0 1rem 0;
                    line-height: 1.5;
                }
                
                .email-notice {
                    color: var(--accent);
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
                    
                    .results-grid {
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
                    
                    .results-grid {
                        gap: 0.8rem;
                    }
                    
                    .result-card {
                        padding: 1.2rem;
                    }
                }
            `}</style>
        </section>
    );
}