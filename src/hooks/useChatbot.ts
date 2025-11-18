import { useState, useEffect } from "react";

interface LeadFormData {
    name: string;
    phone: string;
    comment: string;
}

export function useChatbot() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [isFormActive, setIsFormActive] = useState(false);
    const [formData, setFormData] = useState<LeadFormData>({
        name: '',
        phone: '',
        comment: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        setMessages(["¡Hola! 👋 Soy el asistente de HostAR. ¿En qué puedo ayudarte hoy?"]);
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            const userMessage = `Tú: ${input}`;
            setMessages((prev) => [...prev, userMessage]);
            setInput("");

            setTimeout(() => {
                const lowerInput = input.toLowerCase();
                let response = "";

                if (lowerInput.includes("hola") || lowerInput.includes("buenos días") || lowerInput.includes("buenas")) {
                    response = "¡Hola! 😊 ¿Te gustaría conocer nuestros planes de gestión o prefieres que te contactemos personalmente?";
                } else if (lowerInput.includes("plan") || lowerInput.includes("precio") || lowerInput.includes("tarifa")) {
                    response = "Tenemos 2 planes principales:\n\n🏠 **Plan Básico** ($299/mes)\n- Publicación en 3 portales\n- Fotos profesionales\n- Gestión de consultas\n\n⭐ **Plan Premium** ($499/mes)\n- Publicación en 6 portales\n- Video tour profesional\n- Soporte prioritario\n\n¿Te interesa alguno?";
                } else if (lowerInput.includes("contact") || lowerInput.includes("llam") || lowerInput.includes("whatsapp")) {
                    response = "¡Perfecto! 🚀 Para contactarte personalmente, necesito algunos datos. ¿Podrías completar este formulario breve?";
                    setIsFormActive(true);
                } else if (lowerInput.includes("gracias") || lowerInput.includes("thanks")) {
                    response = "¡De nada! 😊 ¿Hay algo más en lo que pueda ayudarte?";
                } else {
                    response = "Gracias por tu consulta. 🤔 ¿Te gustaría que nuestro equipo se contacte contigo para brindarte información personalizada?";
                    setIsFormActive(true);
                }

                setMessages((prev) => [...prev, `HostAR Bot: ${response}`]);
            }, 1000);
        }
    };

    const handleFormSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!formData.name || !formData.phone || !formData.comment) {
            setMessages(prev => [...prev, "HostAR Bot: Por favor, completa todos los campos del formulario."]);
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setMessages(prev => [...prev, "HostAR Bot: ✅ ¡Perfecto! Hemos recibido tu información. Te contactaremos dentro de las próximas 24 horas."]);
                setFormData({ name: '', phone: '', comment: '' });
                setIsFormActive(false);

                setTimeout(() => {
                    setSubmitStatus('idle');
                }, 3000);
            } else {
                setSubmitStatus('error');
                setMessages(prev => [...prev, "HostAR Bot: ❌ Hubo un error al enviar tu información. Por favor, intenta nuevamente."]);
            }
        } catch (error) {
            setSubmitStatus('error');
            setMessages(prev => [...prev, "HostAR Bot: ❌ Error de conexión. Por favor, intenta más tarde."]);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const activateForm = () => {
        setIsFormActive(true);
        setMessages(prev => [...prev, "HostAR Bot: 👇 Por favor, completa el formulario con tus datos:"]);
    };

    const resetChat = () => {
        setMessages(["¡Hola! 👋 Soy el asistente de HostAR. ¿En qué puedo ayudarte hoy?"]);
        setIsFormActive(false);
        setFormData({ name: '', phone: '', comment: '' });
        setSubmitStatus('idle');
    };

    return {
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
    };
}