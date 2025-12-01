import React, { useState, useEffect, useRef } from 'react';
import './VistaStream.css';
import { agregarPuntos, AccionesPuntos, calcularNivel } from '../../utils/puntos';
import { obtenerMonedasUsuario, gastarMonedas } from '../../utils/monedas';
import NotificacionPuntos from '../NotificacionPuntos/NotificacionPuntos';
import { obtenerTodosLosRegalos } from '../../utils/regalos';
import type { Regalo as RegaloType } from '../../types/regalos';
import { addTransactionToLocalStorage, syncTransactions } from '../../services/transactionService';

import BunnySVG from '../Icons/BunnySVG';
import GiftOverlay from '../RegaloOverlay/GiftOverlay';
import type { GiftData } from '../RegaloOverlay/GiftOverlay';

interface VistaStreamProps {
  streamerId?: string;
  onShowLogin?: () => void;
}

interface Notificacion {
  id: number;
  puntos: number;
  mensaje: string;
}

interface ChatMessage {
  id: number;
  username: string;
  message: string;
  color: string;
  puntos?: number;
  isBroadcaster?: boolean;
  isGift?: boolean;
}

const VistaStream: React.FC<VistaStreamProps> = ({ streamerId = "1", onShowLogin }) => {
  const [message, setMessage] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [showGiftStore, setShowGiftStore] = useState(false);
  const [saldoActual, setSaldoActual] = useState(0);
  const [activeTab, setActiveTab] = useState('Inicio');
  const [regalosDisponibles, setRegalosDisponibles] = useState<RegaloType[]>([]);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Función para actualizar el saldo
  const actualizarSaldo = () => {
    const datos = obtenerMonedasUsuario();
    const nuevoSaldo = datos?.monedas || 0;
    setSaldoActual(nuevoSaldo);
  };

  // Obtener información del usuario actual
  const usuarioActualStr = typeof window !== 'undefined' ? sessionStorage.getItem('USUARIO') : null;
  let usuarioActual: any = null;
  try {
    usuarioActual = usuarioActualStr ? JSON.parse(usuarioActualStr) : null;
  } catch {
    usuarioActual = null;
  }

  // Verificar si este stream es del usuario actual
  const esCanPropio = usuarioActual && usuarioActual.userId === streamerId;

  // Función helper para mostrar notificación de puntos
  const mostrarNotificacionPuntos = (puntos: number, mensaje: string) => {
    const nuevaNotificacion: Notificacion = {
      id: Date.now(),
      puntos,
      mensaje
    };
    setNotificaciones(prev => [...prev, nuevaNotificacion]);
  };

  // Función helper para mostrar notificación sin puntos
  const mostrarNotificacionSimple = (mensaje: string) => {
    const nuevaNotificacion: Notificacion = {
      id: Date.now(),
      puntos: 0,
      mensaje
    };
    setNotificaciones(prev => [...prev, nuevaNotificacion]);
  };

  // Función para abrir la tienda de monedas del encabezado
  const abrirTiendaMonedas = () => {
    // Disparar un evento personalizado para que el encabezado abra la tienda
    const evento = new CustomEvent('abrirTiendaMonedas');
    window.dispatchEvent(evento);
    setShowGiftStore(false); // Cerrar la tienda de regalos
  };

  const cerrarNotificacion = (id: number) => {
    setNotificaciones(prev => prev.filter(n => n.id !== id));
  };

  // Función para enviar regalo
  const enviarRegalo = async (regalo: RegaloType) => {
    const datosUsuario = obtenerMonedasUsuario();
    if (!datosUsuario) {
      onShowLogin?.();
      return;
    }

    // Verificar saldo ACTUAL desde sessionStorage
    const saldoReal = datosUsuario.monedas;
    console.log('💰 [VistaStream] Verificando saldo:', saldoReal, 'vs precio:', regalo.precio);
    
    if (saldoReal < regalo.precio) {
      console.log('❌ [VistaStream] Saldo insuficiente - Abriendo modal de recarga');
      // Abrir modal de recarga inmediatamente
      abrirTiendaMonedas();
      return;
    }

    try {
      // Intentar enviar al backend primero
      const token = localStorage.getItem('token');
      if (token) {
        console.log('🌐 [VistaStream] Enviando regalo al backend');
        const response = await fetch('http://localhost:3000/api/gifts/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            giftId: regalo.id,
            streamerId: streamerId
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ [VistaStream] Regalo enviado al backend:', data);
          
          // Actualizar saldo desde la respuesta del backend
          const usuarioStr = sessionStorage.getItem('USUARIO');
          if (usuarioStr) {
            const usuario = JSON.parse(usuarioStr);
            usuario.monedas = data.monedas;
            usuario.puntos = data.puntos;
            usuario.xp = data.xp || usuario.xp;
            usuario.nivel = data.nivel || usuario.nivel;
            sessionStorage.setItem('USUARIO', JSON.stringify(usuario));
            
            // Actualizar localStorage también
            localStorage.setItem('user', JSON.stringify(usuario));
          }

          // Disparar evento para actualizar el saldo globalmente
          window.dispatchEvent(new Event('saldo-actualizado'));
          actualizarSaldo();

          // Mostrar notificación si subió de nivel
          if (data.subiDeNivel) {
            mostrarNotificacionSimple(`¡Subiste al nivel ${data.nivel}! +${data.xpGanado} XP`);
          }

          console.log('✅ [VistaStream] Regalo enviado exitosamente');
          return;
        }
      }

      // Fallback: Si no hay token o falla el backend, usar lógica local
      console.log('⚠️ [VistaStream] Usando fallback local');
    } catch (error) {
      console.error('❌ [VistaStream] Error al enviar regalo:', error);
      // Continuar con fallback local
    }

    // Fallback local (solo si no hay backend)
    console.log('💸 [VistaStream] Gastando monedas (local):', regalo.precio);
    const gastadoExitoso = gastarMonedas(regalo.precio);
    if (!gastadoExitoso) {
      mostrarNotificacionSimple('Error al procesar el regalo');
      return;
    }

    // Registrar transacción localmente
    addTransactionToLocalStorage({
      userId: '',
      streamerId: streamerId,
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

    // Actualizar el estado local (el evento ya actualizará el resto)
    console.log('✅ [VistaStream] Regalo enviado exitosamente (local)');
    actualizarSaldo();

    // Sincronizar transacciones con el backend
    syncTransactions();

    // Agregar puntos de experiencia equivalentes al precio del regalo
    const puntosGanados = agregarPuntos(regalo.precio);
    if (puntosGanados) {
      // Mostrar notificación de puntos ganados por enviar el regalo
      setTimeout(() => {
        mostrarNotificacionPuntos(regalo.precio, `¡Ganaste XP por enviar ${regalo.nombre}!`);
      }, 500); // Mostrar después de medio segundo para no solapar con la notificación del gasto
    }

    // Agregar mensaje de regalo al chat
    const iconoRegalo = regalo.emoji || regalo.imagenUrl || '🎁';
    const mensajeRegalo: ChatMessage = {
      id: Date.now(),
      username: datosUsuario.username,
      message: `envió ${iconoRegalo} ${regalo.nombre}`,
      color: regalo.color || '#00bfff',
      isGift: true
    };
    
    setChatMessages(prev => [...prev, mensajeRegalo]);
    
    // NO cerrar la tienda de regalos después de enviar
    // setShowGiftStore(false); - El usuario puede cerrarla manualmente o enviar más
    
    // Emitir evento global para notificar que se envió un regalo (puede ser escuchado por el streamer)
    try {
      window.dispatchEvent(new CustomEvent('regaloEnviado', { detail: { streamerId, sender: datosUsuario?.username, gift: regalo } }));
    } catch (e) {
      // En navegadores más antiguos puede fallar, pero no es crítico
      console.warn('No se pudo emitir evento de regalo', e);
    }
    mostrarNotificacionPuntos(-regalo.precio, `¡Regalo enviado!`);
    setShowGiftStore(false);
  };

  // Detectar si el usuario está logueado y actualizar saldo
  useEffect(() => {
    // Cargar regalos del streamer
    const cargarRegalos = async () => {
      const todosLosRegalos = await obtenerTodosLosRegalos(streamerId);
      const regalos = [...todosLosRegalos.predeterminados, ...todosLosRegalos.personalizados];
      setRegalosDisponibles(regalos);
    };
    
    cargarRegalos();
    
    const checkLogin = () => {
      const usuario = typeof window !== 'undefined' ? sessionStorage.getItem('USUARIO') : null;
      setIsLoggedIn(!!usuario);
      actualizarSaldo(); // Actualizar saldo cada vez que cambie el login
    };
    
    checkLogin();
    
    // Escuchar cambios en el sessionStorage
    window.addEventListener('storage', checkLogin);
    
    // Verificar periódicamente el estado de login
    const interval = setInterval(checkLogin, 500);
    
    return () => {
      window.removeEventListener('storage', checkLogin);
      clearInterval(interval);
    };
  }, []);

  // Actualizar saldo cuando se abra la tienda de regalos
  useEffect(() => {
    if (showGiftStore) {
      // Actualizar saldo inmediatamente al abrir la tienda
      const datos = obtenerMonedasUsuario();
      const saldoReal = datos?.monedas || 0;
      setSaldoActual(saldoReal);
      console.log('Tienda abierta - Saldo inicial:', saldoReal);
    }
  }, [showGiftStore]);

  // Escuchar cambios globales de saldo desde cualquier componente
  useEffect(() => {
    const actualizarSaldoGlobal = () => {
      const datos = obtenerMonedasUsuario();
      const saldoReal = datos?.monedas || 0;
      setSaldoActual(saldoReal);
      console.log('💰 Saldo actualizado globalmente:', saldoReal);
    };

    window.addEventListener('monedas-actualizadas', actualizarSaldoGlobal);
    window.addEventListener('saldo-actualizado', actualizarSaldoGlobal);
    window.addEventListener('storage', actualizarSaldoGlobal);

    return () => {
      window.removeEventListener('monedas-actualizadas', actualizarSaldoGlobal);
      window.removeEventListener('saldo-actualizado', actualizarSaldoGlobal);
      window.removeEventListener('storage', actualizarSaldoGlobal);
    };
  }, []);

  // Sistema de puntos por ver stream (cada 5 minutos)
  useEffect(() => {
    if (!isLoggedIn) return;
    
    // Otorgar puntos cada 5 minutos (300000 ms)
    const puntosInterval = setInterval(() => {
      const puntosGanados = agregarPuntos(AccionesPuntos.VER_STREAM_5MIN);
      if (puntosGanados) {
        mostrarNotificacionPuntos(AccionesPuntos.VER_STREAM_5MIN, '¡Por ver el stream!');
      }
    }, 300000); // 5 minutos
    
    return () => {
      clearInterval(puntosInterval);
    };
  }, [isLoggedIn]);

  // Datos de ejemplo del stream
  const streamData = esCanPropio ? {
    username: usuarioActual?.username || "Usuario",
    displayName: usuarioActual?.username || "Usuario",
    title: "Canal sin transmisión en vivo",
    viewers: "0",
    category: "Offline",
    tags: ["Offline"],
    isLive: false,
    avatar: "",
    isVerified: false
  } : {
    username: "LACOBRAAA",
    displayName: "LACOBRAAA",
    title: "GOLEÓ ARGENTINA, GANÓ ESPAÑA 4-0. DOBLETE DE CRISTIANO. SE VIENE MÉXICO-ECUADO...",
    viewers: "68,39K",
    category: "Conversando",
    tags: ["Conversando", "Spanish"],
    isLive: true,
    avatar: "",
    isVerified: true
  };

  // Mensajes de chat de ejemplo
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(
    esCanPropio ? [] : [
      { id: 1, username: "pollocdmx", message: "🔥🔥🔥", color: "#FFD700", puntos: 120 },
      { id: 2, username: "Domifutbolero", message: "GOLAZO!", color: "#00FF00", puntos: 350 },
      { id: 3, username: "rmelcrack", message: "TREMENDO", color: "#FF6B6B", puntos: 80 },
      { id: 4, username: "LACOBRAAA", message: "SALVAME GEMINIII", color: "#9B59B6", isBroadcaster: true, puntos: 900 },
      { id: 5, username: "SilverAngell", message: "🎵🎶", color: "#E91E63", puntos: 210 },
      { id: 6, username: "adrianxtacs", message: "jajajaja", color: "#3498DB", puntos: 60 },
      { id: 7, username: "Lukveg", message: "ICI", color: "#2ECC71", puntos: 40 },
      { id: 8, username: "chalols6", message: "XDDD", color: "#F39C12", puntos: 500 },
      { id: 9, username: "abrah_amm", message: "TREMENDO AD", color: "#1ABC9C", puntos: 300 }
    ]
  );

  // Auto-scroll al agregar nuevos mensajes
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Overlay state for this stream view (visible to page viewers and streamer inside the stream page)
  const [activeGiftOverlay, setActiveGiftOverlay] = useState<GiftData | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      const d = e?.detail;
      if (!d) return;
      if (String(d.streamerId) === String(streamerId)) {
        const giftInfo: GiftData = {
          sender: String(d.sender ?? 'Espectador'),
          nombre: String(d.gift?.nombre ?? 'Regalo'),
          icono: String(d.gift?.icono ?? '🎁'),
          color: d.gift?.color
        };
        setActiveGiftOverlay(giftInfo);
      }
    };

    window.addEventListener('regaloEnviado', handler as EventListener);
    return () => window.removeEventListener('regaloEnviado', handler as EventListener);
  }, [streamerId]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isLoggedIn) {
      // Obtener nombre de usuario
      const usuarioStr = sessionStorage.getItem('USUARIO');
      let username = 'Usuario';
      try {
        const usuarioData = usuarioStr ? JSON.parse(usuarioStr) : null;
        username = usuarioData?.username || 'Usuario';
      } catch {
        username = 'Usuario';
      }
      
      // Crear nuevo mensaje con color aleatorio
      const colores = ['#FFD700', '#00FF00', '#FF6B6B', '#E91E63', '#3498DB', '#2ECC71', '#F39C12', '#1ABC9C', '#9B59B6', '#00bfff'];
      const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
      
      // Obtener puntos del usuario actual
      let puntosUsuario = 0;
      const usuarioData = usuarioStr ? JSON.parse(usuarioStr) : null;
      if (usuarioData && typeof usuarioData.puntos === 'number') {
        puntosUsuario = usuarioData.puntos;
      }

      const nuevoMensaje: ChatMessage = {
        id: Date.now(),
        username: username,
        message: message,
        color: colorAleatorio,
        puntos: puntosUsuario
      };
      
      // Agregar mensaje al chat
      setChatMessages(prev => [...prev, nuevoMensaje]);
      
      // Otorgar puntos por enviar mensaje en el chat
      const puntosGanados = agregarPuntos(AccionesPuntos.ENVIAR_MENSAJE_CHAT);
      if (puntosGanados) {
        mostrarNotificacionPuntos(AccionesPuntos.ENVIAR_MENSAJE_CHAT, '¡Por enviar mensaje!');
      }
      
      setMessage('');
    }
  };

  return (
    <div className="vista-stream">
      {/* Área principal del stream */}
      <div className="vista-stream__main">
        {/* Video del stream - solo mostrar si NO es canal propio O si está en vivo */}
        {(!esCanPropio || streamData.isLive) && (
          <div className={`vista-stream__video-container ${isFullscreen ? 'fullscreen' : ''}`}>
            <div 
              className="vista-stream__video-placeholder vista-stream__video-placeholder--cobra"
            >
              {/* Verificar si el canal está offline */}
              {!streamData.isLive ? (
                <div className="vista-stream__offline-container">
                  <div className="vista-stream__offline-content">
                    <div className="vista-stream__offline-badge">DESCONECTADO</div>
                    <h2 className="vista-stream__offline-title">{streamData.displayName} está fuera de línea</h2>
                    <p className="vista-stream__offline-message">Este canal todavía no tiene contenido</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Aquí iría el reproductor de video real */}
                  <div className="vista-stream__live-indicator">
                    <span className="vista-stream__live-badge">LIVE</span>
                    <span className="vista-stream__live-viewers">{streamData.viewers} espectadores</span>
                  </div>
                </>
              )}
              
              {/* Controles del reproductor */}
              <div className="vista-stream__controls">
              <button className="vista-stream__control-btn play-pause">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <polygon points="8,5 8,19 19,12" />
                </svg>
              </button>
              
              <button 
                className="vista-stream__control-btn volume"
                onClick={() => setIsMuted(!isMuted)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  {isMuted ? (
                    <path d="M3,9 L7,9 L12,4 L12,20 L7,15 L3,15 Z M16,10 L18,12 M18,10 L16,12" stroke="white" strokeWidth="2" fill="none"/>
                  ) : (
                    <path d="M3,9 L7,9 L12,4 L12,20 L7,15 L3,15 Z M16,12 Q20,12 20,12 M16,9 Q22,9 22,12 Q22,15 16,15" stroke="white" strokeWidth="2" fill="none"/>
                  )}
                </svg>
              </button>

              <span className="vista-stream__time">05:49:41</span>

              <div className="vista-stream__controls-right">
                <button className="vista-stream__control-btn settings">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" fill="none"/>
                    <path d="M12,3 L12,1 M12,23 L12,21 M21,12 L23,12 M1,12 L3,12 M18.4,5.6 L19.8,4.2 M4.2,19.8 L5.6,18.4 M18.4,18.4 L19.8,19.8 M4.2,4.2 L5.6,5.6" stroke="white" strokeWidth="2"/>
                  </svg>
                </button>
                
                <button 
                  className="vista-stream__control-btn fullscreen"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M7,14 L3,14 L3,21 L10,21 L10,17 M17,10 L21,10 L21,3 L14,3 L14,7" stroke="white" strokeWidth="2" fill="none"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Banner del canal propio - solo mostrar si es canal propio y está offline */}
        {esCanPropio && !streamData.isLive && (
          <div className="vista-stream__channel-banner">
            <div className="vista-stream__channel-banner-bg">
              <div className="vista-stream__channel-banner-content">
                <div className="vista-stream__channel-offline-badge">
                  DESCONECTADO
                </div>
                <h2 className="vista-stream__channel-offline-title">
                  {streamData.displayName} está fuera de línea
                </h2>
              </div>
            </div>
          </div>
        )}

        {/* Información del streamer */}
        <div className="vista-stream__info">
          <div className="vista-stream__streamer-info">
            <div className="vista-stream__streamer-avatar">
              {streamData.avatar ? (
                <img src={streamData.avatar} alt={streamData.displayName} />
              ) : (
                <div className="vista-stream__avatar-placeholder">
                  {streamData.displayName.charAt(0)}
                </div>
              )}
              {streamData.isVerified && (
                <div className="vista-stream__verified">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M10 1.5L12.7 6.8L18.5 7.6L14.2 11.7L15.4 17.4L10 14.8L4.6 17.4L5.8 11.7L1.5 7.6L7.3 6.8L10 1.5Z" fill="#00FF00" stroke="#fff" strokeWidth="0.3"/>
                    <path d="M7 10L9 12L13 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>

            <div className="vista-stream__streamer-details">
              <h2 className="vista-stream__streamer-name">{streamData.displayName}</h2>
              <p className="vista-stream__stream-title">{streamData.title}</p>
              <div className="vista-stream__stream-meta">
                <span className="vista-stream__category">{streamData.category}</span>
                {streamData.tags.map((tag, index) => (
                  <span key={index} className="vista-stream__tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="vista-stream__actions">
            {!esCanPropio && (
              <>
                <button className="vista-stream__action-btn notifications">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="white" strokeWidth="2" fill="none"/>
                  </svg>
                </button>
                
                <button className="vista-stream__action-btn favorite">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="white" strokeWidth="2" fill="none"/>
                  </svg>
                </button>

                <button className="vista-stream__action-btn gift">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <rect x="3" y="8" width="18" height="4" stroke="white" strokeWidth="2" fill="none"/>
                    <rect x="5" y="12" width="14" height="9" stroke="white" strokeWidth="2" fill="none"/>
                    <path d="M12 8V21 M12 8C12 5 14 5 14 5C14 5 16 5 16 8 M12 8C12 5 10 5 10 5C10 5 8 5 8 8" stroke="white" strokeWidth="2" fill="none"/>
                  </svg>
                  Regala Suscripciones
                </button>

                <button 
                  className={`vista-stream__action-btn subscribe ${isFollowing ? 'following' : ''}`}
                  onClick={() => {
                    if (!isFollowing && isLoggedIn) {
                      // Otorgar puntos por seguir al streamer (solo la primera vez)
                      const puntosGanados = agregarPuntos(AccionesPuntos.SEGUIR_STREAMER);
                      if (puntosGanados) {
                        mostrarNotificacionPuntos(AccionesPuntos.SEGUIR_STREAMER, '¡Por seguir al streamer!');
                      }
                    }
                    setIsFollowing(!isFollowing);
                  }}
                >
                  {isFollowing ? 'Siguiendo' : 'Suscribirse'}
                </button>
              </>
            )}
            {esCanPropio && (
              <>
                <button className="vista-stream__action-btn customize-channel">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="currentColor"/>
                  </svg>
                  Personaliza tu canal
                </button>
                <button
                  className="vista-stream__action-btn simulate-gift"
                  onClick={() => {
                    // Simulación sencilla: tomar regalo aleatorio y emitir evento como si fuera enviado por un espectador
                    const idx = Math.floor(Math.random() * regalosDisponibles.length);
                    const regaloAleatorio = regalosDisponibles[idx];
                    const sender = 'spontaneoUser';
                    window.dispatchEvent(new CustomEvent('regaloEnviado', { detail: { streamerId, sender, gift: regaloAleatorio } }));
                  }}
                  title="Simular regalo (solo en entorno de desarrollo)"
                >
                  Simular regalo
                </button>
                <button className="vista-stream__action-btn icon-only">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <circle cx="18" cy="5" r="3" stroke="white" strokeWidth="2" fill="none"/>
                    <circle cx="6" cy="12" r="3" stroke="white" strokeWidth="2" fill="none"/>
                    <circle cx="18" cy="19" r="3" stroke="white" strokeWidth="2" fill="none"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="white" strokeWidth="2"/>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="white" strokeWidth="2"/>
                  </svg>
                </button>
                <button className="vista-stream__action-btn icon-only">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="5" r="2" fill="white"/>
                    <circle cx="12" cy="12" r="2" fill="white"/>
                    <circle cx="12" cy="19" r="2" fill="white"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs de navegación - solo mostrar en canal propio offline */}
        {esCanPropio && !streamData.isLive && (
          <>
            <div className="vista-stream__tabs">
              <button 
                className={`vista-stream__tab ${activeTab === 'Inicio' ? 'active' : ''}`}
                onClick={() => setActiveTab('Inicio')}
              >
                Inicio
              </button>
              <button 
                className={`vista-stream__tab ${activeTab === 'Sobre' ? 'active' : ''}`}
                onClick={() => setActiveTab('Sobre')}
              >
                Sobre
              </button>
              <button 
                className={`vista-stream__tab ${activeTab === 'Videos' ? 'active' : ''}`}
                onClick={() => setActiveTab('Videos')}
              >
                Videos
              </button>
              <button 
                className={`vista-stream__tab ${activeTab === 'Clips' ? 'active' : ''}`}
                onClick={() => setActiveTab('Clips')}
              >
                Clips
              </button>
            </div>

            <div className="vista-stream__content">
              <div className="vista-stream__empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3, marginBottom: '16px' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="#adadb8" strokeWidth="2"/>
                  <circle cx="8" cy="9" r="2" stroke="#adadb8" strokeWidth="2"/>
                  <polyline points="3 15 8 10 12 14 21 5" stroke="#adadb8" strokeWidth="2"/>
                </svg>
                <h3 className="vista-stream__empty-title">No hay contenido disponible</h3>
                <p className="vista-stream__empty-subtitle">Este canal todavía no tiene contenido</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Chat lateral */}
      <div className="vista-stream__chat">
        <div className="vista-stream__chat-header">
          <h3>Chat</h3>
          <div className="vista-stream__chat-actions">
            <button className="vista-stream__chat-settings">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" fill="none"/>
                <path d="M12,3 L12,1 M12,23 L12,21 M21,12 L23,12 M1,12 L3,12" stroke="white" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="vista-stream__chat-messages" ref={chatMessagesRef}>
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`vista-stream__chat-message ${msg.isGift ? 'gift-message' : ''}`}>
              <span 
                className={`vista-stream__chat-username ${msg.isBroadcaster ? 'broadcaster' : ''}`}
                style={{ color: msg.color }}
              >
                {msg.username} <strong className="vista-stream__chat-level">Nv.{msg.puntos ? calcularNivel(msg.puntos).nivel : 1}</strong>:
              </span>
              <span className="vista-stream__chat-text">{msg.message}</span>
              {msg.isGift && <span className="vista-stream__chat-gift-sparkle">✨</span>}
            </div>
          ))}
        </div>

        {isLoggedIn ? (
          <div className="vista-stream__chat-input-container">
            <form className="vista-stream__chat-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Enviar un mensaje"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="vista-stream__chat-send">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M22 2L11 13 M22 2L15 22L11 13 M22 2L2 9L11 13" stroke="white" strokeWidth="2" fill="none"/>
                </svg>
              </button>
            </form>
            <button 
              className="vista-stream__chat-gift-btn"
              onClick={() => setShowGiftStore(true)}
              title="Enviar regalo"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="8" width="18" height="4" stroke="white" strokeWidth="2" fill="none"/>
                <rect x="5" y="12" width="14" height="9" stroke="white" strokeWidth="2" fill="none"/>
                <path d="M12 8V21 M12 8C12 5 14 5 14 5C14 5 16 5 16 8 M12 8C12 5 10 5 10 5C10 5 8 5 8 8" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </button>
          </div>
        ) : (
          <div className="vista-stream__chat-login">
            <p>Inicia sesión para chatear</p>
            <button 
              className="vista-stream__chat-login-btn"
              onClick={onShowLogin}
            >
              Iniciar sesión
            </button>
          </div>
        )}
      </div>
      
      {/* Overlay visible in the stream view for viewers */}
      <GiftOverlay gift={activeGiftOverlay} visible={!!activeGiftOverlay} onClose={() => setActiveGiftOverlay(null)} playSound={false} />

      {/* Notificaciones de puntos */}
      {notificaciones.map((notif) => (
        <NotificacionPuntos
          key={notif.id}
          puntos={notif.puntos}
          mensaje={notif.mensaje}
          onClose={() => cerrarNotificacion(notif.id)}
        />
      ))}

      {/* Overlay animado para el streamer */}
      {/* Overlay is now shown in the Creator Dashboard only (control panel). */}

      {/* Modal de tienda de regalos */}
      {showGiftStore && (
        <div 
          className="vista-stream__gift-modal-overlay"
          onClick={() => setShowGiftStore(false)}
        >
          <div 
            className="vista-stream__gift-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="vista-stream__gift-modal-header">
              <h3>Tienda de Regalos</h3>
              <button 
                className="vista-stream__gift-modal-close"
                onClick={() => setShowGiftStore(false)}
              >
                ×
              </button>
            </div>
            
            <div className="vista-stream__gift-modal-content">
              <div className="vista-stream__gift-user-coins">
                <BunnySVG width={24} height={24} />
                Tus monedas: {saldoActual}
              </div>
              
              <div className="vista-stream__gift-grid">
                {regalosDisponibles.map((regalo) => {
                  return (
                    <div 
                      key={regalo.id} 
                      className={`vista-stream__gift-item ${!regalo.esPredeterminado ? 'vista-stream__gift-item--custom' : ''}`}
                      onClick={() => enviarRegalo(regalo)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="vista-stream__gift-icon">
                        {regalo.imagenUrl ? (
                          <img 
                            src={regalo.imagenUrl} 
                            alt={regalo.nombre}
                            style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><text y="40" font-size="36">🎁</text></svg>';
                            }}
                          />
                        ) : (
                          regalo.emoji
                        )}
                      </div>
                      <div className="vista-stream__gift-name">{regalo.nombre}</div>
                      <div className="vista-stream__gift-price">
                        <BunnySVG width={16} height={16} /> {regalo.precio}
                      </div>
                      {!regalo.esPredeterminado && (
                        <div className="vista-stream__gift-badge">Exclusivo</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VistaStream;
