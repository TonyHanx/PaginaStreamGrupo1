import React, { useEffect, useState } from 'react';
import './NotificacionNivel.css';

interface NotificacionNivelProps {
  nivel: number;
  onClose: () => void;
}

const NotificacionNivel: React.FC<NotificacionNivelProps> = ({ nivel, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 🆕 Animación de entrada
    setTimeout(() => setVisible(true), 10);

    // 🆕 Oculta la notificación luego de 4 segundos
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Espera a terminar animación
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notificacion-nivel ${visible ? 'visible' : ''}`}>
      <div className="notificacion-nivel__icono">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
            fill="#FFD700"
            stroke="#FF8C00"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <div className="notificacion-nivel__contenido">
        <div className="notificacion-nivel__titulo">¡Subiste de nivel! 🚀</div>
        <div className="notificacion-nivel__detalle">Has alcanzado el nivel {nivel}</div>
      </div>
    </div>
  );
};

export default NotificacionNivel;

