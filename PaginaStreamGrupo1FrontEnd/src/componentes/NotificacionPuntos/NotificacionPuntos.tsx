import React, { useEffect, useState } from 'react';
import './NotificacionPuntos.css';

interface NotificacionPuntosProps {
  puntos: number;
  mensaje: string;
  onClose: () => void;
}

const NotificacionPuntos: React.FC<NotificacionPuntosProps> = ({ puntos, mensaje, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mostrar la notificación con animación
    setTimeout(() => setVisible(true), 10);
    
    // Ocultar después de 3 segundos
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Esperar a que termine la animación
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notificacion-puntos ${visible ? 'visible' : ''}`}>
      <div className="notificacion-puntos__icono">
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
        </svg>
      </div>
      <div className="notificacion-puntos__contenido">
        {puntos > 0 && <div className="notificacion-puntos__puntos">+{puntos} puntos</div>}
        <div className="notificacion-puntos__mensaje">{mensaje}</div>
      </div>
    </div>
  );
};

export default NotificacionPuntos;
