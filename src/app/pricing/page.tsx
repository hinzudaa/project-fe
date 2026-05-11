"use client";
import Link from "next/link";
import { useState } from "react";

const PLANS = [
  {
    id: "standard", name: "Стандарт", price: 29900, period: "сар", badge: "Үндсэн", badgeColor: "#3cc878", color: "#3cc878",
    desc: "Roleplay + Forum + Swipe (өдөрт 30) + Тоглоом",
    features: ["Swipe (өдөрт 30 удаа)", "Forum унших & бичих", "Basic roleplay сценари", "Mini-game хандалт", "Chat (өдөрт 10 хүн)"],
    missing: ["AI companion", "Unlimited swipe", "Boost & Super-like", "Exclusive content"]
  },
  {
    id: "premium", name: "Premium", price: 59900, period: "сар", badge: "Хамгийн алдартай", badgeColor: "#9b59ff", color: "#9b59ff", popular: true,
    desc: "Бүгд + Unlimited swipe + AI companion + Boost x3 + Exclusive content",
    features: ["Хязгааргүй swipe", "AI Roleplay companion", "Boost x3 / сар", "Super-like x5 / өдөр", "Exclusive forum & content", "Хязгааргүй chat", "Нууц forum хэсэг", "VIP badge & тэргүүлэх эрх"],
    missing: []
  },
  {
    id: "quarterly", name: "Улирлын", price: 39900, period: "3 сар", badge: "Хэмнэлттэй", badgeColor: "#f0c040", color: "#f0c040",
    desc: "Стандарт багц — 3 сарын урьдчилан төлөлт (↓10K хэмнэлт)",
    features: ["Стандартын бүх зүйл", "3 сарын урьдчилан төлөлт", "10,000₮ хэмнэлт", "Priority дэмжлэг", "Онцгой streak badge"],
    missing: ["AI companion", "Unlimited swipe", "Boost & Super-like"]
  }
];

const VIRAL = [
  { num: "01", title: "Найзаа урих (referral)", desc: "Найз бүрт 1 долоо хоногийн үнэгүй нэмэлт хугацаа. Урьсан хүн онцгой badge авна. Хязгааргүй referral chain боломжтой." },
  { num: "02", title: "Anonymous танилцуулга", desc: "Эхний 7 хоног blur profile харагдана — match болсны дараа л бүрэн харагдана. Сониуч байдлыг нэмнэ." },
  { num: "03", title: "Seasonal event", desc: "Хайрын баяр, Цагаан сар, Halloween-д тусгай game mode, roleplay scenario нэмнэ. Time-limited urgency." },
  { num: "04", title: "Daily challenge", desc: "Өдөр тутмын даалгавар биелүүлж streak хадгалаарай. 7 хоногийн streak = нэмэлт unlock content." },
];

