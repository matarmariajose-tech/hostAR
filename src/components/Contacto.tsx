"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ContactoPage() {
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "",
        propiedad: "",
        direccion: "",
        mensaje: ""
    });
    
    // Obtener parámetros de la URL
    const plan = searchParams.get('plan') || 'essential';
    const ciclo = searchParams.get('ciclo') || 'monthly';
    
    // Datos de planes
    const planInfo = {
        essential: { nombre: "ESSENTIAL", precio: ciclo === 'monthly' ? "12%" : "10%" },
        premium: { nombre: "PREMIUM", precio: ciclo === 'monthly' ? "20%" : "17%" }
    };
    
    const selectedPlan = planInfo[plan as keyof typeof planInfo] || planInfo.essential;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Aquí enviarías los datos a tu backend/email
        const dataToSend = {
            ...formData,
            plan: selectedPlan.nombre,
            ciclo,
            precio: selectedPlan.precio
        };
        
        console.log("Datos enviados:", dataToSend);
        
        // Ejemplo de envío a API
        // await fetch('/api/contacto', {
        //     method: 'POST',
        //     body: JSON.stringify(dataToSend)
        // });
        
        alert(`¡Gracias ${formData.nombre}! Te contactaremos pronto sobre el plan ${selectedPlan.nombre}.`);
        
        // Redirigir a home después de enviar
        // window.location.href = '/';
    };
    
    return (
        <div className="contacto-page">
            <div className="contacto-container">
                {/* Header */}
                <div className="contacto-header">
                    <h1>Comencemos a trabajar juntos</h1>
                    <p>Completá el formulario y nos pondremos en contacto en menos de 24 horas.</p>
                    
                    {/* Badge con plan seleccionado */}
                    <div className="plan-seleccionado">
                        <span className="plan-tag">Plan seleccionado:</span>
                        <div className="plan-info">
                            <span className="plan-nombre">{selectedPlan.nombre}</span>
                            <span className="plan-precio">{selectedPlan.precio}/mes</span>
                            <span className="plan-ciclo">({ciclo === 'monthly' ? 'Facturación mensual' : 'Facturación anual'})</span>
                        </div>
                    </div>
                </div>
                
                {/* Formulario */}
                <form onSubmit={handleSubmit} className="contacto-form">
                    <div className="form-grid">
                        {/* Columna 1 */}
                        <div className="form-column">
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre completo *</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    placeholder="Tu nombre"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="tu@email.com"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="telefono">Teléfono *</label>
                                <input
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                    placeholder="+54 11 1234-5678"
                                />
                            </div>
                        </div>
                        
                        {/* Columna 2 */}
                        <div className="form-column">
                            <div className="form-group">
                                <label htmlFor="propiedad">Tipo de propiedad *</label>
                                <select
                                    id="propiedad"
                                    name="propiedad"
                                    value={formData.propiedad}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccioná una opción</option>
                                    <option value="departamento">Departamento</option>
                                    <option value="casa">Casa</option>
                                    <option value="ph">PH</option>
                                    <option value="duplex">Dúplex</option>
                                    <option value="loft">Loft</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="direccion">Dirección de la propiedad</label>
                                <input
                                    type="text"
                                    id="direccion"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    placeholder="Av. Corrientes 1234, Palermo"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="mensaje">¿Algo más que quieras contarnos?</label>
                                <textarea
                                    id="mensaje"
                                    name="mensaje"
                                    value={formData.mensaje}
                                    onChange={handleChange}
                                    placeholder="Tengo 2 propiedades para gestionar, necesito asesoría premium..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Checkbox de términos */}
                    <div className="terms-checkbox">
                        <input type="checkbox" id="terms" required />
                        <label htmlFor="terms">
                            Acepto los <a href="/terminos">Términos y Condiciones</a> y la <a href="/privacidad">Política de Privacidad</a>
                        </label>
                    </div>
                    
                    {/* Botón de enviar */}
                    <button type="submit" className="submit-button">
                        Enviar solicitud
                    </button>
                    
                    <p className="form-footer">
                        Te contactaremos en menos de 24 horas para coordinar una reunión virtual.
                    </p>
                </form>
            </div>
            
            <style jsx>{`
                .contacto-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    padding: 2rem 1rem;
                }
                
                .contacto-container {
                    max-width: 1000px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 16px;
                    padding: 2.5rem;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
                }
                
                .contacto-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .contacto-header h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text);
                    margin-bottom: 0.75rem;
                }
                
                .contacto-header p {
                    color: var(--text-light);
                    font-size: 1rem;
                    max-width: 600px;
                    margin: 0 auto 1.5rem;
                }
                
                .plan-seleccionado {
                    display: inline-flex;
                    align-items: center;
                    gap: 1rem;
                    background: rgba(116, 172, 223, 0.1);
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
                    border: 1px solid rgba(116, 172, 223, 0.2);
                }
                
                .plan-tag {
                    font-weight: 600;
                    color: var(--text);
                    font-size: 0.9rem;
                }
                
                .plan-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .plan-nombre {
                    background: var(--accent);
                    color: white;
                    padding: 0.3rem 0.8rem;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 0.9rem;
                }
                
                .plan-precio {
                    font-weight: 700;
                    color: var(--accent);
                    font-size: 1.1rem;
                }
                
                .plan-ciclo {
                    font-size: 0.85rem;
                    color: var(--text-light);
                }
                
                .contacto-form {
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                
                @media (min-width: 768px) {
                    .form-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 2rem;
                    }
                }
                
                .form-column {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .form-group label {
                    font-weight: 600;
                    color: var(--text);
                    font-size: 0.95rem;
                }
                
                .form-group input,
                .form-group select,
                .form-group textarea {
                    padding: 0.75rem 1rem;
                    border: 1.5px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                }
                
                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: var(--accent);
                    box-shadow: 0 0 0 3px rgba(116, 172, 223, 0.1);
                }
                
                .form-group input::placeholder,
                .form-group textarea::placeholder {
                    color: #9ca3af;
                }
                
                .terms-checkbox {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin: 1.5rem 0;
                }
                
                .terms-checkbox input[type="checkbox"] {
                    width: 1.1rem;
                    height: 1.1rem;
                }
                
                .terms-checkbox label {
                    font-size: 0.9rem;
                    color: var(--text);
                }
                
                .terms-checkbox a {
                    color: var(--accent);
                    text-decoration: none;
                    font-weight: 500;
                }
                
                .terms-checkbox a:hover {
                    text-decoration: underline;
                }
                
                .submit-button {
                    width: 100%;
                    padding: 1rem;
                    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .submit-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(116, 172, 223, 0.3);
                }
                
                .form-footer {
                    text-align: center;
                    margin-top: 1rem;
                    color: var(--text-light);
                    font-size: 0.9rem;
                }
                
                @media (max-width: 640px) {
                    .contacto-container {
                        padding: 1.5rem;
                    }
                    
                    .contacto-header h1 {
                        font-size: 1.75rem;
                    }
                    
                    .plan-seleccionado {
                        flex-direction: column;
                        text-align: center;
                        gap: 0.5rem;
                        padding: 1rem;
                    }
                    
                    .plan-info {
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
}