"use client";

import React, { useState } from "react";

export default function LeadPopup() {
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = (document.getElementById("popup-lead-name") as HTMLInputElement).value;
        const email = (document.getElementById("popup-lead-email") as HTMLInputElement).value;
        const phone = (document.getElementById("popup-lead-phone") as HTMLInputElement).value;

        if (name && email && phone) {
            alert(`Gracias ${name}, tu reporte VIP será enviado a ${email}. Te contactaremos por WhatsApp en ${phone}.`);
            setIsOpen(false);
            (document.getElementById("popup-lead-form") as HTMLFormElement).reset();
        }
    };

    const closePopup = () => setIsOpen(false);

    return (
        <div id="lead-popup" style={{ display: isOpen ? "flex" : "none" }} onClick={closePopup}>
            <div
                className="popup-content"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <h3>¡Aumenta tus ingresos hoy!</h3>
                <p style={{ color: "var(--text-light)", marginBottom: "1.5rem" }}>
                    Déjanos tus datos y recibe un reporte personalizado.
                </p>
                <form id="popup-lead-form" onSubmit={handleSubmit}>
                    <input type="text" id="popup-lead-name" placeholder="Nombre y Apellido" required />
                    <input type="email" id="popup-lead-email" placeholder="Email profesional" required />
                    <input type="tel" id="popup-lead-phone" placeholder="Teléfono (WhatsApp)" required />
                    <button type="submit">Solicitar Reporte VIP</button>
                </form>
                <button onClick={closePopup} style={{ marginTop: "1rem", background: "none", color: "var(--accent)", border: "none", cursor: "pointer" }}>
                    Cerrar
                </button>
            </div>
        </div>
    );
}