import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Encabezado, { type EncabezadoHandle } from "../componentes/Encabezado/Encabezado";
import BarraLateral from "../componentes/BarraLateral/BarraLateral";
import VistaStream from "../componentes/VistaStream/VistaStream";
import "./Inicio/Inicio.css";
import GiftOverlay from '../componentes/RegaloOverlay/GiftOverlay';
import type { GiftData } from '../componentes/RegaloOverlay/GiftOverlay';

const StreamPage: React.FC = () => {
  const { streamerId } = useParams<{ streamerId: string }>();
  const encabezadoRef = useRef<EncabezadoHandle>(null);

  // overlay at page-level for stream viewers (no sound by default)
  const [pageGift, setPageGift] = useState<GiftData | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      const d = e?.detail;
      if (!d) return;
      if (String(d.streamerId) === String(streamerId)) {
        const giftInfo: GiftData = {
          sender: String(d.sender ?? 'Anonimo'),
          nombre: String(d.gift?.nombre ?? 'Regalo'),
          icono: String(d.gift?.icono ?? '🎁'),
          color: d.gift?.color
        };
        setPageGift(giftInfo);
      }
    };

    window.addEventListener('regaloEnviado', handler as EventListener);
    return () => window.removeEventListener('regaloEnviado', handler as EventListener);
  }, [streamerId]);

  const handleShowLogin = () => {
    encabezadoRef.current?.showLoginModal();
  };

  return (
    <div className="inicio">
      <div className="inicio__layout">
        <BarraLateral onShowLogin={handleShowLogin} />
        <div className="inicio__main">
          <Encabezado ref={encabezadoRef} />
          <VistaStream streamerId={streamerId} onShowLogin={handleShowLogin} />
          {/* Stream page overlay (visible on page level) - viewers see animation but sound disabled */}
          <GiftOverlay gift={pageGift} visible={!!pageGift} onClose={() => setPageGift(null)} playSound={false} />
        </div>
      </div>
    </div>
  );
};

export default StreamPage;
