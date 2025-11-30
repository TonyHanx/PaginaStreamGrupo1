import './ListaCategorias.css';

interface Categoria {
  id: string;
  nombre: string;
  imagen: string;
  espectadores: string;
  tipo: string;
  etiquetas: string[];
}

const CATEGORIAS_TOP: Categoria[] = [
  {
    id: "1",
    nombre: "Just Chatting",
    imagen: "",
    espectadores: "57,4 mil espectadores",
    tipo: "IRL",
    etiquetas: ["Casual"]
  },
  {
    id: "2", 
    nombre: "Grand Theft Auto V",
    imagen: "",
    espectadores: "50,1 mil espectadores",
    tipo: "Shooter",
    etiquetas: ["Action"]
  },
  {
    id: "3",
    nombre: "League of Legends",
    imagen: "", 
    espectadores: "44,3 mil espectadores",
    tipo: "MOBA",
    etiquetas: ["Action"]
  },
  {
    id: "4",
    nombre: "Fortnite",
    imagen: "",
    espectadores: "41,1 mil espectadores", 
    tipo: "Battle Royale",
    etiquetas: ["Adventure"]
  },
  {
    id: "5",
    nombre: "Counter-Strike 2",
    imagen: "",
    espectadores: "16,2 mil espectadores",
    tipo: "Shooter", 
    etiquetas: ["Tactical"]
  },
  {
    id: "6",
    nombre: "Valorant",
    imagen: "",
    espectadores: "14,6 mil espectadores",
    tipo: "Shooter",
    etiquetas: ["Action"]
  },
  {
    id: "7", 
    nombre: "EA Sports FC 25",
    imagen: "",
    espectadores: "14,5 mil espectadores",
    tipo: "Simulator",
    etiquetas: ["Sport"]
  },
  {
    id: "8",
    nombre: "Minecraft", 
    imagen: "",
    espectadores: "12,2 mil espectadores",
    tipo: "Action",
    etiquetas: ["Survival"]
  },
  {
    id: "9",
    nombre: "Slots & Casino",
    imagen: "",
    espectadores: "9,47 mil espectadores",
    tipo: "Gambling",
    etiquetas: []
  },
  {
    id: "10",
    nombre: "Battlefield 6",
    imagen: "",
    espectadores: "12,1 mil espectadores", 
    tipo: "Shooter",
    etiquetas: ["FPS"]
  }
];

export default function ListaCategorias() {
  return (
    <section className="lista-categorias">
      <div className="lista-categorias__header">
        <h2 className="lista-categorias__titulo">Categorías Top en vivo</h2>
        <button className="lista-categorias__ver-todo">
          Ver todo
        </button>
      </div>
      
      <div className="lista-categorias__grid">
        {CATEGORIAS_TOP.map((categoria) => (
          <div key={categoria.id} className="categoria-card">
            <div className="categoria-card__imagen">
              {categoria.imagen ? (
                <img 
                  src={categoria.imagen} 
                  alt={categoria.nombre}
                />
              ) : (
                <div className="categoria-card__placeholder">
                  <div className="categoria-card__placeholder-icon">
                    🎮
                  </div>
                  <span className="categoria-card__placeholder-text">
                    {categoria.nombre}
                  </span>
                </div>
              )}
            </div>
            
            <div className="categoria-card__info">
              <h3 className="categoria-card__nombre">{categoria.nombre}</h3>
              <p className="categoria-card__espectadores">{categoria.espectadores}</p>
              
              <div className="categoria-card__etiquetas">
                <span className="categoria-card__tipo">{categoria.tipo}</span>
                {categoria.etiquetas.map((etiqueta, index) => (
                  <span key={index} className="categoria-card__etiqueta">
                    {etiqueta}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
