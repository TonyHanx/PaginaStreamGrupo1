import React from 'react';
import './Nosotros.css';
import { useNavigate } from 'react-router-dom';

interface MiembroEquipo {
  id: number;
  nombre: string;
  foto: string;
}

const Nosotros: React.FC = () => {
  const navigate = useNavigate();

  const miembrosEquipo: MiembroEquipo[] = [
    {
      id: 1,
      nombre: "Leandro Perez",
      foto: "/avatars/equipo/leandro.jpg"
    },
    {
      id: 2,
      nombre: "Andrea Castillo",
      foto: "/avatars/equipo/andrea.jpg"
    },
    {
      id: 3,
      nombre: "Mathias Castañeda",
      foto: "/avatars/equipo/mathias.jpg"
    },
    {
      id: 4,
      nombre: "Cristian Erazo",
      foto: "/avatars/equipo/cristian.jpg"
    },
    {
      id: 5,
      nombre: "Anthony Quispe",
      foto: "/avatars/equipo/anthony.jpg"
    },
    {
      id: 6,
      nombre: "Katsuo Taniguchi",
      foto: "/avatars/equipo/katsuo.jpg"
    }
  ];

  const handleRegresarClick = () => {
    navigate('/');
  };

  return (
    <div className="nosotros-standalone">
      <div className="nosotros-content">
        <h1 className="nosotros-title">¿Quiénes somos?</h1>
        
        <div className="miembros-grid">
          {miembrosEquipo.map((miembro) => (
            <div key={miembro.id} className="miembro-card">
              <div className="miembro-avatar">
                <img 
                  src={miembro.foto} 
                  alt={miembro.nombre}
                  onError={(e) => {
                    // Imagen de placeholder si no se encuentra la foto
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(miembro.nombre)}&size=150&background=00bfff&color=000000`;
                  }}
                />
              </div>
              <h3 className="miembro-nombre">{miembro.nombre}</h3>
            </div>
          ))}
        </div>

        <button className="btn-regresar" onClick={handleRegresarClick}>
          Regresar a Nexus
        </button>
      </div>
    </div>
  );
};

export default Nosotros;
