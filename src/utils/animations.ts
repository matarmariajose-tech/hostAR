import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const initAnimations = () => {
    // Animate hero title
    gsap.from(".hero-title", { y: 80, opacity: 0, duration: 1.2, ease: "power3.out" });

    // Safely handle the array of elements
    const elements = gsap.utils.toArray(".service-card, .stat-card, .pricing-card, .testimonial-card") as HTMLElement[];
    if (elements.length > 0) {
        elements.forEach((el: HTMLElement, i: number) => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.1,
                ease: "power3.out",
            });
        });
    }
};