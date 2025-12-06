"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChatbot } from "../hooks/useChatbot";

export default function ChatbotModal() {
    const {
        messages,
        input,
        setInput,
        sendMessage,
        isFormActive,
        formData,
        handleFormChange,
        handleFormSubmit,
        isSubmitting,
        submitStatus,
        activateForm,
        resetChat,
        setIsFormActive
    } = useChatbot();

    const [isMinimized, setIsMinimized] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const chatMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatMessagesRef.current && isOpen) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSendMessage = () => {
        if (input.trim()) {
            sendMessage();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleClose = () => {
        resetChat();
        setIsOpen(false);
        setHasInteracted(true);
    };

    const handleOpen = () => {
        setIsOpen(true);
        setHasInteracted(true);
    };

    if (!isOpen && !hasInteracted) {
        return (
            <div style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999
            }}>
                <button
                    onClick={handleOpen}
                    style={{
                        background: 'linear-gradient(135deg, #74ACDF 0%, #4A90E2 100%)',
                        color: 'white',
                        padding: '16px',
                        borderRadius: '50%',
                        boxShadow: '0 8px 25px rgba(116, 172, 223, 0.4)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: 'scale(1)',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 12px 35px rgba(116, 172, 223, 0.6)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(116, 172, 223, 0.4)';
                    }}
                    title="Abrir chat de HostAR"
                >
                    <span style={{ fontSize: '24px' }}>💬</span>
                </button>
            </div>
        );
    }

    if (isMinimized) {
        return (
            <div style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999
            }}>
                <div
                    style={{
                        background: '#2C3E50',
                        color: 'white',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        minWidth: '220px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                    onClick={() => setIsMinimized(false)}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.3)';
                        e.currentTarget.style.background = '#34495E';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                        e.currentTarget.style.background = '#2C3E50';
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span style={{ fontSize: '16px' }}>💬</span>
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', fontSize: '14px' }}>Chat HostAR</div>
                                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>Haz clic para abrir</div>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClose();
                            }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: 'none',
                                color: 'white',
                                fontSize: '16px',
                                cursor: 'pointer',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                transition: 'background 0.2s ease',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            }}
                        >
                            ×
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            width: '380px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
            animation: isOpen ? 'fadeInUp 0.3s ease-out' : 'none'
        }}>
            <div style={{
                background: '#2C3E50',
                color: 'white',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <span style={{ fontSize: '18px' }}>💬</span>
                    </div>
                    <div>
                        <h3 style={{
                            margin: 0,
                            fontSize: '15px',
                            fontWeight: '600',
                            lineHeight: '1.2'
                        }}>
                            Asistente HostAR
                        </h3>
                        <p style={{
                            margin: 0,
                            fontSize: '11px',
                            opacity: 0.8,
                            lineHeight: '1.2',
                            marginTop: '2px'
                        }}>
                            En línea • Te ayuda al instante
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                        onClick={() => setIsMinimized(true)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            transition: 'background 0.2s ease',
                            minWidth: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                        title="Minimizar"
                    >
                        _
                    </button>
                    <button
                        onClick={handleClose}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            transition: 'background 0.2s ease',
                            minWidth: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                        title="Cerrar"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div
                ref={chatMessagesRef}
                style={{
                    height: '320px',
                    overflowY: 'auto',
                    padding: '20px',
                    background: '#F9FAFB'
                }}
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            marginBottom: '16px',
                            textAlign: msg.startsWith("Tú:") ? 'right' : 'left'
                        }}
                    >
                        <div
                            style={{
                                display: 'inline-block',
                                padding: '12px 16px',
                                maxWidth: '85%',
                                background: msg.startsWith("Tú:")
                                    ? '#2C3E50'
                                    : 'white',
                                color: msg.startsWith("Tú:") ? 'white' : '#1F2937',
                                border: msg.startsWith("Tú:") ? 'none' : '1px solid #E5E7EB',
                                borderRadius: msg.startsWith("Tú:") ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            <p style={{
                                margin: 0,
                                fontSize: '14px',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-line'
                            }}>
                                {msg.replace("Tú: ", "").replace("HostAR Bot: ", "")}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {isFormActive && submitStatus === 'idle' && (
                <div style={{
                    padding: '20px',
                    borderTop: '1px solid #E5E7EB',
                    background: 'white'
                }}>
                    <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleFormChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #D1D5DB',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'all 0.2s ease',
                                background: '#F9FAFB'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#2C3E50';
                                e.target.style.boxShadow = '0 0 0 3px rgba(44, 62, 80, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#D1D5DB';
                                e.target.style.boxShadow = 'none';
                            }}
                            placeholder="Tu nombre completo *"
                        />

                        <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleFormChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #D1D5DB',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'all 0.2s ease',
                                background: '#F9FAFB'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#2C3E50';
                                e.target.style.boxShadow = '0 0 0 3px rgba(44, 62, 80, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#D1D5DB';
                                e.target.style.boxShadow = 'none';
                            }}
                            placeholder="Tu teléfono *"
                        />

                        <textarea
                            name="comment"
                            required
                            rows={3}
                            value={formData.comment}
                            onChange={handleFormChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #D1D5DB',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                                resize: 'none',
                                transition: 'all 0.2s ease',
                                fontFamily: 'inherit',
                                background: '#F9FAFB'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#2C3E50';
                                e.target.style.boxShadow = '0 0 0 3px rgba(44, 62, 80, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#D1D5DB';
                                e.target.style.boxShadow = 'none';
                            }}
                            placeholder="Tu comentario o consulta *"
                        />

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    flex: 1,
                                    background: '#2C3E50',
                                    color: 'white',
                                    padding: '12px 16px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    opacity: isSubmitting ? 0.6 : 1,
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.background = '#34495E';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.background = '#2C3E50';
                                    }
                                }}
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar Consulta'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsFormActive(false)}
                                style={{
                                    padding: '12px 16px',
                                    border: '1px solid #D1D5DB',
                                    background: 'white',
                                    color: '#374151',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#F9FAFB';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'white';
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {submitStatus === 'success' && (
                <div style={{
                    padding: '24px',
                    borderTop: '1px solid #10B981',
                    background: '#ECFDF5',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '24px', color: '#10B981', marginBottom: '12px' }}>✅</div>
                    <h4 style={{
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#065F46',
                        marginBottom: '4px'
                    }}>
                        ¡Gracias por contactarnos!
                    </h4>
                    <p style={{
                        margin: 0,
                        fontSize: '12px',
                        color: '#047857'
                    }}>
                        Te contactaremos dentro de las próximas 24 horas
                    </p>
                </div>
            )}

            {submitStatus === 'error' && (
                <div style={{
                    padding: '24px',
                    borderTop: '1px solid #EF4444',
                    background: '#FEF2F2',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '24px', color: '#EF4444', marginBottom: '12px' }}>❌</div>
                    <h4 style={{
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#991B1B',
                        marginBottom: '4px'
                    }}>
                        Error al enviar
                    </h4>
                    <p style={{
                        margin: 0,
                        fontSize: '12px',
                        color: '#DC2626'
                    }}>
                        Por favor, intenta nuevamente
                    </p>
                </div>
            )}

            {!isFormActive && submitStatus === 'idle' && (
                <div style={{
                    padding: '20px',
                    borderTop: '1px solid #E5E7EB',
                    background: 'white'
                }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe tu mensaje..."
                            style={{
                                flex: 1,
                                padding: '12px',
                                border: '1px solid #D1D5DB',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'all 0.2s ease',
                                background: '#F9FAFB'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#2C3E50';
                                e.target.style.boxShadow = '0 0 0 3px rgba(44, 62, 80, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#D1D5DB';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!input.trim()}
                            style={{
                                background: '#2C3E50',
                                color: 'white',
                                padding: '12px 16px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: !input.trim() ? 'not-allowed' : 'pointer',
                                opacity: !input.trim() ? 0.5 : 1,
                                transition: 'all 0.2s ease',
                                minWidth: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onMouseOver={(e) => {
                                if (input.trim()) {
                                    e.currentTarget.style.background = '#34495E';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (input.trim()) {
                                    e.currentTarget.style.background = '#2C3E50';
                                }
                            }}
                        >
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>

                    <button
                        onClick={activateForm}
                        style={{
                            width: '100%',
                            background: '#2C3E50',
                            color: 'white',
                            padding: '12px 16px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#34495E';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = '#2C3E50';
                        }}
                    >
                        <span>Solicitar Contacto Personalizado</span>
                    </button>
                </div>
            )}
        </div>
    );
}