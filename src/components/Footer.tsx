export default function Footer() {
    return (
        <footer className="bg-[#2D3748] text-white py-12 sm:py-14 lg:py-18" id="contacto">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <div className="text-3xl sm:text-4xl font-black text-white mb-4 sm:mb-6">
                            Host<span className="bg-gradient-to-r from-[#74ACDF] to-[#AED6F1] bg-clip-text text-transparent">AR</span>
                        </div>
                        <p className="text-[rgba(255,255,255,0.8)] leading-relaxed mb-6 text-sm sm:text-base">
                            Gestión premium de alquileres con tecnología avanzada y enfoque en maximizar tus ingresos en toda Argentina.
                        </p>
                        <div className="flex gap-4">
                            {['Facebook', 'Instagram', 'LinkedIn'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    aria-label={social}
                                    className="w-10 h-10 rounded-full bg-[rgba(116,172,223,0.2)] flex items-center justify-center hover:bg-[#74ACDF] transition-colors duration-300"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        {social === 'Facebook' && <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />}
                                        {social === 'Instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />}
                                        {social === 'LinkedIn' && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Enlaces Rápidos</h3>
                        <div className="space-y-2 sm:space-y-3">
                            {['servicios', 'tarifas', 'liderazgo', 'testimonios'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item}`}
                                    className="block text-[rgba(255,255,255,0.7)] hover:text-[#74ACDF] transition-colors duration-300 text-sm sm:text-base"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.querySelector(`#${item}`)?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Contacto</h3>
                        <div className="space-y-2 sm:space-y-3">
                            <a href="mailto:info@hostar.com" className="block text-[rgba(255,255,255,0.7)] hover:text-[#74ACDF] transition-colors duration-300 text-sm sm:text-base">
                                info@hostar.com
                            </a>
                            <a href="tel:+541112345678" className="block text-[rgba(255,255,255,0.7)] hover:text-[#74ACDF] transition-colors duration-300 text-sm sm:text-base">
                                +54 11 1234-5678
                            </a>
                            <p className="text-[rgba(255,255,255,0.7)] text-sm sm:text-base">
                                Buenos Aires, Argentina
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Newsletter</h3>
                        <p className="text-[rgba(255,255,255,0.7)] mb-4 text-sm sm:text-base">
                            Recibe las últimas novedades y ofertas especiales.
                        </p>
                        <form
                            className="flex flex-col sm:flex-row gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                alert('¡Gracias por suscribirte!');
                            }}
                        >
                            <input
                                type="email"
                                placeholder="Tu email"
                                className="flex-1 px-4 py-2 sm:py-3 rounded-full sm:rounded-l-full sm:rounded-r-none bg-[rgba(255,255,255,0.1)] text-white placeholder-[rgba(255,255,255,0.6)] border border-[rgba(255,255,255,0.2)] focus:outline-none focus:border-[#74ACDF] transition-colors text-sm sm:text-base"
                                required
                            />
                            <button
                                type="submit"
                                className="px-5 py-2 sm:py-3 rounded-full sm:rounded-l-none sm:rounded-r-full bg-gradient-to-r from-[#74ACDF] to-[#AED6F1] text-white font-semibold hover:shadow-lg transition-all duration-300 text-sm sm:text-base whitespace-nowrap"
                            >
                                Suscribir
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-[rgba(255,255,255,0.2)] pt-6 sm:pt-8 text-center">
                    <p className="text-[rgba(255,255,255,0.6)] text-xs sm:text-sm">
                        © 2025 HostAR. Todos los derechos reservados. |
                        <a href="#" className="hover:text-[#74ACDF] transition-colors ml-2">Términos y Condiciones</a> |
                        <a href="#" className="hover:text-[#74ACDF] transition-colors ml-2">Política de Privacidad</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}