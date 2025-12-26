"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, ExternalLink, TrendingUp, Calendar, Home } from "lucide-react";

export default function TestimonialsImproved() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState("fade-in");
  const [filter, setFilter] = useState("todos");

  const testimonials = [
    {
      quote: "Confiar en HostAR fue todo un acierto. Antes nos comían las gestiones y siempre estábamos preocupados, pero desde que lo dejamos en sus manos vivimos mucho más tranquilos. Los ingresos subieron y lo mejor es que ellos se encargan de todo.",
      name: "Carlos Martínez",
      location: "Palermo",
      propertyType: "Departamento 2 amb",
      photo: "https://ui-avatars.com/api/?name=Carlos+Martinez&background=74ACDF&color=fff&size=120",
      verified: true,
      airbnbProfile: "https://www.airbnb.com.ar/users/show/123456789",
      metrics: { increase: "+42%", occupation: "89%", monthsWith: "14 meses" },
      date: "Diciembre 2025",
      tag: "premium",
    },
    {
      quote: "Desde el primer momento nos encajó su propuesta. No podemos estar más satisfechos, gracias a HostAR las reservas de la casa se duplicaron. Lo recomiendo al 100%.",
      name: "Laura Sánchez",
      location: "Recoleta",
      propertyType: "Casa 4 amb",
      photo: "https://ui-avatars.com/api/?name=Laura+Sanchez&background=74ACDF&color=fff&size=120",
      verified: true,
      airbnbProfile: "https://www.airbnb.com.ar/users/show/987654321",
      metrics: { increase: "+103%", occupation: "92%", monthsWith: "8 meses" },
      date: "Noviembre 2025",
      tag: "premium",
    },
    {
      quote: "Gestión impecable. Ocupación del 85% anual y yo sin preocuparme de nada. El trato es profesional y los huéspedes siempre han sido excelentes.",
      name: "Miguel Rodríguez",
      location: "San Telmo",
      propertyType: "Loft 1 amb",
      photo: "https://ui-avatars.com/api/?name=Miguel+Rodriguez&background=74ACDF&color=fff&size=120",
      verified: true,
      bookingProfile: "https://www.booking.com/hotel/ar/loft-san-telmo.html",
      metrics: { increase: "+38%", occupation: "85%", monthsWith: "22 meses" },
      date: "Octubre 2025",
      tag: "essential",
    },
    {
      quote: "Tengo más reservas que antes de trabajar con HostAR, y no tengo que preocuparme de problemas básicos. Sin duda el mejor servicio para estar despreocupado.",
      name: "Ana Paula Gómez",
      location: "Belgrano",
      propertyType: "Departamento 3 amb",
      photo: "https://ui-avatars.com/api/?name=Ana+Paula&background=74ACDF&color=fff&size=120",
      verified: true,
      airbnbProfile: "https://www.airbnb.com.ar/users/show/456789123",
      metrics: { increase: "+55%", occupation: "91%", monthsWith: "11 meses" },
      date: "Septiembre 2025",
      tag: "premium",
    },
    {
      quote: "La mejor inversión que hice en mi propiedad. Ellos se ocupan de la limpieza, de recibir huéspedes y encima estoy ganando más. Un cambio total para bien.",
      name: "Roberto Fernández",
      location: "Caballito",
      propertyType: "Departamento 2 amb",
      photo: "https://ui-avatars.com/api/?name=Roberto+Fernandez&background=74ACDF&color=fff&size=120",
      verified: true,
      metrics: { increase: "+47%", occupation: "87%", monthsWith: "16 meses" },
      date: "Agosto 2025",
      tag: "essential",
    },
    {
      quote: "Siempre que contactamos recibimos respuesta inmediata y un trato muy agradable. Por ahora estamos encantados y nuestra casa siempre llena.",
      name: "Valentina Kovacs",
      location: "Núñez",
      propertyType: "Casa 3 amb",
      photo: "https://ui-avatars.com/api/?name=Valentina+Kovacs&background=74ACDF&color=fff&size=120",
      verified: true,
      airbnbProfile: "https://www.airbnb.com.ar/users/show/789123456",
      metrics: { increase: "+61%", occupation: "94%", monthsWith: "9 meses" },
      date: "Julio 2025",
      tag: "premium",
    },
  ];

  const filteredTestimonials = filter === "todos" ? testimonials : testimonials.filter((t) => t.tag === filter);

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeState("fade-out");
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
        setFadeState("fade-in");
      }, 400);
    }, 8000);
    return () => clearInterval(timer);
  }, [filteredTestimonials.length]);

  const goToSlide = (index: number) => {
    if (index !== currentIndex) {
      setFadeState("fade-out");
      setTimeout(() => {
        setCurrentIndex(index);
        setFadeState("fade-in");
      }, 400);
    }
  };

  const currentTestimonial = filteredTestimonials[currentIndex];

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HostAR",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "247", "bestRating": "5" },
    "review": testimonials.map((t) => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": t.name },
      "datePublished": t.date,
      "reviewBody": t.quote,
      "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />

      <section className="testimonials-section" id="testimonios">
        <div className="max-w-7xl mx-auto">
          <div className="section-header">
            <div className="hero-badge">
              <CheckCircle className="w-4 h-4" />
              Testimonios Verificados
            </div>
            <h2 className="testimonials-title">Lo que dicen nuestros propietarios</h2>
            <p className="section-subtitle">
              Más de 500 propietarios confían en nosotros. Todos los testimonios son verificados y están vinculados a perfiles reales.
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            <button
              onClick={() => setFilter("todos")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === "todos"
                  ? "bg-[var(--accent)] text-white shadow-lg"
                  : "bg-white text-[var(--text)] border-2 border-gray-300 hover:border-[var(--accent)]"
              }`}
            >
              Todos ({testimonials.length})
            </button>
            <button
              onClick={() => setFilter("premium")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === "premium"
                  ? "bg-[var(--accent)] text-white shadow-lg"
                  : "bg-white text-[var(--text)] border-2 border-gray-300 hover:border-[var(--accent)]"
              }`}
            >
              Plan Premium ({testimonials.filter((t) => t.tag === "premium").length})
            </button>
            <button
              onClick={() => setFilter("essential")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === "essential"
                  ? "bg-[var(--accent)] text-white shadow-lg"
                  : "bg-white text-[var(--text)] border-2 border-gray-300 hover:border-[var(--accent)]"
              }`}
            >
              Plan Essential ({testimonials.filter((t) => t.tag === "essential").length})
            </button>
          </div>

          <div className="max-w-5xl mx-auto mb-16">
            <div className="relative min-h-[480px] flex items-center justify-center">
              <div
                className={`w-full transition-all duration-500 ease-in-out ${
                  fadeState === "fade-in" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="grid md:grid-cols-5 gap-0">
                    <div className="md:col-span-2 bg-gradient-to-br from-[var(--secondary)] to-white p-10 flex flex-col items-center justify-center text-center border-r border-gray-100">
                      <div className="relative mb-6">
                        <img
                          src={currentTestimonial.photo}
                          alt={currentTestimonial.name}
                          className="w-28 h-28 rounded-full border-4 border-white shadow-xl"
                        />
                        {currentTestimonial.verified && (
                          <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-[var(--text)]">{currentTestimonial.name}</h3>
                      <div className="flex items-center gap-2 text-[var(--text-light)] mb-3">
                        <Home className="w-5 h-5" />
                        {currentTestimonial.location}
                      </div>
                      <p className="text-[var(--text-light)] mb-6">{currentTestimonial.propertyType}</p>

                      <span
                        className={`px-5 py-2 rounded-full text-sm font-bold mb-6 ${
                          currentTestimonial.tag === "premium"
                            ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] text-white"
                            : "bg-gray-200 text-[var(--text)]"
                        }`}
                      >
                        Plan {currentTestimonial.tag === "premium" ? "Premium" : "Essential"}
                      </span>

                      {(currentTestimonial.airbnbProfile || currentTestimonial.bookingProfile) && (
                        <a
                          href={currentTestimonial.airbnbProfile || currentTestimonial.bookingProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-dark)] font-semibold transition-colors"
                        >
                          Ver perfil verificado
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <div className="md:col-span-3 p-10 md:p-12">
                      <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      <p className="text-xl leading-relaxed italic text-[var(--text)] mb-8">
                        "{currentTestimonial.quote}"
                      </p>

                      <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <TrendingUp className="w-6 h-6 text-[var(--accent)]" />
                            <span className="text-3xl font-bold gradient-text">{currentTestimonial.metrics.increase}</span>
                          </div>
                          <p className="text-[var(--text-light)] font-medium">Aumento de ingresos</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-[var(--accent)] mb-2">{currentTestimonial.metrics.occupation}</div>
                          <p className="text-[var(--text-light)] font-medium">Ocupación promedio</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Calendar className="w-6 h-6 text-[var(--text-light)]" />
                            <span className="text-3xl font-bold text-[var(--text)]">{currentTestimonial.metrics.monthsWith}</span>
                          </div>
                          <p className="text-[var(--text-light)] font-medium">Con HostAR</p>
                        </div>
                      </div>

                      <p className="text-sm text-[var(--text-light)] mt-6">Testimonio de {currentTestimonial.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots de navegación */}
            <div className="flex justify-center gap-3 mt-10">
              {filteredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-12 bg-[var(--accent)]" : "w-3 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-5xl mx-auto py-12 border-t border-gray-200">
            <div className="text-center">
              <div className="text-5xl font-bold gradient-text mb-3">4.8</div>
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[var(--text-light)]">Valoración media</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[var(--text)] mb-3">247</div>
              <p className="text-[var(--text-light)]">Reseñas verificadas</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[var(--text)] mb-3">+500</div>
              <p className="text-[var(--text-light)]">Propietarios activos</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold gradient-text mb-3">+47%</div>
              <p className="text-[var(--text-light)]">Aumento promedio</p>
            </div>
          </div>

          <div className="mt-20 bg-gradient-to-br from-[var(--secondary)] to-white rounded-3xl p-12 text-center border border-gray-100 shadow-xl">
            <h3 className="text-3xl font-bold text-[var(--text)] mb-4">¿Ya sos cliente de HostAR?</h3>
            <p className="text-[var(--text-light)] text-lg mb-8 max-w-3xl mx-auto">
              Tu opinión nos ayuda a mejorar y a que más propietarios confíen en nosotros. Compartí tu experiencia y obtené un beneficio exclusivo.
            </p>
            <button className="bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              Compartir Mi Experiencia
            </button>
          </div>

          <div className="mt-16 flex flex-wrap justify-center items-center gap-10 opacity-70">
            <img src="https://cdn.worldvectorlogo.com/logos/tripadvisor.svg" alt="TripAdvisor" className="h-10" />
            <img src="https://cdn.worldvectorlogo.com/logos/bookingcom-1.svg" alt="Booking" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" alt="Airbnb" className="h-10" />
          </div>
        </div>
      </section>
    </>
  );
}