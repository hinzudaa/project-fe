"use client";
import Link from "next/link";
import { useState } from "react";
import { Heart, Shuffle, Mail, Flame, Trophy, Wand2, Users, Gamepad2, Zap, Sparkles, Lock } from "lucide-react";

const ACTIVITIES = [
  { user: "Oyunaa_96", action: "Таны профайлыг үзсэн", time: "2 мин өмнө", avatar: "О", color: "#c22d50" },
  { user: "Badamkhand", action: "Таны зурганд super-like дарсан", time: "15 мин өмнө", avatar: "Б", color: "#c48830" },
  { user: "Tulgaa_88", action: "Match болсон", time: "1 цаг өмнө", avatar: "Т", color: "#1f9e60" },
  { user: "Narantsetseg", action: "Forum-д хариулт өгсөн", time: "3 цаг өмнө", avatar: "Н", color: "#1d60bb" },
];

const HOT_TOPICS = [
  { title: "Улаанбаатар дахь шөнийн амьдрал", replies: 142, hot: true },
  { title: "Roleplay-д хамтрагч хайж байна — уран зохиол", replies: 89 },
  { title: "Энэ долоо хоногийн mini-game рейтинг", replies: 67 },
  { title: "Аялалын нөхөр хайж байна — Хөвсгөл", replies: 54 },
];

const ONLINE_USERS = [
  { name: "Suvd_01", tag: "Swipe ready", color: "#c22d50" },
  { name: "Enkhjin", tag: "Roleplay", color: "#8b4fd4" },
  { name: "Batbold_93", tag: "Чатад", color: "#1f9e60" },
  { name: "Munkhzul", tag: "Forum", color: "#c48830" },
  { name: "Gantulga", tag: "Тоглоом", color: "#1d60bb" },
];

const LEADERBOARD = [
  { rank: 1, name: "Tsetseg_lit", score: 2840, badge: "Roleplay writer" },
  { rank: 2, name: "munkh_22", score: 2410, badge: "Streak master" },
  { rank: 3, name: "Oyunaa_96", score: 1987, badge: "Top swiper" },
];

const DAILY_CHALLENGES = [
  { label: "1 Swipe хийх", reward: "Streak хадгалах", done: true },
  { label: "Forum-д бичлэг нийтлэх", reward: "Badge олгох", done: false },
  { label: "Roleplay эхлэх", reward: "Нэмэлт unlock", done: false },
];

const STATS = [
  { icon: Shuffle, label: "Шинэ swipe", value: "14", color: "#e8415a" },
  { icon: Heart, label: "Match", value: "7", color: "#e8415a" },
  { icon: Mail, label: "Уншаагүй", value: "3", color: "#a06de0" },
  { icon: Flame, label: "Streak", value: "×12", color: "#e8b850" },
  { icon: Trophy, label: "Рейтинг", value: "#2", color: "#3cc878" },
];

