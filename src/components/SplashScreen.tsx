"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

export default function SplashScreen({ onDone }: { onDone?: () => void } = {}) {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  const fadeVideoIn = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const video = videoRef.current;
    if (!video) return;
    const startOpacity = parseFloat(video.style.opacity || "0");
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / 600, 1);
      video.style.opacity = String(startOpacity + (1 - startOpacity) * progress);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      else rafRef.current = null;
    };
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const fadeVideoOut = useCallback(() => {
    if (fadingOutRef.current) return;
    fadingOutRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const video = videoRef.current;
    if (!video) return;
    const startOpacity = parseFloat(video.style.opacity || "1");
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / 500, 1);
      video.style.opacity = String(startOpacity * (1 - progress));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
      else rafRef.current = null;
    };
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || fadingOutRef.current || !video.duration) return;
    if (video.duration - video.currentTime <= 0.55) fadeVideoOut();
  }, [fadeVideoOut]);

  const handleEnded = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.style.opacity = "0";
    fadingOutRef.current = false;
    setTimeout(() => {
      video.currentTime = 0;
      video.play();
      fadeVideoIn();
    }, 100);
  }, [fadeVideoIn]);

  useEffect(() => {
    const out = setTimeout(() => setFadeOut(true), 2400);
    const remove = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 2900);
    return () => {
      clearTimeout(out);
      clearTimeout(remove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden"
      style={{ transition: "opacity 500ms ease", opacity: fadeOut ? 0 : 1 }}
    >
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4"
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onCanPlay={() => fadeVideoIn()}
          style={{ opacity: 0 }}
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
          <Image src="/newlogo.png" alt="Khuslen" width={40} height={40} />
        </div>
        <h1
          className="text-5xl text-white tracking-tight leading-none"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Khuslen
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
