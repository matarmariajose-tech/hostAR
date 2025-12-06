"use client";

import React, { useState } from "react";

export default function Pricing() {
    const [activePlan, setActivePlan] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    const toggleBillingCycle = () => {
        setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly");
    };

    const pricingData = {
        essential: {
            monthly: "12%",
            yearly: "10%",
            discount: "16%",
            title: "ESSENTIAL",
            subtitle: "Para propietarios que inician",
            features: [
                "IA de optimización de precios",
                "Sincronización multi-plataforma",
                "Check-in automatizado",
                "Soporte premium 24/7",
                "Reportes mensuales",
                "Dashboard básico"
            ],
            cta: "Comenzar Ahora"
        },
        premium: {
            monthly: "20%",
            yearly: "17%",
            discount: "15%",
            title: "PREMIUM",
            subtitle: "Máxima rentabilidad",
            features: [
                "✅ Todo en Essential",
                "Limpieza y mantenimiento premium",
                "Marketing avanzado multi-canal",
                "Gestor personal asignado",
                "Optimización revenue avanzada",
                "Análisis competitivo",
                "Reportes semanales",
                "Consultoría trimestral"
            ],
            cta: "Plan Más Popular"
        }
    };

    return (
        <section className="pricing-section" id="tarifas">
            <h2 className="section-title pricing-title">Inversión en Excelencia</h2>
            
            {/* Toggle de facturación */}
            <div className="billing-toggle-container">
                <div className="billing-toggle">
                    <span className={`toggle-label ${billingCycle === "monthly" ? "active" : ""}`}>
                        Facturación mensual
                    </span>
                    <button 
                        className="toggle-switch"
                        onClick={toggleBillingCycle}
                        aria-label={`Cambiar a facturación ${billingCycle === "monthly" ? "anual" : "mensual"}`}
                    >
                        <div className={`toggle-slider ${billingCycle === "yearly" ? "yearly" : ""}`}></div>
                    </button>
                    <span className={`toggle-label ${billingCycle === "yearly" ? "active" : ""}`}>
                        Facturación anual 
                        <span className="discount-badge">Ahorrá {pricingData.essential.discount}</span>
                    </span>
                </div>
            </div>

            <div className="pricing-grid">
                {/* Plan ESSENTIAL */}
                <div
                    className={`pricing-card ${activePlan === "essential" ? "active" : ""}`}
                    onClick={() => setActivePlan("essential")}
                    onMouseLeave={() => setActivePlan(null)}
                >
                    <h3 className="plan-name">{pricingData.essential.title}</h3>
                    <div className="pricing-percentage">
                        {billingCycle === "monthly" ? pricingData.essential.monthly : pricingData.essential.yearly}
                    </div>
                    <p className="plan-subtitle">{pricingData.essential.subtitle}</p>
                    
                    {billingCycle === "yearly" && (
                        <div className="saving-badge essential-saving">
                            <span>✓ Ahorro aplicado</span>
                        </div>
                    )}
                    
                    <ul className="plan-features">
                        {pricingData.essential.features.map((feature, index) => (
                            <li key={index} className="plan-feature">
                                <span className="plan-feature-icon">✓</span>
                                <span className="plan-feature-text">{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <button className="plan-cta">{pricingData.essential.cta}</button>
                </div>

                {/* Plan PREMIUM */}
                <div
                    className={`pricing-card featured ${activePlan === "premium" ? "active" : ""}`}
                    onClick={() => setActivePlan("premium")}
                    onMouseLeave={() => setActivePlan(null)}
                >
                    <div className="plan-badge">MÁS POPULAR</div>
                    <h3 className="plan-name">{pricingData.premium.title}</h3>
                    <div className="pricing-percentage">
                        {billingCycle === "monthly" ? pricingData.premium.monthly : pricingData.premium.yearly}
                    </div>
                    <p className="plan-subtitle">{pricingData.premium.subtitle}</p>
                    
                    {billingCycle === "yearly" && (
                        <div className="saving-badge premium-saving">
                            <span>✓ Ahorro {pricingData.premium.discount}</span>
                        </div>
                    )}
                    
                    <ul className="plan-features">
                        {pricingData.premium.features.map((feature, index) => (
                            <li key={index} className="plan-feature">
                                <span className="plan-feature-icon">✓</span>
                                <span className="plan-feature-text">{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <button className="plan-cta featured-cta">{pricingData.premium.cta}</button>
                </div>
            </div>

            <style jsx>{`
                /* ============================================
                   PRICING SECTION - Estilos personalizados
                   ============================================ */
                
                .pricing-section {
                    padding: 2.5rem 1rem;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    position: relative;
                }

                .section-title {
                    text-align: center;
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    color: var(--text);
                }

                @media (min-width: 640px) {
                    .section-title {
                        font-size: 2.25rem;
                    }
                }

                @media (min-width: 1024px) {
                    .pricing-section {
                        padding: 3.5rem 1rem;
                    }
                    
                    .section-title {
                        font-size: 2.75rem;
                        margin-bottom: 1.25rem;
                    }
                }

                /* Toggle de facturación */
                .billing-toggle-container {
                    display: flex;
                    justify-content: center;
                    margin: 1.25rem auto 1.75rem;
                    max-width: 500px;
                    padding: 0 0.5rem;
                }
                
                .billing-toggle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.65rem;
                    background: white;
                    padding: 0.5rem 1rem;
                    border-radius: 50px;
                    box-shadow: 0 4px 15px rgba(116, 172, 223, 0.15);
                    border: 2px solid rgba(116, 172, 223, 0.1);
                    flex-wrap: wrap;
                }
                
                .toggle-label {
                    font-weight: 500;
                    color: var(--text-light);
                    transition: color 0.3s;
                    font-size: 0.8rem;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                
                .toggle-label.active {
                    color: var(--accent);
                    font-weight: 600;
                }
                
                .discount-badge {
                    background: linear-gradient(135deg, #74ACDF 0%, #4A90E2 100%);
                    color: white;
                    padding: 0.2rem 0.6rem;
                    border-radius: 20px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    white-space: nowrap;
                }
                
                .toggle-switch {
                    width: 44px;
                    height: 22px;
                    background: #e5e7eb;
                    border-radius: 50px;
                    border: none;
                    position: relative;
                    cursor: pointer;
                    transition: background 0.3s;
                    flex-shrink: 0;
                }
                
                .toggle-switch:hover {
                    background: #d1d5db;
                }
                
                .toggle-slider {
                    position: absolute;
                    width: 16px;
                    height: 16px;
                    background: white;
                    border-radius: 50%;
                    top: 3px;
                    left: 3px;
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .toggle-slider.yearly {
                    transform: translateX(22px);
                    background: linear-gradient(135deg, #74ACDF 0%, #4A90E2 100%);
                }
                
                /* Grid de precios */
                .pricing-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.25rem;
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0 0.5rem;
                }
                
                @media (min-width: 768px) {
                    .pricing-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 1.5rem;
                    }
                }
                
                @media (min-width: 1024px) {
                    .pricing-grid {
                        gap: 2rem;
                        padding: 0;
                    }
                }
                
                /* Cards de precios */
                .pricing-card {
                    background: white;
                    border-radius: 1.25rem;
                    padding: 1.5rem;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                    position: relative;
                    cursor: pointer;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .pricing-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 15px 35px rgba(116, 172, 223, 0.15);
                    border-color: rgba(116, 172, 223, 0.2);
                }
                
                .pricing-card.active {
                    border-color: var(--accent);
                    box-shadow: 0 15px 35px rgba(116, 172, 223, 0.2);
                }
                
                .pricing-card.featured {
                    border-color: var(--accent);
                    background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
                    box-shadow: 0 15px 35px rgba(116, 172, 223, 0.2);
                }
                
                .pricing-card.featured:hover {
                    box-shadow: 0 20px 45px rgba(116, 172, 223, 0.25);
                }
                
                .plan-badge {
                    position: absolute;
                    top: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, #74ACDF 0%, #4A90E2 100%);
                    color: white;
                    padding: 0.4rem 1.25rem;
                    border-radius: 20px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    white-space: nowrap;
                    box-shadow: 0 4px 12px rgba(116, 172, 223, 0.3);
                }
                
                .plan-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    color: var(--text);
                    text-align: center;
                }
                
                .pricing-percentage {
                    font-size: 2.75rem;
                    font-weight: 800;
                    margin: 0.75rem 0;
                    text-align: center;
                    background: linear-gradient(135deg, #74ACDF 0%, #4A90E2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .plan-subtitle {
                    color: var(--text-light);
                    text-align: center;
                    margin-bottom: 1.25rem;
                    font-size: 0.9rem;
                }
                
                /* Badges de ahorro */
                .saving-badge {
                    padding: 0.6rem;
                    border-radius: 0.65rem;
                    text-align: center;
                    margin-bottom: 1.25rem;
                    font-weight: 600;
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                
                .essential-saving {
                    background: rgba(116, 172, 223, 0.1);
                    color: var(--accent);
                    border: 1px solid rgba(116, 172, 223, 0.2);
                }
                
                .premium-saving {
                    background: rgba(74, 144, 226, 0.1);
                    color: var(--accent-dark);
                    border: 1px solid rgba(74, 144, 226, 0.2);
                }
                
                /* Lista de características */
                .plan-features {
                    list-style: none;
                    padding: 0;
                    margin: 1rem 0 1.5rem;
                    flex-grow: 1;
                }
                
                .plan-feature {
                    margin-bottom: 0.65rem;
                    display: flex;
                    align-items: flex-start;
                    gap: 0.65rem;
                    color: var(--text);
                }
                
                .plan-feature-icon {
                    color: var(--accent);
                    font-weight: bold;
                    font-size: 1rem;
                    flex-shrink: 0;
                    margin-top: 0.1rem;
                }
                
                .plan-feature-text {
                    font-size: 0.875rem;
                    line-height: 1.5;
                }
                
                /* Botones */
                .plan-cta {
                    width: 100%;
                    padding: 0.875rem;
                    background: var(--accent);
                    color: white;
                    border: none;
                    border-radius: 0.65rem;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: auto;
                    box-shadow: 0 4px 12px rgba(116, 172, 223, 0.3);
                }
                
                .plan-cta:hover {
                    background: var(--accent-dark);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(116, 172, 223, 0.4);
                }
                
                .featured-cta {
                    background: linear-gradient(135deg, #74ACDF 0%, #4A90E2 100%);
                    box-shadow: 0 4px 15px rgba(116, 172, 223, 0.4);
                }
                
                .featured-cta:hover {
                    background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
                    box-shadow: 0 6px 25px rgba(116, 172, 223, 0.5);
                }
                
                /* Responsive para pantallas muy pequeñas (iPhone 13 mini y similares) */
                @media (max-width: 375px) {
                    .pricing-section {
                        padding: 2rem 0.75rem;
                    }
                    
                    .section-title {
                        font-size: 1.5rem;
                        margin-bottom: 0.875rem;
                    }
                    
                    .billing-toggle-container {
                        margin: 1rem auto 1.5rem;
                    }
                    
                    .billing-toggle {
                        padding: 0.45rem 0.85rem;
                        gap: 0.5rem;
                    }
                    
                    .toggle-label {
                        font-size: 0.75rem;
                    }
                    
                    .discount-badge {
                        font-size: 0.65rem;
                        padding: 0.15rem 0.5rem;
                    }
                    
                    .toggle-switch {
                        width: 40px;
                        height: 20px;
                    }
                    
                    .toggle-slider {
                        width: 14px;
                        height: 14px;
                    }
                    
                    .toggle-slider.yearly {
                        transform: translateX(20px);
                    }
                    
                    .pricing-grid {
                        gap: 1rem;
                    }
                    
                    .pricing-card {
                        padding: 1.25rem;
                        border-radius: 1rem;
                    }
                    
                    .plan-badge {
                        font-size: 0.65rem;
                        padding: 0.35rem 1rem;
                        top: -8px;
                    }
                    
                    .plan-name {
                        font-size: 1.35rem;
                    }
                    
                    .pricing-percentage {
                        font-size: 2.5rem;
                        margin: 0.5rem 0;
                    }
                    
                    .plan-subtitle {
                        font-size: 0.85rem;
                        margin-bottom: 1rem;
                    }
                    
                    .saving-badge {
                        padding: 0.5rem;
                        font-size: 0.8rem;
                        margin-bottom: 1rem;
                    }
                    
                    .plan-features {
                        margin: 0.875rem 0 1.25rem;
                    }
                    
                    .plan-feature {
                        margin-bottom: 0.55rem;
                        gap: 0.55rem;
                    }
                    
                    .plan-feature-icon {
                        font-size: 0.95rem;
                    }
                    
                    .plan-feature-text {
                        font-size: 0.825rem;
                        line-height: 1.4;
                    }
                    
                    .plan-cta {
                        padding: 0.8rem;
                        font-size: 0.9rem;
                    }
                }
            `}</style>
        </section>
    );
}