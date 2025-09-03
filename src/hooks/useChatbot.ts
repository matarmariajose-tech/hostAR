import { useState, useEffect } from "react";

export function useChatbot() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        setMessages(["¡Hola! ¿En qué puedo ayudarte hoy?"]);
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            setMessages((prev) => [...prev, `Tú: ${input}`]);
            setInput("");
            setTimeout(() => {
                const response = input.toLowerCase() === "hola" ? "¡Hola! ¿En qué puedo ayudarte?" : "Gracias por tu consulta. Nuestro equipo te responderá pronto.";
                setMessages((prev) => [...prev, `HostAR Bot: ${response}`]);
            }, 1000);
        }
    };

    return { messages, input, setInput, sendMessage };
}