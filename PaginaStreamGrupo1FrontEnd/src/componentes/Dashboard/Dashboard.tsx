import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import NotificacionNivel from '../../componentes/NotificacionNivel/NotificacionNivel';
import GiftOverlay from '../RegaloOverlay/GiftOverlay';
import BunnySVG from '../Icons/BunnySVG';
import type { GiftData } from '../RegaloOverlay/GiftOverlay';
import type { Regalo } from '../../types/regalos';
import { obtenerTodosLosRegalos } from '../../utils/regalos';
import { obtenerMonedasUsuario, gastarMonedas } from '../../utils/monedas';
import { AccionesPuntos } from '../../utils/puntos';
import { addTransactionToLocalStorage, syncTransactions } from '../../services/transactionService';
import {
    obtenerDatosStreamer,
    guardarDatosStreamer,
    calcularNivelStreamer,
    actualizarHorasTransmision,
    obtenerRangoStreamer
} from '../../utils/streamer';

interface Notification {
    mensaje: string;
    tiempo: string;
    tipo?: 'nivel' | 'meta' | 'seguidor' | 'donacion' | 'general';
}

interface ChatMessage {
    id: number;
    username: string;
    message: string;
    timestamp: string;
    color: string;
    isGift?: boolean;
    giftIcon?: string;
}

interface DashboardProps {
    horasTransmision: number;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}


