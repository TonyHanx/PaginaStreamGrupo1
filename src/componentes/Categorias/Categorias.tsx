import React from "react";
import "./Categorias.css";

const categorias = [
  { id: "irl", nombre: "IRL", badge: "IRL" },
  { id: "shooters", nombre: "Shooters", badge: "FPS" },
  { id: "moba", nombre: "Slots", badge: "Slots" },
];

export default function Categorias() {
  return (
    <section className="cat-section">
      <h2 className="cat-title">Categorías</h2>

      <div className="cat-grid">
        {categorias.map((c) => (
          <a key={c.id} href={`#${c.id}`} className="cat-card">
            <div className="cat-card-badge">{c.badge}</div>
            <div className="cat-card-name">{c.nombre}</div>
          </a>
        ))}
      </div>

      <div className="cat-footer">
        <button className="cat-more">Ver más categorías</button>
      </div>
    </section>
  );
}