export default function DashboardPage() {
  const [streakDay] = useState(12);

  return (
    <div className="max-w-[1100px] mx-auto relative">

      <div className="pointer-events-none fixed top-16 right-0 w-[600px] h-[600px] rounded-full opacity-60 animate-orb-drift"
        style={{ background: "radial-gradient(circle, rgba(200,37,74,0.18) 0%, rgba(200,37,74,0.06) 45%, transparent 70%)" }} />
      <div className="pointer-events-none fixed top-[40%] left-[200px] w-[500px] h-[500px] rounded-full opacity-50 animate-orb-drift-rev"
        style={{ background: "radial-gradient(circle, rgba(139,79,212,0.16) 0%, rgba(139,79,212,0.04) 48%, transparent 70%)" }} />
      <div className="pointer-events-none fixed bottom-20 right-[10%] w-[400px] h-[400px] rounded-full opacity-40 animate-orb-drift"
        style={{ background: "radial-gradient(circle, rgba(196,136,48,0.14) 0%, transparent 68%)" }} />

      <div className="mb-7 relative">
        <div className="absolute -top-6 -left-8 w-[320px] h-[180px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(200,37,74,0.14) 0%, transparent 70%)" }} />
        <div className="flex items-start justify-between gap-4 flex-wrap relative z-10">
          <div>
            <p className="text-text-secondary text-sm">Өнөөдөр 12 хүн таны профайлыг үзсэн байна.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-[10px] mb-6">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="rounded-[14px] px-3.5 py-3.5 flex items-center gap-2.5 border transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(135deg, ${s.color}12 0%, rgba(7,5,15,0.9) 100%)`,
                border: `1px solid ${s.color}30`,
                boxShadow: `0 4px 20px ${s.color}10`,
              }}>
              <div className="w-8 h-8 rounded-[9px] shrink-0 flex items-center justify-center"
                style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>
                <Icon size={15} strokeWidth={1.8} style={{ color: s.color }} />
              </div>
              <div className="min-w-0">
                <div className="text-[17px] font-extrabold truncate font-serif" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px] text-text-muted leading-tight truncate">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-[20px] px-5 py-5 mb-6 flex items-center gap-4 flex-wrap relative overflow-hidden border"
        style={{
          background: "linear-gradient(135deg, rgba(200,37,74,0.15) 0%, rgba(196,136,48,0.1) 100%)",
          border: "1px solid rgba(200,37,74,0.35)",
          boxShadow: "0 0 40px rgba(200,37,74,0.14), inset 0 0 40px rgba(200,37,74,0.04)",
        }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 10% 50%, rgba(200,37,74,0.12) 0%, transparent 60%)" }} />
        <div className="flex items-center gap-3 min-w-[200px] relative z-10">
          <div className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0"
            style={{ background: "rgba(200,37,74,0.25)", border: "1px solid rgba(200,37,74,0.45)" }}>
            <Flame size={20} strokeWidth={1.8} style={{ color: "#e8415a" }} />
          </div>
          <div>
            <div className="font-serif text-lg font-bold">
              <span className="bg-[linear-gradient(135deg,#e8415a,#c22d50)] bg-clip-text text-transparent">{streakDay} өдрийн streak</span>
            </div>
            <div className="text-xs text-text-secondary">
              2 өдрийн дараа <strong style={{ color: "#e8b850" }}>онцгой урамшуулал</strong>
            </div>
          </div>
        </div>
        <div className="flex gap-1.5 flex-1 justify-center overflow-x-auto py-1 relative z-10">
          {Array.from({ length: 14 }, (_, i) => (
            <div key={i} className={`w-[18px] h-[18px] rounded-full shrink-0 flex items-center justify-center ${i < streakDay ? "bg-[linear-gradient(135deg,#e8415a,#e8b850)]" : "bg-[rgba(255,255,255,0.07)]"}`}
              style={i < streakDay ? { boxShadow: "0 0 6px rgba(232,65,90,0.5)" } : {}}>
              {i < streakDay && <div className="w-[5px] h-[5px] rounded-full bg-white" />}
            </div>
          ))}
        </div>
        <Link href="/swipe" className="relative z-10">
          <button className="text-white border-none rounded-[12px] font-semibold text-[13px] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 px-5 py-[10px] shrink-0"
            style={{ background: "linear-gradient(135deg, #e8415a, #9e1838)", boxShadow: "0 4px 20px rgba(200,37,74,0.4)" }}>
            Streak хадгалах →
          </button>
        </Link>
      </div>

      <div className="rounded-[18px] px-[22px] py-5 mb-6 border"
        style={{ background: "rgba(14,11,28,0.8)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[12px] font-bold text-text-muted tracking-[0.06em] uppercase flex items-center gap-1.5">
            <Zap size={12} strokeWidth={2} style={{ color: "#e8b850" }} />
            Өнөөдрийн даалгавар
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
            style={{ background: "rgba(200,37,74,0.15)", color: "#e8415a", border: "1px solid rgba(200,37,74,0.3)" }}>
            1/3 дууссан
          </span>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          {DAILY_CHALLENGES.map((c, i) => (
            <div key={i} className="flex-[1_1_150px] px-3.5 py-3 rounded-[12px] flex items-center gap-2 border"
              style={{
                background: c.done ? "rgba(60,200,120,0.08)" : "rgba(255,255,255,0.03)",
                border: c.done ? "1px solid rgba(60,200,120,0.25)" : "1px solid rgba(255,255,255,0.07)",
              }}>
              <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                style={{
                  background: c.done ? "rgba(60,200,120,0.25)" : "rgba(255,255,255,0.06)",
                  border: c.done ? "1px solid rgba(60,200,120,0.5)" : "1px solid rgba(255,255,255,0.1)",
                }}>
                {c.done && <div className="w-[5px] h-[5px] rounded-full" style={{ background: "#3cc878" }} />}
              </div>
              <div>
                <div className="text-xs font-semibold" style={{ color: c.done ? "#3cc878" : "var(--text-primary)" }}>{c.label}</div>
                <div className="text-[11px] text-text-muted">{c.reward}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-5">

          <div className="rounded-[18px] px-[22px] py-5 border"
            style={{ background: "rgba(14,11,28,0.8)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[12px] font-bold text-text-muted tracking-[0.06em] uppercase flex items-center gap-1.5">
                <Trophy size={12} strokeWidth={1.8} style={{ color: "#e8b850" }} />
                Сарын рейтинг
              </h3>
              <span className="text-[11px] text-text-muted">Энэ сар шинэчлэгдэнэ</span>
            </div>
            <div className="flex flex-col gap-2">
              {LEADERBOARD.map((l, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border transition-all duration-200"
                  style={{
                    background: l.name === "munkh_22" ? "rgba(200,37,74,0.1)" : "rgba(255,255,255,0.02)",
                    border: l.name === "munkh_22" ? "1px solid rgba(200,37,74,0.25)" : "1px solid rgba(255,255,255,0.05)",
                  }}>
                  <span className="text-base font-black min-w-[20px] font-serif"
                    style={{ color: i === 0 ? "#e8b850" : i === 1 ? "rgba(255,255,255,0.5)" : "#c48830" }}>
                    {l.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-text-primary">{l.name}</div>
                    <div className="text-[11px] text-text-muted">{l.badge}</div>
                  </div>
                  <span className="text-[13px] font-bold" style={{ color: "#e8b850" }}>{l.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[18px] px-[22px] py-5 border"
            style={{ background: "rgba(14,11,28,0.8)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[12px] font-bold text-text-muted tracking-[0.06em] uppercase">Онлайн одоо</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#3cc878] rounded-full animate-glow-pulse" />
                <span className="text-[11px] text-text-muted">5 онлайн</span>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {ONLINE_USERS.map((u, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: `${u.color}20`, border: `1px solid ${u.color}40`, color: u.color }}>
                    {u.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate text-text-primary">{u.name}</div>
                    <div className="text-[11px] text-text-muted">{u.tag}</div>
                  </div>
                  <Link href="/chat" className="ml-auto shrink-0">
                    <button className="rounded-full px-2.5 py-1 text-[11px] cursor-pointer transition-all duration-[180ms] hover:opacity-80"
                      style={{ background: `${u.color}12`, border: `1px solid ${u.color}40`, color: u.color }}>
                      Чат
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">

          <div className="rounded-[18px] px-[22px] py-5 relative overflow-hidden border"
            style={{
              background: "linear-gradient(135deg, rgba(200,37,74,0.12) 0%, rgba(139,79,212,0.08) 100%)",
              border: "1px solid rgba(200,37,74,0.3)",
              boxShadow: "0 4px 24px rgba(200,37,74,0.1)",
            }}>
            <div className="absolute bottom-0 right-0 w-[180px] h-[180px] pointer-events-none"
              style={{ background: "radial-gradient(circle at 80% 80%, rgba(200,37,74,0.12) 0%, transparent 60%)" }} />
            <div className="flex gap-3 items-center mb-3.5 relative z-10">
              <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                style={{ background: "rgba(200,37,74,0.2)", border: "1px solid rgba(200,37,74,0.4)" }}>
                <Sparkles size={18} strokeWidth={1.6} style={{ color: "#e8415a" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-text-primary">Seasonal Event: 5 сар</div>
                <div className="text-[11px] text-text-muted">Зун эхлэх special roleplay сценари</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase shrink-0"
                style={{ background: "rgba(200,37,74,0.2)", color: "#e8415a", border: "1px solid rgba(200,37,74,0.35)" }}>
                3 хоног
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-[1.7] mb-4 relative z-10">
              Зуны тусгай "Нуурын эрэг" roleplay сценари нэмэгдлээ. Хамгийн идэвхтэй тоглогч онцгой badge авна!
            </p>
            <Link href="/roleplay" className="relative z-10">
              <button className="w-full text-white border-none rounded-[12px] font-semibold text-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 py-2.5"
                style={{ background: "linear-gradient(135deg, #e8415a, #9e1838)", boxShadow: "0 4px 20px rgba(200,37,74,0.4)" }}>
                Оролцох →
              </button>
            </Link>
          </div>

          <div className="rounded-[18px] px-[22px] py-5 border"
            style={{ background: "rgba(14,11,28,0.8)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
            <h3 className="text-[12px] font-bold text-text-muted tracking-[0.06em] uppercase mb-4 flex items-center gap-1.5">
              <Flame size={12} strokeWidth={1.8} style={{ color: "#e8415a" }} />
              Forum халуун сэдэв
            </h3>
            <div className="flex flex-col gap-2">
              {HOT_TOPICS.map((t, i) => (
                <Link key={i} href="/forum" className="no-underline">
                  <div className="px-3 py-2.5 rounded-[10px] flex justify-between items-center gap-2 transition-all duration-[180ms] hover:border-[rgba(200,37,74,0.25)] border"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {t.hot && <Flame size={12} strokeWidth={1.8} className="shrink-0" style={{ color: "#e8415a" }} />}
                      <span className="text-[13px] text-text-secondary truncate">{t.title}</span>
                    </div>
                    <span className="text-[11px] text-text-muted shrink-0">{t.replies}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
