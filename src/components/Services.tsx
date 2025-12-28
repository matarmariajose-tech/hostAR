"use client";

import React from "react";

export default function Services() {
    const services = [
       {
            title: "Optimización Dinámica de Revenue",
            description: "Algoritmos de pricing inteligente que analizan demanda en tiempo real, estacionalidad local y comportamiento del mercado argentino. Maximizá tus ingresos con ajustes automáticos de tarifas que se adaptan a eventos, feriados y tendencias de reserva.",
            highlight: "Hasta +47% de ingresos"
        },
        {
            title: "Gestión Operativa 100% Automatizada",
            description: "Check-in digital, coordinación inteligente de limpieza, comunicación automatizada con huéspedes y mantenimiento preventivo. Liberá tu tiempo mientras la tecnología gestiona cada detalle de la experiencia de tus huéspedes.",
            highlight: "Cero gestión manual"
        },
        {
            title: "Red de Proveedores Verificados",
            description: "Acceso inmediato a servicios de limpieza premium, mantenimiento técnico, amenities y más. Red curada de profesionales con respuesta rápida y estándares de calidad certificados en todo el país.",
            highlight: "Respuesta < 2 horas"
        },
        {
            title: "Dashboard de Análisis Avanzado",
            description: "Visualizá el rendimiento de tu propiedad con métricas clave: ocupación, ingresos, comparativas de mercado y proyecciones. Tomá decisiones basadas en datos reales del mercado argentino de alquileres temporarios.",
            highlight: "Insights accionables"
        },
        {
            title: "Protección Legal y Seguros",
            description: "Cobertura integral contra daños, asesoría legal especializada en alquileres temporarios y cumplimiento normativo. Protegé tu inversión con respaldo profesional ante cualquier eventualidad.",
            highlight: "Tranquilidad total"
        },
        {
            title: "Marketing Multi-Plataforma",
            description: "Presencia optimizada en Airbnb, Booking.com y plataformas locales. Fotografía profesional, descripciones que convierten y estrategias de posicionamiento que maximizan tu visibilidad y reservas.",
            highlight: "94-98% ocupación anual"
        }
    ];

    return (
        <div className="services-container" id="servicios" style={{ scrollMarginTop: '80px' }}>
            <div className="services-inner">
                <div className="services-header">
                <h2 className="services-main-title">Tecnología que Domina el Mercado</h2>
                <p className="services-subtitle">
                    Soluciones de vanguardia diseñadas para maximizar tus ingresos en el mercado argentino
                </p>
            </div>

            <div className="services-grid">
                {services.map((service, index) => (
                    <div key={index} className="service-item">
                        <div className="service-index">{index + 1}</div>
                        <div className="service-content">
                            <div className="service-highlight">{service.highlight}</div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                        </div>
                    </div>
                ))}
                </div>

            </div>
            <style jsx>{`
                .services-container {
                    max-width: 100%;
                    margin: 0 auto;
                    padding: 60px 20px;
                    background: var(--primary);
                }

                /* center content and limit text width for better responsiveness */
                .services-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 16px;
                }

                .services-header {
                    text-align: center;
                    margin-bottom: 50px;
                }

                .services-main-title {
                    /* responsive scaling */
                    font-size: clamp(1.5rem, 2.2vw + 0.5rem, 2.5rem);
                    font-weight: 700;
                    color: var(--text);
                    margin-bottom: 16px;
                    line-height: 1.2;
                }

                .services-subtitle {
                    font-size: clamp(0.95rem, 1.2vw + 0.1rem, 1.125rem);
                    color: var(--text-light);
                    max-width: 720px;
                    margin: 0 auto;
                    line-height: 1.6;
                }

                .services-grid {
                    display: grid;
                    /* allow more flexible layouts across breakpoints */
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 24px;
                }

                .service-item {
                    background: var(--card-bg);
                    border-radius: 12px;
                    padding: clamp(16px, 2vw, 28px);
                    border: 1px solid #e5e7eb;
                    position: relative;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 6px var(--shadow);
                }

                .service-item:hover {
                    transform: translateY(-4px);
                    border-color: var(--accent);
                    box-shadow: 0 12px 24px rgba(116, 172, 223, 0.15);
                }

                .service-index {
                    position: absolute;
                    top: clamp(8px, 1.2vw, 16px);
                    right: clamp(8px, 1.2vw, 16px);
                    font-size: clamp(1rem, 2.4vw, 2rem);
                    font-weight: 800;
                    color: rgba(116, 172, 223, 0.12);
                    user-select: none;
                    z-index: 1;
                    pointer-events: none;
                }

                .service-content {
                    position: relative;
                    z-index: 2;
                }

                .service-highlight {
                    display: inline-block;
                    background: linear-gradient(135deg, rgba(116, 172, 223, 0.1) 0%, rgba(74, 144, 226, 0.1) 100%);
                    color: var(--accent-dark);
                    font-size: clamp(0.75rem, 1.2vw, 0.875rem);
                    font-weight: 600;
                    padding: 6px 12px;
                    border-radius: 20px;
                    margin-bottom: 16px;
                    border: 1px solid rgba(116, 172, 223, 0.2);
                }

                .service-title {
                    font-size: clamp(1.05rem, 1.6vw + 0.5rem, 1.25rem);
                    font-weight: 600;
                    color: var(--text);
                    margin-bottom: 12px;
                    line-height: 1.3;
                    word-break: break-word;
                }

                .service-description {
                    font-size: clamp(0.9rem, 1.2vw, 1rem);
                    color: var(--text-light);
                    line-height: 1.5;
                    margin: 0;
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .services-container {
                        padding: 50px 20px;
                    }

                    .services-main-title {
                        /* clamp handles scaling, keep a max reduction for mid screens */
                        font-size: clamp(1.5rem, 2vw + 0.5rem, 2rem);
                    }
                }

                @media (max-width: 768px) {
                    .services-container {
                        padding: 40px 16px;
                    }

                    .services-main-title {
                        font-size: clamp(1.25rem, 2vw + 0.2rem, 1.75rem);
                    }

                    .services-subtitle {
                        font-size: clamp(0.9rem, 1.1vw + 0.1rem, 1rem);
                    }

                    .services-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }

                    .service-item {
                        padding: 18px;
                    }

                    .service-title {
                        font-size: clamp(1rem, 1.6vw, 1.125rem);
                    }

                    .service-description {
                        font-size: 0.95rem;
                    }
                }

                @media (max-width: 480px) {
                    .services-main-title {
                        font-size: 1.5rem;
                    }

                    .services-subtitle {
                        font-size: 0.9375rem;
                    }

                    .service-item {
                        padding: 14px;
                    }

                    /* hide index on very small screens to avoid overlap */
                    .service-index {
                        display: none;
                    }

                    .service-highlight {
                        font-size: 0.8125rem;
                        padding: 4px 10px;
                    }
                }

                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    .services-container {
                        background: #1f2937;
                    }

                    .services-main-title {
                        color: #f9fafb;
                    }

                    .services-subtitle {
                        color: #9ca3af;
                    }

                    .service-item {
                        background: #2d3748;
                        border-color: #4a5568;
                    }

                    .service-title {
                        color: #f9fafb;
                    }

                    .service-description {
                        color: #cbd5e0;
                    }

                    .service-highlight {
                        background: rgba(116, 172, 223, 0.2);
                        color: #93c5fd;
                        border-color: rgba(116, 172, 223, 0.3);
                    }

                    .service-index {
                        color: rgba(116, 172, 223, 0.2);
                    }

                    .service-item:hover {
                        border-color: var(--accent);
                        box-shadow: 0 12px 24px rgba(116, 172, 223, 0.25);
                    }
                }
            `}</style>
        </div>
    );
}