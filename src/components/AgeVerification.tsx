"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Props {
  onVerified: () => void;
}

export default function AgeVerification({ onVerified }: Props) {
  const [leaving, setLeaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadingOutRef = useRef(false);

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
        style={{ background: "radial-gradient(60% 50% at 50% 55%, rgba(255,255,255,0.04), transparent 60%)" }}
      />

      {/* Card */}
      <div className="pane-in relative w-full max-w-md">
        <div className="liquid-glass-card rounded-[28px] p-8 md:p-10 space-y-6 text-center">

          {/* Logo */}
          <div className="flex justify-center">
            <div className="liquid-glass rounded-full p-3">
              <Image src="/newlogo.png" alt="Huslen" width={32} height={32} />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1
              className="text-4xl text-white tracking-tight leading-[1.05]"
              style={{ fontFamily: "var(--font-instrument), serif" }}
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
