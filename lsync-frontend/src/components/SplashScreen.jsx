import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [phaseText, setPhaseText] = useState('Connecting your sources...');
  const [rippleActive, setRippleActive] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setProgress(45), 100);
    const t2 = setTimeout(() => {
      setRippleActive(true);
      setPhaseText('Mapping your skills...');
      setProgress(85);
    }, 850);
    const t3 = setTimeout(() => {
      setPhaseText('Portfolio ready!');
      setProgress(100);
    }, 1500);
    const t4 = setTimeout(() => setFadeOut(true), 2050);
    const t5 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2550);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0F071E] px-6 transition-all duration-500 ease-out select-none overflow-hidden ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <style>{`
        @keyframes mergeTopLeft {
          0% { transform: translate(-110px, -95px) scale(0.8) rotate(-25deg); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(0px, 0px) scale(0.3) rotate(0deg); opacity: 0; }
        }
        @keyframes mergeTopRight {
          0% { transform: translate(110px, -95px) scale(0.8) rotate(25deg); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(0px, 0px) scale(0.3) rotate(0deg); opacity: 0; }
        }
        @keyframes mergeBottomLeft {
          0% { transform: translate(-110px, 95px) scale(0.8) rotate(20deg); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(0px, 0px) scale(0.3) rotate(0deg); opacity: 0; }
        }
        @keyframes mergeBottomRight {
          0% { transform: translate(110px, 95px) scale(0.8) rotate(-20deg); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translate(0px, 0px) scale(0.3) rotate(0deg); opacity: 0; }
        }
        @keyframes centerPop {
          0% { transform: scale(0.75); opacity: 0; }
          55% { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shockwave {
          0% { transform: scale(0.8); opacity: 0.9; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        .node-tl { animation: mergeTopLeft 1.05s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .node-tr { animation: mergeTopRight 1.05s cubic-bezier(0.22, 1, 0.36, 1) 0.08s forwards; }
        .node-bl { animation: mergeBottomLeft 1.05s cubic-bezier(0.22, 1, 0.36, 1) 0.14s forwards; }
        .node-br { animation: mergeBottomRight 1.05s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards; }
        .logo-pop { animation: centerPop 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .shockwave-ring { animation: shockwave 1s ease-out forwards; }
      `}</style>

      {/* Ambient Background Blobs */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#7038C4]/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-[#EB577F]/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Center Kinetic Animation Stage */}
      <div className="relative flex flex-col items-center">
        
        {/* Shockwave Ring triggered when the 4 platforms merge into LSync */}
        {rippleActive && (
          <div className="absolute top-10 w-24 h-24 rounded-full border-2 border-[#F4A836]/70 shockwave-ring pointer-events-none" />
        )}

        {/* 4 Flying Platform Nodes Merging into the Logo */}
        <div className="relative w-32 h-28 flex items-center justify-center mb-4">
          <div className="absolute node-tl w-9 h-9 rounded-xl bg-white text-[#0056D2] font-black text-sm flex items-center justify-center shadow-lg">
            C
          </div>
          <div className="absolute node-tr w-9 h-9 rounded-xl bg-[#1A102F] border border-white/25 text-white font-black text-sm flex items-center justify-center shadow-lg">
            G
          </div>
          <div className="absolute node-bl w-9 h-9 rounded-xl bg-[#FFF9E6] text-[#F4A836] font-black text-sm flex items-center justify-center shadow-lg">
            Y
          </div>
          <div className="absolute node-br w-9 h-9 rounded-xl bg-[#D1FAE5] text-[#059669] font-black text-sm flex items-center justify-center shadow-lg">
            e
          </div>

          {/* Central Official LSync Logo */}
          <div className="relative z-10 logo-pop p-3 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(112,56,196,0.5)]">
            <img
              src="/lsync logo.jpeg"
              alt="LSync Logo"
              className="h-20 w-auto object-contain rounded-2xl"
            />
          </div>
        </div>

        {/* Brand Name + Dynamic Phase Text */}
        <h2 className="text-lg font-black tracking-widest uppercase text-[#FAF7F2] mb-1">
          L<span className="text-[#F4A836]">Sync</span>
        </h2>
        <p className="text-xs font-semibold tracking-wide text-[#FAF7F2]/75 mb-6 h-4 transition-all duration-300">
          {phaseText}
        </p>

        {/* Laser Shimmer Progress Bar with Glowing Tip */}
        <div className="w-64 sm:w-80 h-1.5 bg-white/10 rounded-full overflow-hidden p-[1px]">
          <div
            className="relative h-full rounded-full bg-gradient-to-r from-[#7038C4] via-[#EB577F] to-[#F4A836] transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          >
            {/* Glowing Spark Tip */}
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white blur-[2px] shadow-[0_0_12px_#F4A836]" />
          </div>
        </div>

      </div>
    </div>
  );
}