export default function PricingPage() {
  const [selected, setSelected] = useState("premium");

  return (
    <div className="min-h-screen px-6 pt-16 pb-20" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(155,89,255,0.07) 0%, transparent 55%), var(--bg-primary)" }}>
      <div className="fixed top-6 left-6 z-10">
        <Link href="/auth/register">
          <button className="bg-transparent text-text-primary border border-white/[0.12] rounded-[14px] font-medium text-[13px] cursor-pointer transition-all duration-[220ms] hover:bg-[rgba(200,48,90,0.08)] hover:border-accent/50 hover:text-accent-light px-4 py-2">
            ← Буцах
          </button>
        </Link>
      </div>

      <div className="max-w-[1060px] mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-lg font-black text-white"
              style={{ background: "linear-gradient(135deg, #d4365a, #9a1c3e)", fontFamily: "Playfair Display, serif" }}>С</div>
            <span className="font-serif text-lg font-bold">Солонго</span>
          </div>
          <h1 className="font-serif font-black mb-3" style={{ fontSize: "clamp(32px,5vw,52px)" }}>
            Subscription <span className="bg-gradient-to-br from-[#a855f7] to-[#e040fb] bg-clip-text text-transparent">Багц</span>
          </h1>
          <p className="text-base text-text-secondary max-w-[480px] mx-auto mb-4">QPay / SocialPay-аар төлнө. Хэдийд ч цуцлах боломжтой.</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <span className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-[11px] font-bold tracking-[0.05em] uppercase bg-[rgba(50,190,110,0.12)] text-[#30be78] border border-[rgba(50,190,110,0.25)]">✓ QPay дэмжинэ</span>
            <span className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-[11px] font-bold tracking-[0.05em] uppercase bg-[rgba(50,120,220,0.12)] text-[#3080e0] border border-[rgba(50,120,220,0.25)]">✓ SocialPay</span>
            <span className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-[11px] font-bold tracking-[0.05em] uppercase bg-[rgba(212,160,64,0.12)] text-[#e8b850] border border-[rgba(212,160,64,0.25)]">✓ 7 хоног үнэгүй</span>
          </div>
        </div>

        {/* Plans */}
        <div className="grid gap-4 mb-16" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))" }}>
          {PLANS.map(plan => {
            const isSel = selected === plan.id;
            return (
              <div key={plan.id} onClick={() => setSelected(plan.id)}
                className="bg-bg-card rounded-[32px] p-7 cursor-pointer relative transition-all duration-[220ms]"
                style={{
                  border: isSel ? `2px solid ${plan.color}` : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: isSel ? `0 0 40px ${plan.color}20` : "none",
                }}>
                <div className="absolute top-[-12px] right-5">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold"
                    style={{ background: plan.color, color: plan.id === "quarterly" ? "#1a1000" : "white" }}>
                    {plan.badge}
                  </span>
                </div>
                {isSel && (
                  <div className="absolute top-4 left-4 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[13px] text-white"
                    style={{ background: plan.color }}>✓</div>
                )}
                <div className="mt-3">
                  <div className="text-xs font-bold text-text-muted tracking-[0.05em] mb-1.5">{plan.name.toUpperCase()}</div>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-[38px] font-black font-serif" style={{ color: plan.color }}>₮{plan.price.toLocaleString()}</span>
                    <span className="text-[13px] text-text-muted">/{plan.period}</span>
                  </div>
                  <p className="text-[13px] text-text-secondary leading-[1.6] mb-5">{plan.desc}</p>
                  <div className="flex flex-col gap-2 mb-[22px]">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex gap-2 items-center text-[13px]">
                        <span className="text-xs shrink-0" style={{ color: plan.color }}>✓</span>
                        <span className="text-text-primary">{f}</span>
                      </div>
                    ))}
                    {plan.missing.slice(0, 2).map((f, i) => (
                      <div key={i} className="flex gap-2 items-center text-[13px]">
                        <span className="text-xs text-text-muted shrink-0">—</span>
                        <span className="text-text-muted">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/dashboard">
                    <button className="w-full py-[13px] rounded-[14px] font-bold text-sm cursor-pointer transition-all duration-200"
                      style={{
                        background: isSel ? plan.color : "transparent",
                        border: isSel ? "none" : `1px solid ${plan.color}50`,
                        color: isSel ? (plan.id === "quarterly" ? "#1a1000" : "white") : plan.color,
                      }}>
                      {isSel ? "✓ Энэ багц сонгосон" : "Сонгох"}
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Viral section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-serif text-[28px] font-bold mb-2">
              Вирал өсөлтийн <span className="bg-gradient-to-br from-[#e04878] to-[#c8305a] bg-clip-text text-transparent">механизм</span>
            </h2>
            <p className="text-text-secondary text-sm">Платформ дээр удаан байх тусам илүү их авна</p>
          </div>
          <div className="flex flex-col gap-2.5">
            {VIRAL.map((v, i) => (
              <div key={i} className="bg-bg-card border border-white/[0.06] rounded-[14px] px-6 py-5 flex gap-5 items-start">
                <div className="text-[22px] font-black text-white/[0.12] font-serif shrink-0 min-w-[36px]">{v.num}</div>
                <div>
                  <div className="text-[15px] font-bold mb-1">{v.title}</div>
                  <div className="text-[13px] text-text-secondary leading-[1.7]">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core features */}
        <div>
          <div className="text-center mb-8">
            <h2 className="font-serif text-[28px] font-bold mb-2">
              Core Features — <span className="bg-gradient-to-br from-[#e04878] to-[#c8305a] bg-clip-text text-transparent">"Донтох" механизм</span>
            </h2>
          </div>
          <div className="grid gap-3.5 mb-10" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {[
              { badge: "🔥 Хамгийн донтох", badgeColor: "#e8415a", icon: "🎭", title: "AI Roleplay систем", desc: "Grok-powered дүр тоглолт. Хэрэглэгч өөрийн \"character\" үүсгэж, AI эсвэл бусад хэрэглэгчтэй roleplay хийнэ. Conversation history MongoDB-д хадгалагдана. Realtime socket streaming." },
              { badge: "💫 Tinder-style", badgeColor: "#ff6b35", icon: "❤️", title: "Swipe & Match", desc: "Зөвхөн verified профайлтай хэрэглэгчид swipe хийнэ. Match болсноор private chat нээгдэнэ. Daily limit, super-like, boost механизм retention нэмнэ." },
              { badge: "💬 Community", badgeColor: "#388add", icon: "📋", title: "Нийгэмлэгийн форум", desc: "Категорит forum. Upvote/downvote, nested comment, hot post алгоритм. Anonymous горим. Verified badge. Гишүүдийн зөвхөн харах content." },
              { badge: "🎮 Gamification", badgeColor: "#3cc878", icon: "🕹️", title: "Тоглоом & Mini-game", desc: "Socket.io realtime multiplayer mini-game. Truth or dare, would you rather, spin the bottle online. Leaderboard, streak reward. Daily challenge." },
            ].map((f, i) => (
              <div key={i} className="bg-bg-card border border-white/[0.06] rounded-[22px] p-6">
                <div className="mb-3.5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                    style={{ background: `${f.badgeColor}18`, color: f.badgeColor, border: `1px solid ${f.badgeColor}30` }}>
                    {f.badge}
                  </span>
                </div>
                <div className="text-[28px] mb-2.5">{f.icon}</div>
                <h3 className="font-serif text-[17px] font-bold mb-2">{f.title}</h3>
                <p className="text-[13px] text-text-secondary leading-[1.7]">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-7">
            <h2 className="font-serif text-[22px] font-bold">
              Retention механизм — <span className="bg-gradient-to-br from-[#e04878] to-[#c8305a] bg-clip-text text-transparent">сар тутам сунгаж байхад хүргэх</span>
            </h2>
          </div>
          <div className="grid gap-3 mb-12" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {[
              { icon: "🔥", title: "Daily streak", desc: "7 хоног дараалан орсон бол unlock content, тусгай badge авна. Streak тасрахгүйн тулд push notification." },
              { icon: "🔓", title: "Unlock content", desc: "Зарим roleplay scenario, game mode, forum section нь 3 сар гишүүнчлэлд л нээгдэнэ. Урьдчилан харуулна." },
              { icon: "🔔", title: "Smart notification", desc: "Grok-оор \"таны match online боллоо\", \"шинэ roleplay партнер хайж байна\" гэх customized push." },
              { icon: "🏆", title: "Leaderboard", desc: "Roleplay writer, хамгийн идэвхтэй forum гишүүн. Сарын шилдэг профайл онцлон дарна." },
              { icon: "✨", title: "Grok AI companion", desc: "Хэрэглэгч идэвхгүй болсноор AI companion нь \"санаа алдаж байна\" гэх personalized мессеж явуулна." },
            ].map((r, i) => (
              <div key={i} className="bg-bg-card border border-white/[0.06] rounded-[14px] p-5">
                <div className="text-[26px] mb-2.5">{r.icon}</div>
                <div className="text-sm font-bold mb-1.5">{r.title}</div>
                <div className="text-xs text-text-secondary leading-[1.7]">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="bg-bg-card border border-white/[0.06] rounded-[22px] p-7 mb-10">
          <div className="text-xs font-bold text-text-muted tracking-[0.05em] mb-4">ТЕХНОЛОГИЙН СТЕК</div>
          <div className="flex flex-wrap gap-2">
            {["Next.js 15 (App Router)", "MongoDB + Mongoose", "Express.js API", "Node.js", "Socket.io (realtime)", "Grok AI (xAI API)", "JWT + NextAuth", "QPay / SocialPay", "Cloudflare R2"].map(t => (
              <span key={t} className="px-3.5 py-[7px] rounded-full text-xs font-semibold bg-[rgba(155,89,255,0.1)] text-[#9b59ff] border border-[rgba(155,89,255,0.25)]">{t}</span>
            ))}
          </div>
        </div>

        {/* Trust */}
        <div className="flex flex-wrap gap-4 justify-center">
          {[
            { icon: "🔒", label: "SSL шифрлэгдсэн төлбөр" },
            { icon: "🇲🇳", label: "Монгол хуулийн дагуу" },
            { icon: "↩️", label: "7 хоногийн баталгаа" },
            { icon: "📞", label: "24/7 дэмжлэг" },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-[13px] text-text-secondary">
              <span className="text-lg">{t.icon}</span>
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
