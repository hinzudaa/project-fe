"use client";
import { useState } from "react";
import { Lock, Crown } from "lucide-react";

export default function LikesPage() {
  const [activeTab, setActiveTab] = useState<"liked_you" | "you_liked">("liked_you");
  const isPremium = false; // Mock state

  const mockUsers = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    name: "Нууцлаг хэрэглэгч",
    age: 20 + (i % 5),
    time: "2 цагийн өмнө",
    img: `https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80`
  }));

  return (
    <div className="max-w-[860px] mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-[28px] font-black font-serif mb-2 leading-tight">
          Таалагдсан
        </h1>
        <p className="text-text-secondary text-[15px]">
          Хэн таныг сонирхож байгааг эндээс хараарай.
        </p>
      </div>

      <div className="flex gap-2 mb-8 p-1 bg-bg-secondary rounded-xl border border-white/[0.05] w-max">
        <button
          onClick={() => setActiveTab("liked_you")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "liked_you" 
              ? "bg-[rgba(232,65,90,0.15)] text-[#e8415a]" 
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          Танд таалагдсан (12)
        </button>
        <button
          onClick={() => setActiveTab("you_liked")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "you_liked" 
              ? "bg-[rgba(232,65,90,0.15)] text-[#e8415a]" 
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          Надад таалагдсан (5)
        </button>
      </div>

      {!isPremium && activeTab === "liked_you" && (
        <div className="mb-8 rounded-2xl p-6 relative overflow-hidden border border-[#e8b850]/30"
          style={{ background: "linear-gradient(135deg, rgba(232,184,80,0.1) 0%, rgba(12,9,25,0.8) 100%)" }}>
          <div className="absolute right-0 top-0 w-48 h-48 pointer-events-none"
            style={{ background: "radial-gradient(circle at 75% 25%, rgba(232,184,80,0.15) 0%, transparent 65%)" }} />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-5">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#e8b850]/20 border border-[#e8b850]/40 shrink-0">
              <Crown size={28} className="text-[#e8b850]" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Premium эрхтэйгээр нээх</h3>
              <p className="text-[14px] text-text-secondary">
                Таныг сонирхсон хүмүүсийн зургийг тод харж, шууд холбогдох боломжтой болно.
              </p>
            </div>
            <button className="whitespace-nowrap px-6 py-3 rounded-xl font-bold text-black text-sm transition-transform hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #e8b850, #d4a03c)", boxShadow: "0 4px 16px rgba(232,184,80,0.3)" }}>
              Premium авах
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockUsers.map((u, i) => {
          const blurred = !isPremium && activeTab === "liked_you";
          return (
            <div key={i} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-bg-elevated border border-white/[0.05]">
              <img 
                src={u.img} 
                alt="user" 
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${blurred ? 'blur-xl opacity-60' : 'opacity-90'}`} 
              />
              
              {blurred && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center mb-2 border border-white/10">
                    <Lock size={18} className="text-white/80" />
                  </div>
                  <span className="text-[13px] font-semibold text-white/90">{u.name}</span>
                </div>
              )}

              {!blurred && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <span className="text-sm font-bold text-white mb-0.5">{u.name}, {u.age}</span>
                  <span className="text-[11px] text-white/60">{u.time}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
