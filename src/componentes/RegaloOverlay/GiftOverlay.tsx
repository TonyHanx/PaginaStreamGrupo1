import React, { useEffect } from 'react';
import './GiftOverlay.css';

export interface GiftData {
  sender: string;
  nombre: string;
  icono: string;
  color?: string;
  precio?: number;
}

interface GiftOverlayProps {
  gift?: GiftData | null;
  visible: boolean;
  duration?: number; // ms
  onClose?: () => void;
  // play a short celebratory sound (WebAudio) — default true for streamer view
  playSound?: boolean;
}

const GiftOverlay: React.FC<GiftOverlayProps> = ({ gift = null, visible, duration = 3800, onClose, playSound = true }) => {
  useEffect(() => {
    if (!visible) return;

    // auto-dismiss
    const t = setTimeout(() => onClose?.(), duration);

    // small celebratory sound using WebAudio (no external files)
    let audioCtx: any = null;
    try {
      if (playSound !== false && typeof window !== 'undefined' && (window as any).AudioContext) {
        try {
          audioCtx = new (window as any).AudioContext();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.02);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          // little arpeggio
          osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.12);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
          setTimeout(() => {
            try { osc.stop(); audioCtx.close(); } catch { /* ignore */ }
          }, 450);
        } catch { /* ignore noisy browsers */ }
      }
    } catch {
      // fail silently on older browsers
    }

    return () => {
      clearTimeout(t);
      try { if (audioCtx) audioCtx.close?.(); } catch {}
    };
  }, [visible, duration, onClose, playSound]);

  if (!visible || !gift) return null;

  return (
    <div className="gift-overlay" role="status" aria-live="polite">
      <div
        className="gift-overlay__card gift-overlay__card--streamer"
        style={{ borderImage: `linear-gradient(90deg, ${gift.color || '#FFD700'}, #9b59b6) 1` }}
      >
        <div className="gift-overlay__icon-wrap">
          <div className="gift-overlay__icon-bg" style={{ boxShadow: `0 8px 30px ${gift.color || '#ffd70088'}` }}>
            <div className="gift-overlay__icon">
              {gift.icono?.startsWith('http') ? (
                <img 
                  src={gift.icono} 
                  alt={gift.nombre}
                  style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><text y="70" font-size="64">🎁</text></svg>';
                  }}
                />
              ) : (
                gift.icono
              )}
            </div>
          </div>
        </div>

        <div className="gift-overlay__content">
          <div className="gift-overlay__title">¡Nuevo regalo!</div>
          <div className="gift-overlay__message">
            <strong className="gift-overlay__sender">{gift.sender}</strong>
            <span className="gift-overlay__text"> te regaló</span>
            <span className="gift-overlay__gift-name" style={{ color: gift.color || '#fff' }}>
              {' '}
              {gift.icono?.startsWith('http') ? (
                <img 
                  src={gift.icono} 
                  alt={gift.nombre}
                  style={{ width: '24px', height: '24px', objectFit: 'contain', verticalAlign: 'middle', display: 'inline' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><text y="20" font-size="18">🎁</text></svg>';
                  }}
                />
              ) : (
                gift.icono
              )}
              {' '}{gift.nombre}
            </span>
          </div>
        </div>

        <div className="gift-overlay__accent" aria-hidden>
          <div className="gift-overlay__sparkles" />
        </div>

        <button className="gift-overlay__close" onClick={onClose} aria-label="Cerrar">×</button>

        {/* decorative confetti pieces */}
        <div className="gift-overlay__confetti--particles" aria-hidden>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className={`c${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GiftOverlay;