const Dashboard: React.FC<DashboardProps> = ({ horasTransmision, notifications, setNotifications }) => {
    const navigate = useNavigate();

    // Estados para progreso del streamer
    const [nivelStreamer, setNivelStreamer] = useState(1);
    const [progresoStreamer, setProgresoStreamer] = useState(0);
    const [horasParaSiguienteNivel, setHorasParaSiguienteNivel] = useState(10);
    const [rangoStreamer, setRangoStreamer] = useState({ nombre: 'Novato', icono: '🌱', color: '#2ECC71' });
    const [mostrarNotificacionNivel, setMostrarNotificacionNivel] = useState(false);

    // Estados del chat y transmisión
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    // overlay for incoming gifts (visible only in the creator control panel)
    const [activeGift, setActiveGift] = useState<GiftData | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [tiempoTransmision, setTiempoTransmision] = useState({ horas: 0, minutos: 0, segundos: 0 });
    const [isStreaming, setIsStreaming] = useState(false);
    const [showGiftPanel, setShowGiftPanel] = useState(false);
    const [espectadores, setEspectadores] = useState(0);
    const [followers, setFollowers] = useState(1);
    const [saldo, setSaldo] = useState(0);
    const [totalHorasTransmitidas, setTotalHorasTransmitidas] = useState(0);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const chatMessagesRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<number | null>(null);
    const inicioStreamRef = useRef<Date | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Regalos disponibles (predeterminados + personalizados del streamer)
    const [regalos, setRegalos] = useState<Regalo[]>([]);

    // Recuperar el stream activo al montar el componente
    useEffect(() => {
        const globalStream = (window as any).activeMediaStream;
        const streamStartTime = localStorage.getItem('streamStartTime');
        
        if (globalStream && globalStream.active) {
            setMediaStream(globalStream);
            setIsStreaming(true);
            if (videoRef.current) {
                videoRef.current.srcObject = globalStream;
            }
            
            // Recuperar el tiempo transcurrido
            if (streamStartTime) {
                const inicio = new Date(streamStartTime);
                const ahora = new Date();
                const segundosTranscurridos = Math.floor((ahora.getTime() - inicio.getTime()) / 1000);
                
                const horas = Math.floor(segundosTranscurridos / 3600);
                const minutos = Math.floor((segundosTranscurridos % 3600) / 60);
                const segundos = segundosTranscurridos % 60;
                
                setTiempoTransmision({ horas, minutos, segundos });
            }
        }
    }, []);

    // Obtener datos del usuario
    const usuarioStr = sessionStorage.getItem('USUARIO');
    let displayName = 'grupo1';
    let username = 'grupo1';
    let parsedUsuario: any = null;
    try {
        const usuarioData = usuarioStr ? JSON.parse(usuarioStr) : null;
        parsedUsuario = usuarioData;
        displayName = usuarioData?.username || 'grupo1';
        username = usuarioData?.username || 'grupo1';
    } catch {
        displayName = 'grupo1';
        username = 'grupo1';
    }

    // possible user id field used by routing (e.g. /stream/:streamerId)
    const currentUserId = parsedUsuario?.userId ?? parsedUsuario?.id ?? username;

    // Actualizar saldo
    const actualizarSaldo = () => {
        const datos = obtenerMonedasUsuario();
        setSaldo(datos?.monedas ?? 0);
    };

    // Cargar datos del streamer al montar el componente
    useEffect(() => {
        let streamerData = obtenerDatosStreamer();

        // Si no existen datos del streamer, inicializarlos
        if (!streamerData || streamerData.horasTransmision === undefined) {
            const usuarioStr = sessionStorage.getItem('USUARIO');
            const usuario = usuarioStr ? JSON.parse(usuarioStr) : {};

            streamerData = {
                username: usuario.username || 'grupo1',
                horasTransmision: 0,
                nivel: 1,
                seguidores: 0,
                totalDonaciones: 0
            };
            guardarDatosStreamer(streamerData);
        }

        if (streamerData) {
            setTotalHorasTransmitidas(streamerData.horasTransmision);
            const progreso = calcularNivelStreamer(streamerData.horasTransmision);
            setNivelStreamer(progreso.nivel);
            setProgresoStreamer(progreso.porcentaje);
            setHorasParaSiguienteNivel(progreso.horasParaSiguiente);
            setRangoStreamer(obtenerRangoStreamer(progreso.nivel));
            setFollowers(streamerData.seguidores);
        }
    }, []);

    useEffect(() => {
        actualizarSaldo();
        window.addEventListener("storage", actualizarSaldo);
        window.addEventListener("monedas-actualizadas", actualizarSaldo);
        window.addEventListener("saldo-actualizado", actualizarSaldo);
        const interval = setInterval(actualizarSaldo, 1000);
        return () => {
            window.removeEventListener("storage", actualizarSaldo);
            window.removeEventListener("monedas-actualizadas", actualizarSaldo);
            window.removeEventListener("saldo-actualizado", actualizarSaldo);
            clearInterval(interval);
        };
    }, []);

    // Cargar regalos (predeterminados + personalizados del streamer actual)
    useEffect(() => {
        const cargarRegalos = async () => {
            // Obtener el streamerId UUID del usuario actual
            const usuario = parsedUsuario;
            const streamerId = usuario?.streamerId || usuario?.id || username;
            console.log('🎁 Cargando regalos para streamer:', streamerId);
            const todosLosRegalos = await obtenerTodosLosRegalos(streamerId);
            console.log('🎁 Regalos obtenidos:', todosLosRegalos);
            const regalosConColor = [
                ...todosLosRegalos.predeterminados.map(r => ({ ...r, color: '#00bfff' })),
                ...todosLosRegalos.personalizados.map(r => ({ ...r, color: '#764ba2' }))
            ];
            console.log('🎁 Total regalos con color:', regalosConColor.length);
            setRegalos(regalosConColor);
        };
        cargarRegalos();
    }, [username]);

    // Auto-scroll del chat
    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [chatMessages]);

    // Control del tiempo de transmisión en tiempo real
    useEffect(() => {
        if (isStreaming) {
            intervalRef.current = setInterval(() => {
                const streamStartTime = localStorage.getItem('streamStartTime');
                if (streamStartTime) {
                    const inicio = new Date(streamStartTime);
                    const ahora = new Date();
                    const segundosTranscurridos = Math.floor((ahora.getTime() - inicio.getTime()) / 1000);
                    
                    const horas = Math.floor(segundosTranscurridos / 3600);
                    const minutos = Math.floor((segundosTranscurridos % 3600) / 60);
                    const segundos = segundosTranscurridos % 60;
                    
                    setTiempoTransmision({ horas, minutos, segundos });
                }
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isStreaming]);

    // Actualizar progreso del streamer cada minuto de transmisión
    useEffect(() => {
        if (!isStreaming) return;

        const checkInterval = setInterval(() => {
            const streamerData = obtenerDatosStreamer();
            if (!streamerData) return;

            // Calcular horas actuales de esta sesión
            const horasSesion = tiempoTransmision.horas + (tiempoTransmision.minutos / 60) + (tiempoTransmision.segundos / 3600);
            const horasTotales = totalHorasTransmitidas + horasSesion;

            // Calcular nuevo nivel
            const progreso = calcularNivelStreamer(horasTotales);
            const nivelAnterior = nivelStreamer;

            // Actualizar estados
            setProgresoStreamer(progreso.porcentaje);
            setHorasParaSiguienteNivel(progreso.horasParaSiguiente);

            // Verificar si subió de nivel
            if (progreso.nivel > nivelAnterior) {
                setNivelStreamer(progreso.nivel);
                setRangoStreamer(obtenerRangoStreamer(progreso.nivel));
                setMostrarNotificacionNivel(true);

                const nuevaNotificacion: Notification = {
                    mensaje: `🎉 ¡Has alcanzado el Nivel ${progreso.nivel} como Streamer!`,
                    tiempo: new Date().toLocaleTimeString(),
                    tipo: 'nivel'
                };
                setNotifications((prev) => [nuevaNotificacion, ...prev]);

                // Guardar en storage
                streamerData.nivel = progreso.nivel;
                streamerData.horasTransmision = horasTotales;
                guardarDatosStreamer(streamerData);
            }
        }, 10000); // Verificar cada 10 segundos

        return () => clearInterval(checkInterval);
    }, [isStreaming, tiempoTransmision, nivelStreamer, totalHorasTransmitidas, setNotifications]);

    // Enviar mensaje al chat
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageInput.trim()) {
            const colores = ['#FFD700', '#00FF00', '#FF6B6B', '#E91E63', '#3498DB', '#2ECC71', '#F39C12', '#1ABC9C', '#9B59B6', '#00bfff'];
            const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];

            const nuevoMensaje: ChatMessage = {
                id: Date.now(),
                username: username,
                message: messageInput,
                timestamp: new Date().toLocaleTimeString(),
                color: colorAleatorio
            };

            setChatMessages(prev => [...prev, nuevoMensaje]);
            setMessageInput('');

            // Agregar notificación de nuevo mensaje al feed
            const nuevaNotificacion: Notification = {
                mensaje: `💬 ${username}: ${messageInput.substring(0, 50)}${messageInput.length > 50 ? '...' : ''}`,
                tiempo: new Date().toLocaleTimeString(),
                tipo: 'general'
            };
            setNotifications((prev) => [nuevaNotificacion, ...prev]);
        }
    };

    // Enviar regalo
    const handleSendGift = async (regalo: any) => {
        // Importar gastarMonedas y obtenerMonedasUsuario
        const datosUsuario = obtenerMonedasUsuario();
        if (!datosUsuario) return;

        const saldoReal = datosUsuario.monedas;
        console.log('💰 [Dashboard] Verificando saldo:', saldoReal, 'vs precio:', regalo.precio);

        // Si no hay suficiente saldo, abrir tienda de monedas
        if (saldoReal < regalo.precio) {
            console.log('❌ [Dashboard] Saldo insuficiente');
            // Disparar evento para abrir tienda de monedas
            window.dispatchEvent(new CustomEvent('abrirTiendaMonedas'));
            // NO cerrar el panel de regalos, dejar que el usuario decida
            return;
        }

        // Gastar monedas usando la función centralizada
        console.log('💸 [Dashboard] Gastando monedas:', regalo.precio);
        const gastadoExitoso = gastarMonedas(regalo.precio);
        if (!gastadoExitoso) {
            return;
        }

        // Obtener datos del streamer actual
        const streamerData = obtenerDatosStreamer();

        // Registrar transacción localmente
        addTransactionToLocalStorage({
            userId: '',
            streamerId: streamerData?.username || username,
            giftId: regalo.id,
            tipo: 'regalo',
            monto: regalo.precio,
            descripcion: `Regalo ${regalo.nombre} enviado`,
            gift: {
                nombre: regalo.nombre,
                emoji: regalo.emoji,
                imagenUrl: regalo.imagenUrl
            }
        });

        // Sincronizar transacciones con el backend
        syncTransactions();

        // Agregar puntos
        const usuarioStr = sessionStorage.getItem('USUARIO');
        if (usuarioStr) {
            const usuario = JSON.parse(usuarioStr);
            const puntosActuales = usuario.puntos ?? 0;
            const nuevosPuntos = puntosActuales + (AccionesPuntos.DONAR || 50);
            usuario.puntos = nuevosPuntos;
            sessionStorage.setItem('USUARIO', JSON.stringify(usuario));

            // Sincronizar localStorage
            const registradoStr = localStorage.getItem('USUARIO_REGISTRADO');
            if (registradoStr) {
                const registrado = JSON.parse(registradoStr);
                if (registrado.username === usuario.username) {
                    registrado.puntos = nuevosPuntos;
                    localStorage.setItem('USUARIO_REGISTRADO', JSON.stringify(registrado));
                }
            }
        }

        console.log('✅ [Dashboard] Regalo enviado exitosamente');

        const nuevoMensaje: ChatMessage = {
            id: Date.now(),
            username: username,
            message: `${regalo.nombre} (${regalo.precio} monedas)`,
            timestamp: new Date().toLocaleTimeString(),
            color: regalo.color,
            isGift: true,
            giftIcon: regalo.emoji || regalo.imagenUrl
        };

        setChatMessages(prev => [...prev, nuevoMensaje]);
        // NO cerrar el panel de regalos después de enviar
        // setShowGiftPanel(false); - El usuario puede cerrarla manualmente o enviar más

        // Agregar notificación al feed
        const iconoRegalo = regalo.emoji || '🎁';
        const nuevaNotificacion: Notification = {
            mensaje: `🎁 ${username} envió ${iconoRegalo} ${regalo.nombre}`,
            tiempo: new Date().toLocaleTimeString(),
            tipo: 'donacion'
        };
        setNotifications((prev) => [nuevaNotificacion, ...prev]);

        // Also notify the control panel overlay (simulate a global event that viewers would dispatch)
        try {
            window.dispatchEvent(
                new CustomEvent('regaloEnviado', {
                    detail: {
                        streamerId: username,
                        sender: username,
                        gift: {
                            nombre: regalo.nombre,
                            icono: regalo.imagenUrl || regalo.emoji || '🎁',
                            color: regalo.color,
                            audioUrl: regalo.audioUrl || undefined, // AQUÍ VA EL AUDIO QUE SE DESEE REPRODUCIR
                        },
                    },
                })
            );
        } catch {
            // ignore
        }

    };

    // Listen for incoming gifts (from viewers) and show overlay to streamer in dashboard
    useEffect(() => {
        const handler = (e: any) => {
            const d = e?.detail;
            if (!d) return;

            // Show overlay only if the event is targeted to this streamer
            if (
                String(d.streamerId) === String(username) ||
                String(d.streamerId) === String(displayName) ||
                String(d.streamerId) === String(currentUserId)
            ) {
                const giftInfo: GiftData = {
                    sender: String(d.sender ?? "Espectador"),
                    nombre: String(d.gift?.nombre ?? "Regalo"),
                    icono: String(d.gift?.icono ?? d.gift?.emoji ?? "🎁"),
                    color: d.gift?.color,
                    audioUrl: d.gift?.audioUrl ? String(d.gift.audioUrl) : undefined, // ✅ AQUÍ PASAMOS EL AUDIO
                };

                console.log("🎁 Gift recibido en overlay:", giftInfo);
                setActiveGift(giftInfo);
            }
        };

        window.addEventListener("regaloEnviado", handler as EventListener);
        return () =>
            window.removeEventListener("regaloEnviado", handler as EventListener);
    }, [username, displayName, currentUserId]);

    // Toggle de streaming
    const toggleStreaming = async () => {
        if (isStreaming) {
            // Detener stream - guardar horas transmitidas
            const segundosTotales = tiempoTransmision.horas * 3600 + tiempoTransmision.minutos * 60 + tiempoTransmision.segundos;
            const horasSesion = segundosTotales / 3600;

            const streamerData = obtenerDatosStreamer();
            if (streamerData) {
                streamerData.horasTransmision = totalHorasTransmitidas + horasSesion;
                guardarDatosStreamer(streamerData);
                setTotalHorasTransmitidas(streamerData.horasTransmision);
            }

            // Detener el stream de medios
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
                setMediaStream(null);
                // Remover de la variable global
                delete (window as any).activeMediaStream;
                localStorage.removeItem('streamStartTime');
            }

            // Resetear contador de sesión
            setTiempoTransmision({ horas: 0, minutos: 0, segundos: 0 });

            const nuevaNotificacion: Notification = {
                mensaje: `⏹️ Transmisión finalizada - ${formatTime(tiempoTransmision.horas)}:${formatTime(tiempoTransmision.minutos)}:${formatTime(tiempoTransmision.segundos)}`,
                tiempo: new Date().toLocaleTimeString(),
                tipo: 'general'
            };
            setNotifications((prev) => [nuevaNotificacion, ...prev]);
        } else {
            // Iniciar stream - Solicitar permisos de cámara y micrófono
            try {
                console.log('🎥 Solicitando permisos de cámara y micrófono...');
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: true, 
                    audio: true 
                });
                
                console.log('✅ Permisos concedidos:', stream);
                
                // Guardar el stream globalmente para que persista entre navegaciones
                (window as any).activeMediaStream = stream;
                
                // Guardar el tiempo de inicio
                const ahora = new Date();
                localStorage.setItem('streamStartTime', ahora.toISOString());
                
                // Guardar el stream y conectarlo al video
                setMediaStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                
                // Mostrar notificación de éxito
                const nuevaNotificacion: Notification = {
                    mensaje: '🔴 Transmisión iniciada - Cámara y micrófono activados',
                    tiempo: new Date().toLocaleTimeString(),
                    tipo: 'general'
                };
                setNotifications((prev) => [nuevaNotificacion, ...prev]);
                
            } catch (error: any) {
                console.error('❌ Error al solicitar permisos:', error);
                
                let mensajeError = '❌ No se pudo acceder a la cámara/micrófono';
                if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                    mensajeError = '❌ Permisos denegados. Permite el acceso a cámara y micrófono en la configuración del navegador.';
                } else if (error.name === 'NotFoundError') {
                    mensajeError = '❌ No se encontró cámara o micrófono conectado.';
                }
                
                const nuevaNotificacion: Notification = {
                    mensaje: mensajeError,
                    tiempo: new Date().toLocaleTimeString(),
                    tipo: 'general'
                };
                setNotifications((prev) => [nuevaNotificacion, ...prev]);
                
                // No iniciar el streaming si no hay permisos
                return;
            }
        }

        setIsStreaming(!isStreaming);
    };

    const formatTime = (num: number) => num.toString().padStart(2, '0');

    return (
        <div className="dashboard-creator">
            <div className="dashboard-creator__header">
                <button className="dashboard-creator__back-btn" onClick={() => navigate("/")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Volver
                </button>
                <h1 className="dashboard-creator__title">Panel de Control del Creador</h1>
            </div>

            <div className="dashboard-creator__layout">
                {/* Animated gift overlay (visible only to creator) */}
                <GiftOverlay gift={activeGift} visible={!!activeGift} onClose={() => setActiveGift(null)} />
                {/* Columna izquierda: Vista previa del stream */}
                <div className="dashboard-creator__left">
                    <div className="dashboard-creator__section">
                        <div className="dashboard-creator__section-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                            <h2>Vista previa del stream</h2>
                        </div>
                        <div className="dashboard-creator__stream-preview">
                            {/* Video de la cámara */}
                            <video 
                                ref={videoRef}
                                autoPlay 
                                playsInline 
                                muted
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: isStreaming ? 'block' : 'none',
                                    zIndex: 1
                                }}
                            />
                            
                            {/* Overlay cuando está offline */}
                            {!isStreaming && (
                                <div className="dashboard-creator__offline-overlay">
                                    <div className="dashboard-creator__offline-badge">SIN CONEXIÓN</div>
                                    <h3 className="dashboard-creator__offline-title">{displayName} está fuera de línea</h3>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Feed de actividades */}
                    <div className="dashboard-creator__section">
                        <div className="dashboard-creator__section-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13 7.5h5v2h-5zm0 7h5v2h-5zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM11 6H6v5h5V6zm-1 4H7V7h3v3zm1 3H6v5h5v-5zm-1 4H7v-3h3v3z" />
                            </svg>
                            <h2>Feed de actividades</h2>
                            <button className="dashboard-creator__filter-btn">Filtro</button>
                        </div>
                        <div className="dashboard-creator__activity-feed">
                            {notifications.length === 0 ? (
                                <div className="dashboard-creator__empty-feed">
                                    <p>Sin actividad reciente</p>
                                </div>
                            ) : (
                                notifications.map((n, idx) => (
                                    <div key={idx} className="dashboard-creator__activity-item">
                                        <span className="dashboard-creator__activity-msg">{n.mensaje}</span>
                                        <span className="dashboard-creator__activity-time">{n.tiempo}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Columna central: Chat */}
                <div className="dashboard-creator__center">
                    <div className="dashboard-creator__section" style={{ position: 'relative', overflow: 'visible' }}>
                        <div className="dashboard-creator__section-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                            </svg>
                            <h2>Chat</h2>
                            <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <BunnySVG width={20} height={20} />
                                <div style={{ color: '#00bfff', fontWeight: 700 }}>{saldo}</div>
                            </div>
                            <button className="dashboard-creator__settings-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                            </button>
                        </div>
                        <div className="dashboard-creator__chat" ref={chatMessagesRef}>
                            {chatMessages.length === 0 ? (
                                <div className="dashboard-creator__chat-empty">
                                    <p>El chat está vacío</p>
                                    <p className="dashboard-creator__chat-subtitle">Los mensajes aparecerán aquí cuando comiences a transmitir</p>
                                </div>
                            ) : (
                                <div className="dashboard-creator__chat-messages">
                                    {chatMessages.map((msg) => (
                                        <div key={msg.id} className={`dashboard-creator__chat-message ${msg.isGift ? 'gift-message' : ''}`}>
                                            {msg.isGift ? (
                                                <>
                                                    <span className="dashboard-creator__chat-time">{msg.timestamp}</span>
                                                    <div className="dashboard-creator__gift-message-content">
                                                        {msg.giftIcon?.startsWith('http') ? (
                                                            <img
                                                                src={msg.giftIcon}
                                                                alt="gift"
                                                                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><text y="28" font-size="28">🎁</text></svg>';
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="dashboard-creator__gift-message-icon">{msg.giftIcon}</span>
                                                        )}
                                                        <div className="dashboard-creator__gift-message-text">
                                                            <span className="dashboard-creator__chat-username" style={{ color: msg.color }}>
                                                                {msg.username}
                                                            </span>
                                                            <span className="dashboard-creator__gift-message-label">envió {msg.message}</span>
                                                        </div>
                                                        <span className="dashboard-creator__gift-sparkle">✨</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="dashboard-creator__chat-time">{msg.timestamp}</span>
                                                    <span className="dashboard-creator__chat-username" style={{ color: msg.color }}>
                                                        {msg.username}:
                                                    </span>
                                                    <span className="dashboard-creator__chat-text">{msg.message}</span>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <form className="dashboard-creator__chat-input" onSubmit={handleSendMessage}>
                            <button
                                type="button"
                                className="dashboard-creator__gift-btn"
                                style={{
                                    backgroundColor: showGiftPanel ? '#00bfff' : '#2c2c2e'
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('🎁 Botón clickeado, estado actual:', showGiftPanel);
                                    console.log('📦 Regalos disponibles:', regalos);
                                    const nuevoEstado = !showGiftPanel;
                                    console.log('🔄 Cambiando a:', nuevoEstado);
                                    setShowGiftPanel(nuevoEstado);
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="3" y="8" width="18" height="4" stroke="currentColor" strokeWidth="2" fill="none" />
                                    <rect x="5" y="12" width="14" height="9" stroke="currentColor" strokeWidth="2" fill="none" />
                                    <path d="M12 8V21 M12 8C12 5 14 5 14 5C14 5 16 5 16 8 M12 8C12 5 10 5 10 5C10 5 8 5 8 8" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </button>
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder="Enviar un mensaje"
                                className="dashboard-creator__input"
                            />
                            <button type="submit" className="dashboard-creator__send-btn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                </svg>
                            </button>
                        </form>

                        {/* Panel de regalos */}
                        {showGiftPanel && (
                            <div className="dashboard-creator__gift-panel" style={{
                                backgroundColor: '#18181b',
                                border: '2px solid #00bfff',
                                display: 'block'
                            }}>
                                <div className="dashboard-creator__gift-header">
                                    <h3>Enviar regalo ({regalos.length} disponibles)</h3>
                                    <button onClick={() => setShowGiftPanel(false)}>×</button>
                                </div>

                                {/* Regalos Predeterminados */}
                                {regalos.filter(r => r.esPredeterminado).length > 0 && (
                                    <div className="dashboard-creator__gift-section">
                                        <h4 className="dashboard-creator__gift-section-title">🎁 Predeterminados</h4>
                                        <div className="dashboard-creator__gift-grid">
                                            {regalos.filter(r => r.esPredeterminado).map((regalo, index) => (
                                                <button
                                                    key={regalo.id}
                                                    className="dashboard-creator__gift-item"
                                                    onClick={() => handleSendGift(regalo)}
                                                    style={{ borderColor: regalo.color || '#00bfff' }}
                                                >
                                                    <span className="dashboard-creator__gift-icon">{regalo.emoji}</span>
                                                    <span className="dashboard-creator__gift-name">{regalo.nombre}</span>
                                                    <span className="dashboard-creator__gift-price">
                                                        <BunnySVG width={18} height={18} /> {regalo.precio}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Regalos Personalizados */}
                                {regalos.filter(r => !r.esPredeterminado).length > 0 && (
                                    <div className="dashboard-creator__gift-section">
                                        <h4 className="dashboard-creator__gift-section-title">✨ Exclusivos del Streamer</h4>
                                        <div className="dashboard-creator__gift-grid">
                                            {regalos.filter(r => !r.esPredeterminado).map((regalo, index) => (
                                                <button
                                                    key={regalo.id}
                                                    className="dashboard-creator__gift-item dashboard-creator__gift-item--custom"
                                                    onClick={() => handleSendGift(regalo)}
                                                    style={{ borderColor: regalo.color || '#764ba2' }}
                                                >
                                                    {regalo.imagenUrl ? (
                                                        <img
                                                            src={regalo.imagenUrl}
                                                            alt={regalo.nombre}
                                                            className="dashboard-creator__gift-image"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><text y="40" font-size="36">🎁</text></svg>';
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="dashboard-creator__gift-icon">🎁</span>
                                                    )}
                                                    <span className="dashboard-creator__gift-name">{regalo.nombre}</span>
                                                    <span className="dashboard-creator__gift-price">
                                                        <BunnySVG width={18} height={18} /> {regalo.precio}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {regalos.length === 0 && (
                                    <p style={{ color: 'white', padding: '20px', textAlign: 'center' }}>No hay regalos disponibles</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Columna derecha: Información del stream */}
                <div className="dashboard-creator__right">
                    <div className="dashboard-creator__section">
                        <div className="dashboard-creator__section-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                            </svg>
                            <h2>Información del stream</h2>
                            <button className="dashboard-creator__edit-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                </svg>
                            </button>
                        </div>
                        <div className="dashboard-creator__stream-info">
                            <div className="dashboard-creator__info-item">
                                <label>Título del stream</label>
                                <p>My first stream.</p>
                            </div>
                            <div className="dashboard-creator__info-item">
                                <label>Categoría</label>
                                <p>Conversando</p>
                            </div>
                            <div className="dashboard-creator__info-item">
                                <label>Idioma</label>
                                <p>English</p>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-creator__section">
                        <div className="dashboard-creator__section-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            <h2>Acciones de canal</h2>
                            <button className="dashboard-creator__more-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                            </button>
                        </div>
                        <div className="dashboard-creator__actions">
                            <button className="dashboard-creator__action-item">
                                <span>Modo lento</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="m10 17 5-5-5-5v10z" />
                                </svg>
                            </button>
                            <button className="dashboard-creator__action-item">
                                <span>Chat de solo-seguidores</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="m10 17 5-5-5-5v10z" />
                                </svg>
                            </button>
                            <div className="dashboard-creator__action-item toggle">
                                <span>Chat de solo-...</span>
                                <div className="dashboard-creator__toggle">
                                    <input type="checkbox" id="chat-sub" />
                                    <label htmlFor="chat-sub"></label>
                                </div>
                            </div>
                            <div className="dashboard-creator__action-item toggle">
                                <span>Chat de solo-emotes</span>
                                <div className="dashboard-creator__toggle">
                                    <input type="checkbox" id="chat-emotes" />
                                    <label htmlFor="chat-emotes"></label>
                                </div>
                            </div>
                            <button className="dashboard-creator__action-item">
                                <span>Moderación del chat con IA</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                </svg>
                            </button>
                            <button className="dashboard-creator__action-item">
                                <span>Restricción de edad</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                </svg>
                            </button>
                            <button className="dashboard-creator__action-item">
                                <span>Palabras baneadas</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="dashboard-creator__section">
                        <div className="dashboard-creator__section-header">
                            <h2>Estadísticas</h2>
                            <button
                                className={`dashboard-creator__stream-toggle ${isStreaming ? 'active' : ''}`}
                                onClick={toggleStreaming}
                            >
                                {isStreaming ? '⏹️ Detener' : '🔴 Iniciar Stream'}
                            </button>
                        </div>
                        <div className="dashboard-creator__stats">
                            <div className="dashboard-creator__stat-card">
                                <span className="dashboard-creator__stat-label">Tiempo en vivo</span>
                                <span className="dashboard-creator__stat-value">
                                    {formatTime(tiempoTransmision.horas)}:{formatTime(tiempoTransmision.minutos)}:{formatTime(tiempoTransmision.segundos)}
                                </span>
                            </div>
                            <div className="dashboard-creator__stat-card">
                                <span className="dashboard-creator__stat-label">Espectadores</span>
                                <span className="dashboard-creator__stat-value">{espectadores}</span>
                            </div>
                            <div className="dashboard-creator__stat-card">
                                <span className="dashboard-creator__stat-label">Followers</span>
                                <span className="dashboard-creator__stat-value">{followers}</span>
                            </div>
                            <div className="dashboard-creator__stat-card">
                                <span className="dashboard-creator__stat-label">Horas totales transmitidas</span>
                                <span className="dashboard-creator__stat-value">{totalHorasTransmitidas.toFixed(1)}h</span>
                            </div>
                            <div className="dashboard-creator__stat-card">
                                <span className="dashboard-creator__stat-label">
                                    {rangoStreamer.icono} {rangoStreamer.nombre} - Nivel {nivelStreamer}
                                </span>
                                <div className="dashboard-creator__progress-bar">
                                    <div className="dashboard-creator__progress-fill" style={{
                                        width: `${progresoStreamer}%`,
                                        background: `linear-gradient(90deg, ${rangoStreamer.color}, ${rangoStreamer.color}99)`
                                    }}></div>
                                </div>
                                <span className="dashboard-creator__stat-sublabel">
                                    {progresoStreamer.toFixed(1)}% - Faltan {horasParaSiguienteNivel} horas para nivel {nivelStreamer + 1}
                                </span>
                            </div>
                            <div className="dashboard-creator__stat-card">
                                <span className="dashboard-creator__stat-label">Mensajes en chat</span>
                                <span className="dashboard-creator__stat-value">{chatMessages.length}</span>
                            </div>
                            <div className="dashboard-creator__stat-card">
                                <span className="dashboard-creator__stat-label">Actividades</span>
                                <span className="dashboard-creator__stat-value">{notifications.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {mostrarNotificacionNivel && (
                <NotificacionNivel
                    nivel={nivelStreamer}
                    onClose={() => setMostrarNotificacionNivel(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;


