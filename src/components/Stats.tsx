"use client";

import React, { useEffect } from "react";
import { initAnimations } from "../utils/animations";

export default function Stats() {
    useEffect(() => {
        initAnimations();
    }, []);

    return (
        <section className="section stats-section" id="liderazgo">
            <h2 className="section-title">Números que nos Posicionan como #1</h2>
            <div className="stats-grid">
                <div className="stat-card stat-animate">
                    <span className="stat-number" data-target="84000000">$0</span>
                    <div className="stat-label">Facturación Generada</div>
                    <div className="stat-desc">Para propietarios en 2024</div>
                </div>
                <div className="stat-card stat-animate">
                    <span className="stat-number" data-target="23">0</span>
                    <div className="stat-label">Provincias Argentinas</div>
                    <div className="stat-desc">Cobertura nacional</div>
                </div>
                <div className="stat-card stat-animate">
                    <span className="stat-number" data-target="54000">0</span>
                    <div className="stat-label">Huéspedes Atendidos</div>
                    <div className="stat-desc">Experiencias premium</div>
                </div>
                <div className="stat-card stat-animate">
                    <span className="stat-number" data-target="23">0seg</span>
                    <div className="stat-label">Tiempo Respuesta IA</div>
                    <div className="stat-desc">Automatización instantánea</div>
                </div>
            </div>
        </section>
    );
}