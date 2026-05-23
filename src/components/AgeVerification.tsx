"use client";

import { useRef, useCallback, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Props {
  onVerified: () => void;
}

export default function AgeVerification({ onVerified }: Props) {
  const [leaving, setLeaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  const fadeVideoIn = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const video = videoRef.current;
    if (!video) return;
    const from = parseFloat(video.style.opacity || "0");
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / 600, 1);
      video.style.opacity = String(from + (1 - from) * t);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else rafRef.current = null;
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  const fadeVideoOut = useCallback(() => {
    if (fadingOutRef.current) return;
    fadingOutRef.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const video = videoRef.current;
    if (!video) return;
    const from = parseFloat(video.style.opacity || "1");
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / 500, 1);
      video.style.opacity = String(from * (1 - t));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else rafRef.current = null;
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("age_verified", "true");
    setLeaving(true);
    setTimeout(onVerified, 450);
  };

  const handleDecline = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <div
      className="fixed inset-0 z-[99998] flex flex-col items-center justify-center bg-black overflow-hidden px-6"
      style={{ transition: "opacity 450ms ease", opacity: leaving ? 0 : 1 }}
    >
      {/* Background video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4"
          autoPlay
          muted
          playsInline
          onTimeUpdate={() => {
            const v = videoRef.current;
            if (!v || fadingOutRef.current || !v.duration) return;
            if (v.duration - v.currentTime <= 0.55) fadeVideoOut();
          }}
          onEnded={() => {
            const v = videoRef.current;
            if (!v) return;
            v.style.opacity = "0";
            fadingOutRef.current = false;
            setTimeout(() => { v.currentTime = 0; v.play(); fadeVideoIn(); }, 100);
          }}
          onCanPlay={() => fadeVideoIn()}
          style={{ opacity: 0 }}
          className="absolute inset-0 w-full h-full object-cover translate-y-[17%]"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(60% 50% at 50% 55%, rgba(255,255,255,0.04), transparent 60%)" }}
      />

      {/* Card */}
      <div className="pane-in relative w-full max-w-md">
        <div className="liquid-glass-card rounded-[28px] p-8 md:p-10 space-y-6 text-center">

          {/* Logo */}
          <div className="flex justify-center">
            <div className="liquid-glass rounded-full p-3">
              <Image src="/newlogo.png" alt="Khuslen" width={32} height={32} />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1
              className="text-4xl text-white tracking-tight leading-[1.05]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Насны <em className="italic">баталгаа</em>.
            </h1>
            <p className="text-white/55 text-sm leading-relaxed">
              Энэ платформ нь зөвхөн <span className="text-white/80 font-medium">18</span> насанд хүрэгчдэд зориулагдсан. Та насны шаардлага хангаж байна уу?
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-1">
            <button
              onClick={handleAccept}
              className="group w-full rounded-full bg-white text-black py-3.5 px-6 text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
            >
              <span>Тийм, би 18+</span>
              <ArrowRight size={16} className="-mr-1 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={handleDecline}
              className="w-full rounded-full py-3.5 px-6 text-sm font-medium text-white/60 hover:text-white/80 transition-colors"
            >
              Үгүй, гарах
            </button>
          </div>

          <p className="text-[11px] text-white/25 tracking-wide">18+ · Зөвхөн насанд хүрэгчдэд</p>
        </div>
      </div>
    </div>
  );
}
