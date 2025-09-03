"use client";

import React, { useState } from "react";

export default function Pricing() {
    const [activePlan, setActivePlan] = useState<string | null>(null);

    const activatePlan = (plan: string) => {
        setActivePlan(plan);
    };

    return (
        <section className="section pricing-section" id="tarifas">
            <h2 className="section-title pricing-title">Inversión en Excelencia</h2>
            <div className="pricing-grid">
                <div
                    className={`pricing-card ${activePlan === "essential" ? "active" : ""}`}
                    onClick={() => activatePlan("essential")}
                >
                    <h3 className="pricing-title">ESSENTIAL</h3>
                    <div className="pricing-price">12%</div>
                    <p style={{ color: "var(--text-light)", marginBottom: "2rem" }}>Para propietarios serios</p>
                    <ul className="pricing-features">
                        <li>IA de optimización de precios</li>
                        <li>Sincronización multi-plataforma</li>
                        <li>Check-in automatizado</li>
                        <li>Soporte premium 24/7</li>
                        <li>Reportes mensuales</li>
                    </ul>
                    <a href="#contacto" className="btn">Comenzar Ahora</a>
                </div>
                <div
                    className={`pricing-card featured ${activePlan === "professional" ? "active" : ""}`}
                    onClick={() => activatePlan("professional")}
                >
                    <h3 className="pricing-title">PROFESSIONAL</h3>
                    <div className="pricing-price">18%</div>
                    <p style={{ color: "var(--text-light)", marginBottom: "2rem" }}>Máximo rendimiento</p>
                    <ul className="pricing-features">
                        <li>Todo en Essential</li>
                        <li>Limpieza y mantenimiento premium</li>
                        <li>Marketing avanzado</li>
                        <li>Gestor personal</li>
                        <li>Optimización revenue</li>
                        <li>Análisis competitivo</li>
                    </ul>
                    <a href="#contacto" className="btn">Plan Más Popular</a>
                </div>
                <div
                    className={`pricing-card ${activePlan === "elite" ? "active" : ""}`}
                    onClick={() => activatePlan("elite")}
                >
                    <h3 className="pricing-title">ELITE</h3>
                    <div className="pricing-price">25%</div>
                    <p style={{ color: "var(--text-light)", marginBottom: "2rem" }}>Para portfolios premium</p>
                    <ul className="pricing-features">
                        <li>Todo en Professional</li>
                        <li>Concierge exclusivo</li>
                        <li>Marketing VIP</li>
                        <li>Priority listing</li>
                        <li>Reportes diarios</li>
                        <li>Consultoría mensual</li>
                    </ul>
                    <a href="#contacto" className="btn">Acceso Elite</a>
                </div>
            </div>
        </section>
    );
}