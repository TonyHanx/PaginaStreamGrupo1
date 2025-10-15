import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import NotificacionNivel from '../../componentes/NotificacionNivel/NotificacionNivel';

interface Notification {
    mensaje: string;
    tiempo: string;
}

interface DashboardProps {
    horasTransmision: number;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}


const Dashboard: React.FC<DashboardProps> = ({ horasTransmision, notifications, setNotifications }) => {
    const navigate = useNavigate();

    const metaNivel = 100;
    const progreso = Math.min((horasTransmision / metaNivel) * 100, 100);
    const [nivel, setNivel] = useState(1); // ✅ NUEVO (nivel actual del streamer)
    const [mostrarNotificacionNivel, setMostrarNotificacionNivel] = useState(false);

    useEffect(() => {
    const totalHoras = horasTransmision;
    const nivelActual = Math.floor(totalHoras / metaNivel) + 1;

    if (nivelActual > nivel) {
      // 🟢 Subió de nivel → mostrar notificación visual
      setNivel(nivelActual);
      setMostrarNotificacionNivel(true);

      // 🟢 Agregar mensaje al panel de notificaciones
      const nuevaNotificacion: Notification = {
        mensaje: `🎉 ¡Has alcanzado el Nivel ${nivelActual}!`,
        tiempo: new Date().toLocaleTimeString(),
      };
      setNotifications((prev) => [nuevaNotificacion, ...prev]);
    }
  }, [horasTransmision, nivel, metaNivel, setNotifications]); // 🟢 Se ejecuta cada vez que cambian las dependencias

    return (
        <div className="dashboard-full">
            <header className="dashboard-header">
                <button className="dashboard-volver-btn" onClick={() => navigate("/")}>Volver</button>
                <h2>Dashboard del Streamer</h2>
            </header>
            <div className="row dashboard">
            <div className="col dashboard-sidebar">
                <h3 className="titulo-Sidebar">Notificaciones</h3>
                <ul className="dashboard-notifications">
                    {notifications.length === 0 && <li className="dashboard-notification-vacia">Sin notificaciones</li>}
                    {notifications.map((n, idx) => (
                        <li key={idx} className="dashboard-notification">
                            <span className="dashboard-notification-msg">{n.mensaje}</span>
                            <span className="dashboard-notification-time">{n.tiempo}</span>
                        </li>
                    ))}
                </ul>
            </div>
                        <div className="col dashboard-main">
                                <div className="dashboard-stream-placeholder">
                                    <span>Espacio reservado para el stream</span>
                                </div>
                        </div>
            <div className="col dashboard-extra">
                <div className="dashboard-container">
                    <div className="dashboard-card">
                        <span className="dashboard-label">Tiempo en Vivo:</span>
                        <span className="dashboard-value">-- : --</span>
                    </div>
                </div>
                <div className="dashboard-container">
                    <div className="dashboard-card">
                        <span className="dashboard-label">Followers:</span>
                        <span className="dashboard-value">--</span>
                    </div>
                </div>
                <div className="dashboard-container">
                    <div className="dashboard-card">
                        <span className="dashboard-label">Espectadores</span>
                        <span className="dashboard-value">--</span>
                    </div>
                </div>
                <div className="dashboard-container">
                    <div className="dashboard-card">
                        <span className="dashboard-label">Horas de transmisión totales:</span>
                        <span className="dashboard-value">{horasTransmision}</span>
                    </div>
                </div>
                <div className="dashboard-container">
                    <div className="dashboard-card">
                        <span className="dashboard-label">Progreso al siguiente nivel:</span>

                    <div className="nivel-progreso-barra">
                        <div className="nivel-progreso-relleno" style={{ width: `${progreso}%` }}></div>
                    </div>
                    <span className="dashboard-value">
                        {horasTransmision}/{metaNivel} horas
                    </span>
                    </div>
                </div>
            </div>
            {mostrarNotificacionNivel && (
            <NotificacionNivel
            nivel={nivel}
            onClose={() => setMostrarNotificacionNivel(false)}
            />
            )}
        </div>        
        </div>

    );
};

export default Dashboard;

