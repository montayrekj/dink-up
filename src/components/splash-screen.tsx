'use client';

import { useEffect, useRef, useState } from 'react';
import PickleballIcon from './pickleball-icon';

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false);
  const dismissed = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  function dismiss() {
    if (dismissed.current) return;
    dismissed.current = true;
    setFading(true);
    setTimeout(() => onDoneRef.current(), 500);
  }

  useEffect(() => {
    const t = setTimeout(dismiss, 3600);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#07101e] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 cursor-pointer select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      onClick={dismiss}
    >
      {/* Faint pickleball court lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-8 right-8 h-px bg-white/[0.07]" style={{ top: '18%' }} />
        <div className="absolute left-6 right-6 h-px bg-white/[0.05]" style={{ top: '34%' }} />
        <div className="absolute left-0 right-0 h-px bg-white/[0.1]"  style={{ top: '50%' }} />
        <div className="absolute left-6 right-6 h-px bg-white/[0.05]" style={{ top: '66%' }} />
        <div className="absolute left-8 right-8 h-px bg-white/[0.07]" style={{ top: '82%' }} />
      </div>

      {/* Ball + shadow container — shadow sits at floor (bottom), ball animates from above */}
      <div className="relative" style={{ width: '6rem', height: '6rem' }}>
        <div
          className="splash-shadow absolute bottom-0"
          style={{ width: '80px', height: '12px', left: 'calc(50% - 40px)' }}
        />
        <div className="splash-ball-pos absolute inset-0">
          <div className="splash-ball-squish w-full h-full">
            <PickleballIcon className="w-full h-full text-yellow-400" />
          </div>
        </div>
      </div>

      <div className="splash-text mt-8 text-center">
        <h1 className="text-white font-black text-5xl tracking-widest uppercase">
          Dink Up
        </h1>
        <p className="text-slate-500 text-sm mt-3 tracking-wider">tap to play</p>
      </div>
    </div>
  );
}
