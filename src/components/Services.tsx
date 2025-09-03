"use client";

import React from "react";

export default function Services() {
    return (
        <section className="section services-section" id="servicios">
            <h2 className="section-title">Tecnología que Domina el Mercado</h2>
            <div className="services-grid">
                <div className="service-card">
                    <h3 className="service-title">IA Predictiva de Precios</h3>
                    <p className="service-desc">Analiza 1,247 variables en tiempo real para optimizar ingresos, superando a la competencia por 47%.</p>
                </div>
                <div className="service-card">
                    <h3 className="service-title">Automatización Total 360°</h3>
                    <p className="service-desc">Check-in inteligente, IoT integrado, limpieza sincronizada y gestión predictiva.</p>
                </div>
                <div className="service-card">
                    <h3 className="service-title">Network Premium Nacional</h3>
                    <p className="service-desc">Red de 3,847 proveedores premium para mantenimiento y servicios VIP.</p>
                </div>
                <div className="service-card">
                    <h3 className="service-title">Analytics Empresariales</h3>
                    <p className="service-desc">Dashboards con forecasting y análisis competitivo para decisiones estratégicas.</p>
                </div>
                <div className="service-card">
                    <h3 className="service-title">Protección Legal Total</h3>
                    <p className="service-desc">Seguro premium, equipo legal y protocolos anti-fraude para tu inversión.</p>
                </div>
                <div className="service-card">
                    <h3 className="service-title">Marketing de Alto Impacto</h3>
                    <p className="service-desc">Campañas multi-canal, SEO premium y posicionamiento dominante.</p>
                </div>
            </div>
        </section>
    );
}