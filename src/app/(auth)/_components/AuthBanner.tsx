"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    img: "/banner1.jpg",
    name: "Oyunaa", age: 25, match: 94,
    quote: "Жинхэнэ холболтыг хайж байна...",
    interests: ["Хөгжим", "Аялал", "Бичлэг"],
    accent: "#e04878",
  },
  {
    img: "/banner2.jpg",
    name: "Enkhjin", age: 23, match: 88,
    quote: "Roleplay-д хамтрагч хайж байна",
    interests: ["Уран зохиол", "Roleplay", "Кафе"],
    accent: "#9b59ff",
  },
  {
    img: "/banner3.jpg",
    name: "Suvd", age: 27, match: 91,
    quote: "Нууцлалтай танилцахыг хүсч байна",
    interests: ["Кафе", "Бичлэг", "Спорт"],
    accent: "#e8b850",
  },
];

export default function AuthBanner() {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % SLIDES.length);
        setAnimating(false);
      }, 400);
    }, 3800);
    return () => clearInterval(t);
  }, []);

  const s = SLIDES[idx];

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0c0915]">

      {/* Background images */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.img}
          className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={slide.img}
            alt=""
            fill
            className="object-cover scale-[1.06] blur-[20px]"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(4,2,8,1)_0%,rgba(4,2,8,0.4)_50%,transparent_100%)]" />

      {/* Logo — shown on both sizes */}
      <div className="absolute top-5 left-5 flex items-center gap-2.5 z-10">
        <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
          <Image src="/newlogo.png" alt="" width={36} height={36} className="object-cover" />
        </div>
        <span className="text-[15px] font-bold font-serif text-white drop-shadow-md">Huslen</span>
      </div>

      {/* Slide dots — top right */}
      <div className="absolute top-6 right-5 flex items-center gap-1.5 z-10">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-400"
            style={{
              width: i === idx ? 18 : 5,
              height: 5,
              background: i === idx ? s.accent : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>

      {/* Mobile bottom info */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 p-5 z-10">
        <div
          className={`transition-all duration-400 ${animating ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}
        >
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-2.5 text-[10px] font-bold backdrop-blur-sm"
            style={{ background: `${s.accent}22`, border: `1px solid ${s.accent}55`, color: s.accent }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.accent }} />
            {s.match}% нийцтэй
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-serif font-black text-white text-xl leading-none">{s.name}</span>
            <span className="text-white/50 text-sm">{s.age}</span>
          </div>
          <p className="text-white/60 text-[11px] italic font-serif line-clamp-1">&ldquo;{s.quote}&rdquo;</p>
        </div>
      </div>

      {/* Desktop bottom info */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 px-9 pb-10 z-10">
        <div
          className={`transition-all duration-400 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
        >
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4 text-[11px] font-bold backdrop-blur-sm"
            style={{ background: `${s.accent}22`, border: `1px solid ${s.accent}55`, color: s.accent }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.accent }} />
            {s.match}% нийцтэй
          </div>

          <div className="flex items-baseline gap-3 mb-3">
            <h3 className="font-serif font-black text-white leading-none text-[38px]">{s.name}</h3>
            <span className="text-white/45 text-xl font-light">{s.age}</span>
          </div>

          <p className="text-white/65 text-[14px] italic font-serif leading-relaxed mb-4">
            &ldquo;{s.quote}&rdquo;
          </p>

          <div className="flex gap-2 flex-wrap">
            {s.interests.map(t => (
              <span
                key={t}
                className="px-3 py-1 rounded-full text-[11px] font-medium text-white/70 backdrop-blur-sm bg-white/[0.08] border border-white/[0.12]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
