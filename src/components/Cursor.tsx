"use client";

import React, { useEffect } from "react";

export default function Cursor() {
    useEffect(() => {
        const cursor = document.querySelector(".cursor") as HTMLDivElement;
        const handleMouseMove = (e: MouseEvent) => {
            if (cursor) {
                cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }
        };

        const handleMouseEnter = () => cursor?.classList.add("grow");
        const handleMouseLeave = () => cursor?.classList.remove("grow");

        document.addEventListener("mousemove", handleMouseMove);
        document.querySelectorAll("a, button, input").forEach((el) => {
            el.addEventListener("mouseenter", handleMouseEnter);
            el.addEventListener("mouseleave", handleMouseLeave);
        });

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.querySelectorAll("a, button, input").forEach((el) => {
                el.removeEventListener("mouseenter", handleMouseEnter);
                el.removeEventListener("mouseleave", handleMouseLeave);
            });
        };
    }, []);

    return <div className="cursor"></div>;
}