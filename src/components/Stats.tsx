"use client";

import React from "react";

export default function PlatformLogosMarquee() {
    const platforms = [
        {
            name: "Tripadvisor",
            logo: "https://cdn.worldvectorlogo.com/logos/tripadvisor.svg",
            alt: "tripadvisor"
        },
        {
            name: "Locasun", 
            logo: "https://logo.clearbit.com/locasun.fr",
            alt: "locasun"
        },
        {
            name: "holidu",
            logo: "https://logo.clearbit.com/holidu.com",
            alt: "holidu"
        },
        {
            name: "Booking.com",
            logo: "https://cdn.worldvectorlogo.com/logos/bookingcom-1.svg",
            alt: "booking"
        },
        {
            name: "Airbnb",
            logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
            alt: "airbnb"
        },
        {
            name: "Mercado Libre",
            logo: "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png",
            alt: "mercado libre"
        },
        {
            name: "ZonaProp",
            logo: "https://logo.clearbit.com/zonaprop.com.ar",
            alt: "zonaprop"
        },
        {
            name: "Argenprop",
            logo: "https://logo.clearbit.com/argenprop.com",
            alt: "argenprop"
        }
    ];

    return (
        <div className="platforms-marquee">
            <div className="marquee-content">
                {platforms.map((platform, index) => (
                    <div key={`first-${index}`} className="logo-container">
                        <img
                            src={platform.logo}
                            alt={platform.alt}
                            className="platform-logo"
                            loading="lazy"
                            style={{ 
                                height: "45px", 
                                width: "auto", 
                                maxWidth: "160px",
                                objectFit: "contain" 
                            }}
                            onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.style.display = 'none';
                                if (img.parentElement) {
                                    img.parentElement.innerHTML = `<span class="platform-name-fallback">${platform.name}</span>`;
                                }
                            }}
                        />
                    </div>
                ))}
                
                {platforms.map((platform, index) => (
                    <div key={`second-${index}`} className="logo-container">
                        <img
                            src={platform.logo}
                            alt={platform.alt}
                            className="platform-logo"
                            loading="lazy"
                            style={{ 
                                height: "45px", 
                                width: "auto", 
                                maxWidth: "160px",
                                objectFit: "contain" 
                            }}
                            onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.style.display = 'none';
                                if (img.parentElement) {
                                    img.parentElement.innerHTML = `<span class="platform-name-fallback">${platform.name}</span>`;
                                }
                            }}
                        />
                    </div>
                ))}
            </div>

            <style jsx>{`
                .platforms-marquee {
                    width: 100%;
                    overflow: hidden;
                    position: relative;
                    background: transparent;
                    padding: 30px 0;
                }
                
                .marquee-content {
                    display: flex;
                    gap: 50px;
                    animation: marquee 30s linear infinite;
                    width: max-content;
                }
                
                .logo-container {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 15px;
                    min-width: 130px;
                    height: 70px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }
                
                .platform-logo {
                    filter: grayscale(100%);
                    opacity: 0.9;
                    transition: all 0.3s ease;
                }
                
                .logo-container:hover .platform-logo {
                    filter: grayscale(0%);
                    opacity: 1;
                    transform: scale(1.08);
                }
                
                .platform-name-fallback {
                    font-weight: 600;
                    color: #333;
                    font-size: 16px;
                    text-align: center;
                    padding: 12px 18px;
                    background: #f5f5f5;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    white-space: nowrap;
                }
                
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(calc(-50% - 25px));
                    }
                }
                
                .marquee-content:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}