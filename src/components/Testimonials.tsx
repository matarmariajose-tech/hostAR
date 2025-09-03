"use client";

import React, { useEffect } from "react";

export default function Testimonials() {
    useEffect(() => {
        const testimonialsGrid = document.querySelector(".testimonials-grid") as HTMLElement;
        if (testimonialsGrid) {
            const duplicate = testimonialsGrid.cloneNode(true) as HTMLElement;
            testimonialsGrid.parentElement?.appendChild(duplicate);

            const animate = () => {
                let position = 0;
                const interval = setInterval(() => {
                    position -= 1;
                    testimonialsGrid.style.transform = `translateX(${position}px)`;
                    if (position <= -testimonialsGrid.offsetWidth / 2) position = 0;
                }, 20);

                return () => clearInterval(interval);
            };

            animate();
        }
    }, []);

    return (
        <section className="section testimonials-section" id="testimonios">
            <h2 className="section-title">Qué dicen nuestros clientes</h2>
            <div className="testimonials-carousel">
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="testimonial-icon">👤</div>
                        <div className="testimonial-stars">★★★★★</div>
                        <p className="text-var(--text-light) italic">
                            "Transformó mi propiedad en un negocio rentable sin esfuerzo."
                        </p>
                        <p className="font-semibold">- Carlos M., Palermo</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-icon">👤</div>
                        <div className="testimonial-stars">★★★★★</div>
                        <p className="text-var(--text-light) italic">"Gestión automática que me libera tiempo."</p>
                        <p className="font-semibold">- Laura S., Recoleta</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-icon">👤</div>
                        <div className="testimonial-stars">★★★★★</div>
                        <p className="text-var(--text-light) italic">"Resultados impecables y superiores."</p>
                        <p className="font-semibold">- Miguel R., San Telmo</p>
                    </div>
                    {/* Duplicate for seamless loop */}
                    <div className="testimonial-card">
                        <div className="testimonial-icon">👤</div>
                        <div className="testimonial-stars">★★★★★</div>
                        <p className="text-var(--text-light) italic">
                            "Transformó mi propiedad en un negocio rentable sin esfuerzo."
                        </p>
                        <p className="font-semibold">- Carlos M., Palermo</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-icon">👤</div>
                        <div className="testimonial-stars">★★★★★</div>
                        <p className="text-var(--text-light) italic">"Gestión automática que me libera tiempo."</p>
                        <p className="font-semibold">- Laura S., Recoleta</p>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-icon">👤</div>
                        <div className="testimonial-stars">★★★★★</div>
                        <p className="text-var(--text-light) italic">"Resultados impecables y superiores."</p>
                        <p className="font-semibold">- Miguel R., San Telmo</p>
                    </div>
                </div>
            </div>
        </section>
    );
}