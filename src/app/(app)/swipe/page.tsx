"use client";
import { useState } from "react";
import { X, Heart, Star, MapPin, Zap } from "lucide-react";

const PROFILES = [
  {
    name: "Oyunaa", age: 25, city: "Улаанбаатар",
    bio: "Хөгжим, аялал дуртай. Жинхэнэ яриа хайж байна.",
    interests: ["Хөгжим", "Аялал", "Кино"],
    match: 94,
    avatar: "О",
    bg: "linear-gradient(160deg, #6b1528 0%, #2a0814 60%, #0d0408 100%)",
    glow: "rgba(220,80,100,0.25)",
    avatarFrom: "#c22d50", avatarTo: "#7a0f20",
  },
  {
    name: "Tsetseg", age: 23, city: "Дархан",
    bio: "Уран зохиол болон roleplay-д дуртай. Дуртай дүрүүдийн тухай ярих хамтрагч хайж байна.",
    interests: ["Уран зохиол", "Roleplay", "Кафе"],
    match: 88,
    avatar: "Ц",
    bg: "linear-gradient(160deg, #3a1060 0%, #120820 60%, #060210 100%)",
    glow: "rgba(160,100,240,0.25)",
    avatarFrom: "#9b59ff", avatarTo: "#4a1888",
  },
  {
    name: "Narantsetseg", age: 28, city: "Улаанбаатар",
    bio: "Нийслэлд амьдардаг, кино, хооллохыг дуртай. Инээмсэглэл чухал!",
    interests: ["Кино", "Хоол", "Спорт"],
    match: 81,
    avatar: "Н",
    bg: "linear-gradient(160deg, #5a3010 0%, #1a0c08 60%, #0a0504 100%)",
    glow: "rgba(220,150,60,0.22)",
    avatarFrom: "#e8b850", avatarTo: "#8a5510",
  },
  {
    name: "Enkhjargal", age: 24, city: "Эрдэнэт",
    bio: "IT мэргэжилтэй, тоглоом болон аниме дуртай. Хамт тоглох хүн хайж байна.",
    interests: ["Тоглоом", "Аниме", "Технологи"],
    match: 76,
    avatar: "Э",
    bg: "linear-gradient(160deg, #0e4028 0%, #040e0a 60%, #020806 100%)",
    glow: "rgba(60,200,120,0.2)",
    avatarFrom: "#3cc878", avatarTo: "#0d5428",
  },
];

