import React, { useState } from 'react';
import './VistaStream.css';

interface VistaStreamProps {
  streamerId?: string;
}

const VistaStream: React.FC<VistaStreamProps> = ({ streamerId = "1" }) => {
  const [message, setMessage] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Detectar si el usuario está logueado
  const usuario = typeof window !== 'undefined' ? sessionStorage.getItem('USUARIO') : null;
  const isLoggedIn = !!usuario;

  // Datos de ejemplo del stream
  const streamData = {
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
  const [chatMessages] = useState([
    { id: 1, username: "pollocdmx", message: "🔥🔥🔥", color: "#FFD700" },
    { id: 2, username: "Domifutbolero", message: "GOLAZO!", color: "#00FF00" },
    { id: 3, username: "rmelcrack", message: "TREMENDO", color: "#FF6B6B" },
    { id: 4, username: "LACOBRAAA", message: "SALVAME GEMINIII", color: "#9B59B6", isBroadcaster: true },
    { id: 5, username: "SilverAngell", message: "🎵🎶", color: "#E91E63" },
    { id: 6, username: "adrianxtacs", message: "jajajaja", color: "#3498DB" },
    { id: 7, username: "Lukveg", message: "ICI", color: "#2ECC71" },
    { id: 8, username: "chalols6", message: "XDDD", color: "#F39C12" },
    { id: 9, username: "abrah_amm", message: "TREMENDO AD", color: "#1ABC9C" }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Mensaje enviado:', message);
      setMessage('');
    }
  };

  return (
    <div className="vista-stream">
      {/* Área principal del stream */}
      <div className="vista-stream__main">
        {/* Video del stream */}
        <div className={`vista-stream__video-container ${isFullscreen ? 'fullscreen' : ''}`}>
          <div 
            className="vista-stream__video-placeholder"
            style={{
              backgroundImage: 'url(/imagenes/qué-opinan-de-la-cobra-v0-6m7zlzhyit6d1.webp)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Aquí iría el reproductor de video real */}
            <div className="vista-stream__live-indicator">
              <span className="vista-stream__live-badge">LIVE</span>
              <span className="vista-stream__live-viewers">{streamData.viewers} espectadores</span>
            </div>
            
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
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? 'Siguiendo' : 'Suscribirse'}
            </button>
          </div>
        </div>
      </div>

      {/* Chat lateral */}
      <div className="vista-stream__chat">
        <div className="vista-stream__chat-header">
          <h3>Chat</h3>
          <button className="vista-stream__chat-settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M12,3 L12,1 M12,23 L12,21 M21,12 L23,12 M1,12 L3,12" stroke="white" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="vista-stream__chat-messages">
          {chatMessages.map((msg) => (
            <div key={msg.id} className="vista-stream__chat-message">
              <span 
                className={`vista-stream__chat-username ${msg.isBroadcaster ? 'broadcaster' : ''}`}
                style={{ color: msg.color }}
              >
                {msg.username}:
              </span>
              <span className="vista-stream__chat-text">{msg.message}</span>
            </div>
          ))}
        </div>

        {isLoggedIn ? (
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
        ) : (
          <div className="vista-stream__chat-login">
            <p>Inicia sesión para chatear</p>
            <button className="vista-stream__chat-login-btn">Iniciar sesión</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VistaStream;
