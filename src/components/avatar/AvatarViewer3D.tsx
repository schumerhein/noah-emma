'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { RotateCw, Loader2 } from 'lucide-react';

type ViewAngle = 'front' | 'back';
type AnimPhase = 'idle' | 'out' | 'in';

interface AvatarViewer3DProps {
  /** Voorkant compositie als dataUrl */
  frontComposite: string | null;
  /** Achterkant compositie als dataUrl */
  backComposite: string | null;
  /** True terwijl composities worden gegenereerd */
  isGenerating?: boolean;
  /** Naam van de avatar voor labels */
  avatarName: string;
  /** Extra CSS class op de container */
  className?: string;
}

/**
 * 3D-rotatieviewer voor Noah/Emma avatar met kledingstuk.
 * Toont voorkant én achterkant met een soepele perspective-flip animatie.
 * Klik de rotatie-knop of swipe links/rechts om om te draaien.
 */
export function AvatarViewer3D({
  frontComposite,
  backComposite,
  isGenerating = false,
  avatarName,
  className = '',
}: AvatarViewer3DProps) {
  const [angle, setAngle] = useState<ViewAngle>('front');
  const [phase, setPhase] = useState<AnimPhase>('idle');
  /** De afbeelding die OP DIT MOMENT gerenderd wordt (wisselt mid-animatie) */
  const [displayedImg, setDisplayedImg] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const phaseRef = useRef<AnimPhase>('idle');
  phaseRef.current = phase;

  // Update displayedImg wanneer de composities binnenkomen
  useEffect(() => {
    if (angle === 'front' && frontComposite) setDisplayedImg(frontComposite);
    if (angle === 'back' && backComposite) setDisplayedImg(backComposite);
  }, [angle, frontComposite, backComposite]);

  /** Voer de flip-animatie uit naar het andere aanzicht */
  const flip = useCallback((targetAngle: ViewAngle | undefined = undefined) => {
    if (phaseRef.current !== 'idle') return;
    const next: ViewAngle = targetAngle ?? (angle === 'front' ? 'back' : 'front');
    if (next === angle) return;

    const nextImg = next === 'front' ? frontComposite : backComposite;
    if (!nextImg) return; // nog niet klaar

    setPhase('out');
    setTimeout(() => {
      setAngle(next);
      setDisplayedImg(nextImg);
      setPhase('in');
      setTimeout(() => setPhase('idle'), 280);
    }, 220);
  }, [angle, frontComposite, backComposite]);

  // Auto-rotate
  useEffect(() => {
    clearInterval(autoRef.current);
    if (autoRotate && frontComposite && backComposite) {
      autoRef.current = setInterval(() => flip(undefined), 2800);
    }
    return () => clearInterval(autoRef.current);
  }, [autoRotate, frontComposite, backComposite, flip]);

  // Swipe-detectie
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) flip(dx < 0 ? 'back' : 'front');
    touchStartX.current = null;
  };

  // CSS transform op basis van animatiefase
  const getTransform = () => {
    if (phase === 'out') return 'perspective(700px) rotateY(90deg)';
    if (phase === 'in') return 'perspective(700px) rotateY(-90deg)';
    return 'perspective(700px) rotateY(0deg)';
  };
  const getTransition = () => {
    if (phase === 'idle') return 'transform 280ms cubic-bezier(0.22,1,0.36,1)';
    if (phase === 'out') return 'transform 220ms cubic-bezier(0.55,0,1,0.45)';
    return 'transform 280ms cubic-bezier(0.22,1,0.36,1)';
  };

  const currentComposite = angle === 'front' ? frontComposite : backComposite;
  const bothReady = !!(frontComposite && backComposite);

  return (
    <div
      className={`relative w-full h-full ${className}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Hoofd-afbeelding met 3D-flip animatie */}
      <div
        style={{
          transform: getTransform(),
          transition: getTransition(),
          transformOrigin: 'center center',
          width: '100%',
          height: '100%',
          willChange: 'transform',
        }}
      >
        {displayedImg ? (
          <Image
            src={displayedImg}
            alt={`${avatarName} ${angle === 'front' ? 'voorkant' : 'achterkant'}`}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#f0f4ff] to-[#eef2fb]" />
        )}
      </div>

      {/* Generating spinner overlay */}
      {(isGenerating || (!currentComposite && !isGenerating)) && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-pink-400 animate-spin" />
          <p className="text-sm font-bold text-slate-500">
            {avatarName} wordt toegevoegd…
          </p>
        </div>
      )}

      {/* Aanzicht-label (linksbovenin) */}
      {currentComposite && !isGenerating && (
        <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white/80 inline-block" />
          {angle === 'front' ? 'Voorkant' : 'Achterkant'}
        </div>
      )}

      {/* Draaien-knop (rechtsonderhoek) */}
      {bothReady && (
        <button
          onClick={() => flip()}
          onDoubleClick={() => setAutoRotate(p => !p)}
          title="Draaien (dubbelklik voor auto-rotate)"
          className={`
            absolute bottom-14 right-3 w-11 h-11 rounded-full shadow-lg
            flex items-center justify-center transition-all active:scale-90
            ${autoRotate
              ? 'bg-primary text-white shadow-primary/40'
              : 'bg-white/90 backdrop-blur-sm text-slate-700'}
          `}
        >
          <RotateCw className={`w-5 h-5 ${autoRotate ? 'animate-spin' : ''}`}
            style={autoRotate ? { animationDuration: '2s' } : {}} />
        </button>
      )}

      {/* Indicator dots (voor / achter) */}
      {bothReady && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {(['front', 'back'] as ViewAngle[]).map(a => (
            <button
              key={a}
              onClick={() => flip(a)}
              className={`
                rounded-full transition-all duration-300
                ${a === angle
                  ? 'w-5 h-2 bg-white shadow-sm'
                  : 'w-2 h-2 bg-white/45 hover:bg-white/70'}
              `}
              title={a === 'front' ? 'Voorkant' : 'Achterkant'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
