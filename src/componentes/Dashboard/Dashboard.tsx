import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";


interface Notification {
    mensaje: string;
    tiempo: string;
}

interface DashboardProps {
    horasTransmision: number;
    notifications: Notification[];
}



const Dashboard: React.FC<DashboardProps> = ({ horasTransmision, notifications }) => {
    const navigate = useNavigate();

    const metaNivel = 200;
    const progreso = Math.min((horasTransmision / metaNivel) * 100, 100);


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
        </div>        
        </div>

    );
};

export default Dashboard;
