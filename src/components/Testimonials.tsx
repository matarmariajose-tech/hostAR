"use client";

import React, { useEffect, useState } from "react";

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fadeState, setFadeState] = useState('fade-in');
    
    const testimonials = [
        {
            quote: "Confiar en HostAR fue todo un acierto. Antes nos comían las gestiones y siempre estábamos preocupados, pero desde que lo dejamos en sus manos vivimos mucho más tranquilos. Los ingresos subieron y lo mejor es que ellos se encargan de todo.",
            name: "Carlos M.",
            location: "Palermo"
        },
        {
            quote: "Desde el primer momento nos encajó su propuesta. No podemos estar más satisfechos, gracias a HostAR las reservas de la casa se duplicaron. Lo recomiendo al 100%.",
            name: "Laura S.",
            location: "Recoleta"
        },
        {
            quote: "Gestión impecable. Ocupación del 85% anual y yo sin preocuparme de nada. El trato es profesional y los huéspedes siempre han sido excelentes.",
            name: "Miguel R.",
            location: "San Telmo"
        },
        {
            quote: "Tengo más reservas que antes de trabajar con HostAR, y no tengo que preocuparme de problemas básicos. Sin duda el mejor servicio para estar despreocupado.",
            name: "Ana P.",
            location: "Belgrano"
        },
        {
            quote: "La mejor inversión que hice en mi propiedad. Ellos se ocupan de la limpieza, de recibir huéspedes y encima estoy ganando más. Un cambio total para bien.",
            name: "Roberto F.",
            location: "Caballito"
        },
        {
            quote: "Siempre que contactamos recibimos respuesta inmediata y un trato muy agradable. Por ahora estamos encantados y nuestra casa siempre llena.",
            name: "Valentina K.",
            location: "Núñez"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setFadeState('fade-out');
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % testimonials.length);
                setFadeState('fade-in');
            }, 400);
        }, 6000);

        return () => clearInterval(timer);
    }, [testimonials.length]);

    const goToSlide = (index: number) => {
        if (index !== currentIndex) {
            setFadeState('fade-out');
            setTimeout(() => {
                setCurrentIndex(index);
                setFadeState('fade-in');
            }, 400);
        }
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section className="testimonials-section" id="testimonios">
            {/* Header con estadística */}
            <div className="text-center mb-12 max-w-3xl mx-auto px-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-[var(--text)]">
                    Lo que dicen nuestros propietarios
                </h2>
                <p className="text-base md:text-lg text-[var(--text-light)] font-medium">
                    Más de 500 propietarios confían en nosotros para gestionar sus propiedades
                </p>
            </div>
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Card del testimonio */}
                <div className="relative min-h-[220px] flex items-center justify-center py-6">
                    <div 
                        className={`
                            w-full transition-all duration-500 ease-in-out
                            ${fadeState === 'fade-in' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
                        `}
                    >
                        <div className="bg-gradient-to-br from-white to-[var(--secondary)] p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100 relative">
                            {/* Estrellitas arriba */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-[var(--accent)]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            
                            {/* Testimonial Quote */}
                            <p className="text-base md:text-lg text-[var(--text)] mb-6 leading-relaxed italic">
                                "{currentTestimonial.quote}"
                            </p>
                            
                            {/* Author Info */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                                    {currentTestimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-[var(--text)] text-base">
                                        {currentTestimonial.name}
                                    </p>
                                    <p className="text-sm text-[var(--text-light)]">
                                        {currentTestimonial.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Indicadores de navegación */}
                <div className="flex justify-center gap-2 mt-6">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`
                                h-2 rounded-full transition-all duration-300
                                ${index === currentIndex 
                                    ? 'w-8 bg-[var(--accent)]' 
                                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                                }
                            `}
                            aria-label={`Ir al testimonio ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Rating final */}
                <div className="text-center mt-10 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-4xl font-bold text-[var(--text)]">4.8</span>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-6 h-6 text-[var(--accent)]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                    <p className="text-sm text-[var(--text-light)] font-medium">
                        Valoración media de nuestros clientes
                    </p>
                </div>
            </div>
        </section>
    );
}