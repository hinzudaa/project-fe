"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function SplashScreen({ onDone }: { onDone?: () => void } = {}) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fadingOutRef = useRef(false);

  useEffect(() => {
    const out = setTimeout(() => setFadeOut(true), 2400);
    const remove = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 2900);
    return () => {
      clearTimeout(out);
      clearTimeout(remove);
    };
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden"
      style={{ transition: "opacity 500ms ease", opacity: fadeOut ? 0 : 1 }}
    >
      {/* Background video — opacity fades via CSS transition (compositor), no per-frame JS */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src="https://myvideosgg.b-cdn.net/2a76c1a8-dde3-4812-9836-99231a70c19c.mp4"
          autoPlay
          muted
          playsInline
          onCanPlay={() => {
            fadingOutRef.current = false;
            if (videoRef.current) videoRef.current.style.opacity = "1";
          }}
          onTimeUpdate={() => {
            const v = videoRef.current;
            if (!v || fadingOutRef.current || !v.duration) return;
            if (v.duration - v.currentTime <= 0.55) {
              fadingOutRef.current = true;
              v.style.opacity = "0";
            }
          }}
          onEnded={() => {
            const v = videoRef.current;
            if (!v) return;
            fadingOutRef.current = false;
            v.currentTime = 0;
            v.play();
            v.style.opacity = "1";
          }}
          style={{ opacity: 0, transition: "opacity 500ms ease" }}
          className="absolute inset-0 w-full h-full object-cover translate-y-[17%]"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(50% 40% at 50% 50%, rgba(255,255,255,0.05), transparent 70%)",
        }}
      />

      {/* Brand */}
      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="liquid-glass rounded-full p-4">
          <Image src="/newlogo.png" alt="Huslen" width={40} height={40} />
        </div>
        <h1
          className="text-5xl text-white tracking-tight leading-none"
          style={{ fontFamily: "var(--font-instrument), serif" }}
        >
          Huslen
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-1 h-1 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: "0ms" }} />
          <div className="w-1 h-1 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: "200ms" }} />
          <div className="w-1 h-1 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: "400ms" }} />
        </div>
      </div>
    </div>
  );
}
