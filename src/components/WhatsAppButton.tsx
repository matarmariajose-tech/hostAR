"use client";

import React from "react";

export default function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/541112345678"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
        >
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
            />
            Contáctanos
        </a>
    );
}