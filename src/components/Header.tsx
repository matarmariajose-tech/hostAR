"use client";

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const menuItems = [
    { label: 'Servicios', href: '#servicios' },
    { label: 'Tarifas', href: '#tarifas' },
    { label: 'Liderazgo', href: '#liderazgo' },
    { label: 'Testimonios', href: '#testimonios' },
    { label: 'Contacto', href: '#contacto' },
];

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-[#2D3748]/95 backdrop-blur-sm py-3 shadow-xl'
                    : 'bg-[#2D3748] py-5'
                    }`}
            >
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <a href="/" className="flex items-center space-x-1">
                            <span className="text-2xl sm:text-3xl font-black text-white">
                                Host
                            </span>
                            <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-[#74ACDF] to-[#AED6F1] bg-clip-text text-transparent">
                                AR
                            </span>
                        </a>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                            {menuItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="px-3 py-2 text-sm font-medium text-gray-200 hover:text-[#74ACDF] transition-colors duration-200 whitespace-nowrap"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-[#2D3748]/95 backdrop-blur-sm border-t border-white/10">
                        <div className="px-4 py-3 space-y-1">
                            {menuItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="block px-3 py-2 text-base font-medium text-gray-200 hover:text-[#74ACDF] hover:bg-white/5 rounded-lg transition"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setMobileMenuOpen(false);
                                        setTimeout(() => {
                                            document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                                        }, 100);
                                    }}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}