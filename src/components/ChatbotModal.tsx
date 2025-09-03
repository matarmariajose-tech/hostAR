"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChatbot } from "../hooks/useChatbot";

export default function ChatbotModal() {
    const { messages, input, setInput, sendMessage } = useChatbot();
    const chatMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div id="chatbot-modal" style={{ display: messages.length > 0 ? "block" : "none" }}>
            <div id="chat-messages" ref={chatMessagesRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.startsWith("Tú:") ? "user" : ""}`}>
                        <p>{msg}</p>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    id="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe tu consulta..."
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
        </div>
    );
}