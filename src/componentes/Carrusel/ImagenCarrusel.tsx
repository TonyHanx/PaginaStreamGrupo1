import { useRef } from "react";
import "./ImagenCarrusel.css";

type Item = { id: string | number; src: string; alt?: string };

type Props = {
  items: Item[];
  itemWidth?: number;
  gap?: number;
};

export default function ImagenCarrusel({ items, itemWidth = 380, gap = 20 }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  const isPointerDown = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  const getNearestIndex = () => {
    const vp = viewportRef.current;
    if (!vp) return 0;
    const x = vp.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const dist = Math.abs(el.offsetLeft - x);
      if (dist < bestDist) { best = i; bestDist = dist; }
    });
    return best;
  };

  const scrollToIndex = (idx: number) => {
    const target = cardRefs.current[idx];
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  const goPrev = () => {
    const i = getNearestIndex();
    scrollToIndex(Math.max(0, i - 1));
  };

  const goNext = () => {
    const i = getNearestIndex();
    scrollToIndex(Math.min(items.length - 1, i + 1));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const vp = viewportRef.current!;
    isPointerDown.current = true;
    startX.current = e.clientX;
    startScroll.current = vp.scrollLeft;
    vp.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current) return;
    const vp = viewportRef.current!;
    const dx = e.clientX - startX.current;
    const pos = startScroll.current - dx;
    const max = Math.max(0, vp.scrollWidth - vp.clientWidth);
    vp.scrollLeft = Math.min(Math.max(0, pos), max);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDown.current = false;
    try { viewportRef.current?.releasePointerCapture(e.pointerId); } catch {}
    // Snap al más cercano por JS (sin depender del CSS)
    const idx = getNearestIndex();
    scrollToIndex(idx);
  };

  return (
    <>
      <h2 className="carrusel-title">
        Streams Recomendados
      </h2>
      <div className="ic-wrapper" style={{ position: 'relative' }}>
        <button className="ic-arrow ic-left" onClick={goPrev} aria-label="Anterior">‹</button>

        <div
          className="ic-viewport"
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          // Sin scroll-snap; smooth viene de CSS o scrollIntoView
          style={{ overflowX: "auto", minWidth: 0 }}
        >
          <div className="ic-track" style={{ gap, gridAutoColumns: `${itemWidth}px` }}>
            {items.map((it, idx) => (
              <div
                key={it.id}
                className="ic-card"
                ref={el => {
                  if (el) cardRefs.current[idx] = el;
                }}
                style={{ scrollSnapAlign: "start" }}
              >
                <div style={{marginTop: '24px'}}>
                  <img loading="lazy" src={it.src} alt={it.alt ?? ""} className="ic-img" />
                </div>
                <div className="ic-title">{it.alt ?? `Stream ${it.id}`}</div>
              </div>
            ))}
          </div>
        </div>

        <button className="ic-arrow ic-right" onClick={goNext} aria-label="Siguiente">›</button>
      </div>
    </>
  );
}
