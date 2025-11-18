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
    const [isOpen, setIsOpen] = useState(true);
    const chatMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages]);

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
    };

    if (!isOpen) {
        return (
            <div style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999
            }}>
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: 'white',
                        padding: '16px',
                        borderRadius: '50%',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: 'scale(1)'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                    }}
                    title="Abrir chat"
                >
                    <span style={{ fontSize: '20px' }}>💬</span>
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
                        background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                        color: 'white',
                        padding: '16px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        minWidth: '200px'
                    }}
                    onClick={() => setIsMinimized(false)}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)';
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>💬 ¿Necesitas ayuda?</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClose();
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '18px',
                                cursor: 'pointer',
                                padding: '0',
                                marginLeft: '12px'
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
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            border: '1px solid #E5E7EB',
            animation: 'fadeInUp 0.3s ease-out'
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                color: 'white',
                padding: '20px',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        background: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{ color: '#3B82F6', fontSize: '16px' }}>💬</span>
                    </div>
                    <div>
                        <h3 style={{
                            margin: 0,
                            fontSize: '16px',
                            fontWeight: '600',
                            lineHeight: '1.2'
                        }}>
                            Asistente HostAR
                        </h3>
                        <p style={{
                            margin: 0,
                            fontSize: '12px',
                            opacity: 0.8,
                            lineHeight: '1.2',
                            marginTop: '2px'
                        }}>
                            En línea • Te ayuda al instante
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => setIsMinimized(true)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            transition: 'background 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'none';
                        }}
                        title="Minimizar"
                    >
                        _
                    </button>
                    <button
                        onClick={handleClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            transition: 'background 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'none';
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
                                borderRadius: '18px',
                                maxWidth: '85%',
                                background: msg.startsWith("Tú:")
                                    ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                                    : 'white',
                                color: msg.startsWith("Tú:") ? 'white' : '#374151',
                                border: msg.startsWith("Tú:") ? 'none' : '1px solid #E5E7EB',
                                borderRadius: msg.startsWith("Tú:") ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                boxShadow: msg.startsWith("Tú:") ? '0 2px 8px rgba(59, 130, 246, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)'
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
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3B82F6';
                                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
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
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3B82F6';
                                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
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
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3B82F6';
                                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
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
                                    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
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
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isSubmitting) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)';
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
                                transition: 'all 0.2s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#3B82F6';
                                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
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
                                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                                color: 'white',
                                padding: '12px 16px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: !input.trim() ? 'not-allowed' : 'pointer',
                                opacity: !input.trim() ? 0.5 : 1,
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                if (input.trim()) {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (input.trim()) {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)';
                                }
                            }}
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>

                    <button
                        onClick={activateForm}
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
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
                            e.currentTarget.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
                        }}
                    >
                        <span>Solicitar Contacto Personalizado</span>
                    </button>
                </div>
            )}
        </div>
    );
}