export default function SwipePage() {
  const [cardIdx, setCardIdx] = useState(0);
  const [swipeDir, setSwipeDir] = useState<null | "left" | "right">(null);
  const [matched, setMatched] = useState(false);

  const profile = PROFILES[cardIdx % PROFILES.length];
  const nextProfile = PROFILES[(cardIdx + 1) % PROFILES.length];

  const swipe = (dir: "left" | "right") => {
    if (swipeDir) return;
    setSwipeDir(dir);
    if (dir === "right" && Math.random() > 0.4) {
      setTimeout(() => { setMatched(true); setSwipeDir(null); }, 420);
    } else {
      setTimeout(() => { setCardIdx(i => i + 1); setSwipeDir(null); }, 420);
    }
  };

  return (
    <div className="max-w-[480px] mx-auto flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-serif text-[22px] font-bold">Танилц</h1>
          <p className="text-text-muted text-[12px]">AI-ийн санал болгосон хүмүүс</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
          style={{ background: "rgba(232,65,90,0.1)", border: "1px solid rgba(232,65,90,0.25)", color: "#e8415a" }}>
          <Zap size={11} strokeWidth={2.5} />
          {PROFILES.length * 3} хүлээж байна
        </div>
      </div>

      {/* Match modal */}
      {matched && (
        <>
          <style>{`
            @keyframes matchModalIn {
              from { opacity: 0; transform: scale(0.75) translateY(24px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes matchAvatarPop {
              0%   { opacity: 0; transform: scale(0) rotate(-12deg); }
              65%  { transform: scale(1.12) rotate(3deg); opacity: 1; }
              100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
            @keyframes matchRingPulse {
              0%   { transform: scale(1); opacity: 0.7; }
              100% { transform: scale(2.8); opacity: 0; }
            }
            @keyframes matchHeartBeat {
              0%, 100% { transform: scale(1); }
              30%  { transform: scale(1.25); }
              60%  { transform: scale(0.92); }
              80%  { transform: scale(1.1); }
            }
            @keyframes matchHeartFloat {
              0%   { opacity: 0; transform: translateY(0) scale(0.6) rotate(var(--r)); }
              15%  { opacity: 1; }
              85%  { opacity: 0.5; }
              100% { opacity: 0; transform: translateY(-220px) scale(1.2) rotate(var(--r)); }
            }
            @keyframes matchTextUp {
              from { opacity: 0; transform: translateY(10px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-[14px] p-5 overflow-hidden"
            style={{ background: "rgba(4,2,10,0.88)" }}>

            {/* Floating hearts */}
            {[
              { l: "8%",  d: 0,    r: "-15deg", dur: 2.8 },
              { l: "20%", d: 0.4,  r: "10deg",  dur: 3.1 },
              { l: "35%", d: 0.15, r: "-5deg",  dur: 2.5 },
              { l: "50%", d: 0.6,  r: "20deg",  dur: 3.3 },
              { l: "63%", d: 0.25, r: "-12deg", dur: 2.7 },
              { l: "77%", d: 0.5,  r: "8deg",   dur: 3.0 },
              { l: "88%", d: 0.1,  r: "-20deg", dur: 2.9 },
            ].map((h, i) => (
              <div key={i} className="absolute bottom-[12%] text-[20px] pointer-events-none select-none"
                style={{
                  left: h.l,
                  ["--r" as string]: h.r,
                  animation: `matchHeartFloat ${h.dur}s ease-out ${h.d}s infinite`,
                }}>❤️</div>
            ))}

            {/* Modal card */}
            <div className="rounded-[32px] px-8 py-10 text-center w-full max-w-[340px] relative z-10"
              style={{
                background: "rgba(10,6,22,0.98)",
                border: "1px solid rgba(232,65,90,0.28)",
                boxShadow: "0 0 80px rgba(200,37,74,0.22), 0 24px 60px rgba(0,0,0,0.6)",
                animation: "matchModalIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
              }}>

              {/* Avatars row */}
              <div className="flex items-center justify-center gap-3 mb-7">
                <div className="w-[66px] h-[66px] rounded-full flex items-center justify-center text-[26px] font-black text-white"
                  style={{
                    background: "linear-gradient(135deg, #e8415a, #9e1838)",
                    boxShadow: "0 4px 24px rgba(200,37,74,0.55)",
                    animation: "matchAvatarPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.15s both",
                  }}>М</div>

                {/* Pulsing heart center */}
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full"
                    style={{ background: "rgba(232,65,90,0.35)", animation: "matchRingPulse 1.3s ease-out 0.6s infinite" }} />
                  <div className="absolute inset-0 rounded-full"
                    style={{ background: "rgba(232,65,90,0.2)", animation: "matchRingPulse 1.3s ease-out 0.9s infinite" }} />
                  <div className="w-10 h-10 rounded-full flex items-center justify-center relative z-10"
                    style={{
                      background: "linear-gradient(135deg, #e8415a, #e8b850)",
                      boxShadow: "0 0 24px rgba(232,65,90,0.8)",
                      animation: "matchHeartBeat 1.1s ease-in-out 0.7s infinite",
                    }}>
                    <Heart size={17} fill="white" strokeWidth={0} />
                  </div>
                </div>

                <div className="w-[66px] h-[66px] rounded-full flex items-center justify-center text-[26px] font-black text-white"
                  style={{
                    background: `linear-gradient(135deg, ${profile.avatarFrom}, ${profile.avatarTo})`,
                    boxShadow: `0 4px 24px ${profile.glow}`,
                    animation: "matchAvatarPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s both",
                  }}>
                  {profile.avatar}
                </div>
              </div>

              <h2 className="font-serif text-[28px] font-black mb-2"
                style={{ color: "#e8415a", animation: "matchTextUp 0.45s ease-out 0.45s both" }}>
                Match болсон!
              </h2>
              <p className="text-text-secondary text-[14px] mb-7 leading-relaxed"
                style={{ animation: "matchTextUp 0.45s ease-out 0.6s both" }}>
                Та болон <strong className="text-white">{profile.name}</strong> хоёр бие биедээ таалагдсан байна.
              </p>
              <div className="flex gap-2.5"
                style={{ animation: "matchTextUp 0.45s ease-out 0.8s both" }}>
              <button onClick={() => { setMatched(false); setCardIdx(i => i + 1); }}
                className="flex-1 py-3 rounded-[14px] text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                Үргэлжлүүлэх
              </button>
              <button onClick={() => setMatched(false)}
                className="flex-1 py-3 rounded-[14px] text-[13px] font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #e8415a, #9e1838)", boxShadow: "0 4px 20px rgba(200,37,74,0.4)" }}>
                Мессеж
              </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Card stack */}
      <div className="relative mb-5" style={{ height: "clamp(420px, 62vh, 560px)" }}>

        {/* Back card */}
        <div className="absolute inset-0 rounded-[28px] overflow-hidden"
          style={{
            transform: "scale(0.93) translateY(20px)",
            transformOrigin: "bottom center",
            background: nextProfile.bg,
            zIndex: 1,
          }} />

        {/* Front card */}
        <div className="absolute inset-0 rounded-[28px] overflow-hidden cursor-grab active:cursor-grabbing"
          style={{
            zIndex: 2,
            background: profile.bg,
            transform: swipeDir === "left"
              ? "translateX(-150%) rotate(-20deg)"
              : swipeDir === "right"
              ? "translateX(150%) rotate(20deg)"
              : "none",
            transition: swipeDir ? "transform 0.42s cubic-bezier(0.25,0.46,0.45,0.94)" : "none",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          }}>

          {/* Top ambient glow */}
          <div className="absolute top-0 left-0 right-0 h-[65%] pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 30%, ${profile.glow} 0%, transparent 65%)` }} />

          {/* Avatar */}
          <div className="absolute top-0 left-0 right-0 h-[62%] flex items-center justify-center">
            <div className="w-28 h-28 rounded-full flex items-center justify-center text-[52px] font-black text-white"
              style={{
                background: `linear-gradient(135deg, ${profile.avatarFrom}, ${profile.avatarTo})`,
                boxShadow: `0 0 0 4px rgba(255,255,255,0.08), 0 8px 40px ${profile.glow}`,
              }}>
              {profile.avatar}
            </div>
          </div>

          {/* Match badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-[10px]"
            style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Zap size={11} strokeWidth={2.5} style={{ color: "#3cc878" }} />
            <span className="text-[12px] font-bold" style={{ color: "#3cc878" }}>{profile.match}%</span>
          </div>

          {/* Swipe stamps */}
          {swipeDir === "left" && (
            <div className="absolute top-6 left-5 px-4 py-1.5 rounded-xl rotate-[-12deg]"
              style={{ background: "rgba(200,37,74,0.85)", border: "2px solid rgba(232,65,90,0.8)" }}>
              <span className="font-black text-[18px] text-white tracking-widest">ҮГҮЙ</span>
            </div>
          )}
          {swipeDir === "right" && (
            <div className="absolute top-6 right-5 px-4 py-1.5 rounded-xl rotate-[12deg]"
              style={{ background: "rgba(30,140,70,0.85)", border: "2px solid rgba(60,200,120,0.8)" }}>
              <span className="font-black text-[18px] text-white tracking-widest">ТИЙМ</span>
            </div>
          )}

          {/* Bottom info overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-6"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 60%, transparent 100%)" }}>
            <div className="flex items-baseline gap-2 mb-1">
              <h2 className="font-serif text-[26px] font-black text-white leading-none">{profile.name}</h2>
              <span className="text-[18px] text-white/60 font-light">{profile.age}</span>
            </div>
            <div className="flex items-center gap-1 text-white/50 text-[12px] mb-3">
              <MapPin size={11} strokeWidth={2} />
              <span>{profile.city}</span>
            </div>
            <p className="text-[13px] text-white/70 leading-relaxed mb-4 line-clamp-2">{profile.bio}</p>
            <div className="flex gap-2 flex-wrap">
              {profile.interests.map(t => (
                <span key={t} className="px-3 py-1 rounded-full text-[11px] font-medium text-white/70"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6 pb-4">
        <button onClick={() => swipe("left")}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: "rgba(232,65,90,0.1)", border: "1.5px solid rgba(232,65,90,0.35)", boxShadow: "0 4px 16px rgba(232,65,90,0.15)" }}>
          <X size={22} strokeWidth={2.5} style={{ color: "#e8415a" }} />
        </button>

        <button onClick={() => swipe("right")}
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: "linear-gradient(135deg, #e8415a, #9e1838)", boxShadow: "0 6px 30px rgba(200,37,74,0.55)" }}>
          <Heart size={30} fill="white" strokeWidth={0} />
        </button>

        <button className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: "rgba(232,184,80,0.1)", border: "1.5px solid rgba(232,184,80,0.35)", boxShadow: "0 4px 16px rgba(232,184,80,0.15)" }}>
          <Star size={22} strokeWidth={2} style={{ color: "#e8b850" }} />
        </button>
      </div>

    </div>
  );
}
