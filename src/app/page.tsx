"use client";
import Link from "next/link";
import { Heart, Wand2, Users, Gamepad2, Lock, ArrowRight, Flame } from "lucide-react";

const FEATURES = [
  {
    icon: Heart,
    title: "Swipe & Танилц",
    desc: "AI тааруулалтаар хамгийн нийцтэй хүнтэйгээ уулз. Anonymous горим, verified профайлууд.",
    badge: "Шинэ",
    badgeStyle: { background: "rgba(158,24,56,0.15)", color: "#c22d50", border: "1px solid rgba(158,24,56,0.3)" },
    glow: "rgba(158,24,56,0.08)",
  },
  {
    icon: Wand2,
    title: "Roleplay Орон",
    desc: "Дуртай дүрээрээ орж уран зохиолын ертөнцөд нэвтэр. AI туслагчтай тасралтгүй түүх.",
    badge: "AI",
    badgeStyle: { background: "rgba(90,31,138,0.15)", color: "#8b4fd4", border: "1px solid rgba(90,31,138,0.3)" },
    glow: "rgba(90,31,138,0.08)",
  },
  {
    icon: Flame,
    title: "Нийгэмлэгийн Forum",
    desc: "Нэргүй бичих, хамгийн халуухан сэдвүүдэд оролцох. Зөвхөн verified гишүүд.",
    badge: "Идэвхтэй",
    badgeStyle: { background: "rgba(158,24,56,0.12)", color: "#c22d50", border: "1px solid rgba(158,24,56,0.25)" },
    glow: "rgba(158,24,56,0.07)",
  },
  {
    icon: Gamepad2,
    title: "Тоглоом",
    desc: "Truth or dare, spin the bottle — онлайнаар хамтдаа тоглох.",
    badge: "Удахгүй",
    badgeStyle: { background: "rgba(154,96,16,0.12)", color: "#c48830", border: "1px solid rgba(154,96,16,0.25)" },
    glow: "rgba(154,96,16,0.06)",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden">

      {/* Atmospheric orbs */}
      <div className="fixed w-[800px] h-[800px] rounded-full pointer-events-none animate-orb-drift"
        style={{ background: "radial-gradient(circle, rgba(158,24,56,0.1) 0%, rgba(158,24,56,0.03) 45%, transparent 70%)", top: "-300px", right: "-250px" }} />
      <div className="fixed w-[600px] h-[600px] rounded-full pointer-events-none animate-orb-drift-rev"
        style={{ background: "radial-gradient(circle, rgba(90,31,138,0.09) 0%, rgba(90,31,138,0.02) 45%, transparent 70%)", bottom: "-200px", left: "-180px" }} />
      <div className="fixed w-[350px] h-[350px] rounded-full pointer-events-none animate-orb-drift"
        style={{ background: "radial-gradient(circle, rgba(158,24,56,0.05) 0%, transparent 70%)", top: "45%", left: "35%" }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-[rgba(7,5,15,0.9)] backdrop-blur-[28px] border-b border-white/[0.05] h-16"
        style={{ padding: "0 clamp(16px,4vw,48px)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-[32px] h-[32px] rounded-[9px] flex items-center justify-center text-[15px] font-black text-white shrink-0 shadow-[0_4px_16px_rgba(158,24,56,0.35)]"
            style={{ background: "linear-gradient(135deg, #b82040, #6e0f22)", fontFamily: "Playfair Display, serif" }}>С</div>
          <span className="text-[17px] font-bold tracking-[-0.02em]" style={{ fontFamily: "Playfair Display, serif" }}>Солонго</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/auth/login">
            <button className="bg-transparent text-text-secondary border border-white/[0.08] rounded-[12px] font-medium text-[13px] cursor-pointer transition-all duration-200 hover:text-text-primary hover:border-white/[0.15] px-5 py-[9px]">
              Нэвтрэх
            </button>
          </Link>
          <Link href="/auth/register">
            <button className="text-white border-none rounded-[12px] font-semibold text-[13px] cursor-pointer transition-all duration-200 shadow-[0_4px_20px_rgba(158,24,56,0.3)] hover:-translate-y-px hover:shadow-[0_8px_36px_rgba(158,24,56,0.5)] px-5 py-[9px]"
              style={{ background: "linear-gradient(135deg, #b82040, #6e0f22)" }}>
              Бүртгүүлэх
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-[860px] mx-auto px-6 py-20">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.08em] uppercase"
              style={{ background: "rgba(158,24,56,0.12)", color: "#c22d50", border: "1px solid rgba(158,24,56,0.25)" }}>
              Монголын #1 Premium 18+ Нийгэмлэг
            </span>
          </div>
          <h1 className="font-serif font-black leading-[1.0] mb-8 tracking-[-0.04em]" style={{ fontSize: "clamp(48px,8vw,96px)" }}>
            Хориотой таашаалыг<br />
            <span className="bg-gradient-to-br from-[#c22d50] to-[#8c1828] bg-clip-text text-transparent whitespace-nowrap">нээж өгнө</span>
          </h1>
          <p className="text-text-secondary leading-[1.8] max-w-[520px] mx-auto mb-12" style={{ fontSize: "clamp(15px,1.8vw,18px)" }}>
            Нуугдсан хүслийг дэлгэ. Verified, нууцлалтай орчинд жинхэнэ холболт ол. Зөвхөн насанд хүрэгчдэд.
          </p>
          <div className="flex gap-3 justify-center flex-wrap mb-6">
            <Link href="/auth/register">
              <button className="text-white border-none rounded-full font-semibold cursor-pointer transition-all duration-200 shadow-[0_4px_24px_rgba(158,24,56,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(158,24,56,0.55)] px-9 py-4 text-[15px] flex items-center gap-2"
                style={{ background: "linear-gradient(135deg, #b82040, #6e0f22)" }}>
                Үнэгүй бүртгэл
                <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/pricing">
              <button className="bg-transparent text-text-secondary border border-white/[0.08] rounded-full font-medium cursor-pointer transition-all duration-200 hover:text-text-primary hover:border-white/[0.15] px-9 py-4 text-[15px]">
                Үнийн мэдээлэл
              </button>
            </Link>
          </div>
          <p className="text-xs text-text-muted flex items-center justify-center gap-1.5">
            <Lock size={11} />
            18+ · Монгол иргэдэд зориулсан · Нууцлал хамгаалагдсан
          </p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-[1100px] mx-auto px-6 pb-28">
        <div className="h-px mb-20" style={{ background: "linear-gradient(90deg, transparent, rgba(158,24,56,0.25), transparent)" }} />
        <div className="text-center mb-14">
          <h2 className="font-serif font-black tracking-[-0.02em]" style={{ fontSize: "clamp(28px,4vw,44px)" }}>
            Юу ч боломжтой,{" "}
            <span className="bg-gradient-to-br from-[#8b4fd4] to-[#5a1f8a] bg-clip-text text-transparent">нууцаар</span>
          </h2>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i}
                className="transition-all duration-[300ms] hover:-translate-y-[6px] hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/[0.05] rounded-[18px] px-7 py-8 flex flex-col gap-4 backdrop-blur-[12px]"
                style={{ background: `linear-gradient(160deg, ${f.glow} 0%, rgba(12,8,25,0.9) 65%)` }}>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center"
                    style={{ background: f.badgeStyle.background, border: f.badgeStyle.border }}>
                    <Icon size={18} style={{ color: f.badgeStyle.color }} strokeWidth={1.8} />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.07em] uppercase px-2.5 py-1 rounded-full"
                    style={f.badgeStyle}>{f.badge}</span>
                </div>
                <h3 className="text-[17px] font-bold" style={{ fontFamily: "Playfair Display, serif" }}>{f.title}</h3>
                <p className="text-sm text-text-secondary leading-[1.7]">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-[900px] mx-auto px-6 mb-28">
        <div className="rounded-[24px] py-14 px-12 grid text-center gap-8"
          style={{
            background: "linear-gradient(135deg, rgba(158,24,56,0.07) 0%, rgba(90,31,138,0.05) 100%)",
            border: "1px solid rgba(158,24,56,0.2)",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))"
          }}>
          {[
            { n: "12,400+", label: "Гишүүн" },
            { n: "98%", label: "Сэтгэл ханамж" },
            { n: "3 сар", label: "Хамгийн урт streak" },
            { n: "24/7", label: "Дэмжлэг" },
          ].map((s, i) => (
            <div key={i}>
              <div className="bg-gradient-to-br from-[#c22d50] to-[#8c1828] bg-clip-text text-transparent font-black font-serif" style={{ fontSize: "clamp(28px,4vw,42px)" }}>{s.n}</div>
              <div className="text-[12px] text-text-muted mt-2 tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="max-w-[1000px] mx-auto px-6 mb-28">
        <h2 className="font-serif font-black text-center mb-14 tracking-[-0.02em]" style={{ fontSize: "clamp(26px,4vw,40px)" }}>
          Нэг үнэ, <span className="bg-gradient-to-br from-[#c22d50] to-[#8c1828] bg-clip-text text-transparent">бүгд нээлттэй</span>
        </h2>
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {[
            { name: "Сарын Багц", price: "₮29,900", period: "/ сар", popular: false, features: ["Swipe & Танилцалт", "Forum хандалт", "Олон chat", "Basic roleplay"] },
            { name: "3 Сарын Багц", price: "₮69,900", period: "/ 3 сар", popular: true, features: ["Бүгд нээлттэй", "AI Roleplay туслагч", "Тоглоомын эрх", "Нууц forum", "Priority дэмжлэг"] },
            { name: "Жилийн Багц", price: "₮199,900", period: "/ жил", popular: false, features: ["3 сарын давуу тал", "Хувийн AI хамтрагч", "Онцгой хаалт", "VIP Forum", "Шинэ функц эрт авах"] },
          ].map((p, i) => (
            <div key={i} className={`transition-all duration-[300ms] hover:-translate-y-[5px] rounded-[18px] p-8 relative ${p.popular ? "shadow-[0_0_40px_rgba(158,24,56,0.15)]" : ""}`}
              style={{
                background: p.popular
                  ? "linear-gradient(160deg, rgba(158,24,56,0.12) 0%, rgba(12,8,25,0.98) 70%)"
                  : "var(--bg-card)",
                border: p.popular ? "1px solid rgba(158,24,56,0.35)" : "1px solid rgba(255,255,255,0.05)",
              }}>
              {p.popular && (
                <div className="absolute top-[-13px] left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.07em] uppercase"
                    style={{ background: "rgba(154,96,16,0.2)", color: "#c48830", border: "1px solid rgba(154,96,16,0.3)" }}>
                    Хамгийн Алдартай
                  </span>
                </div>
              )}
              <div className="text-[11px] text-text-muted font-bold uppercase tracking-[0.07em] mb-2">{p.name}</div>
              <div className="flex items-baseline gap-1 mb-7">
                <span className={`font-black font-serif ${p.popular ? "bg-gradient-to-br from-[#c48830] to-[#9a6010] bg-clip-text text-transparent" : "bg-gradient-to-br from-[#c22d50] to-[#8c1828] bg-clip-text text-transparent"}`}
                  style={{ fontSize: "clamp(28px,4vw,38px)" }}>{p.price}</span>
                <span className="text-[13px] text-text-muted">{p.period}</span>
              </div>
              <div className="flex flex-col gap-2.5 mb-8">
                {p.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2.5 text-sm">
                    <div className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: p.popular ? "#c48830" : "#9e1838" }} />
                    <span className="text-text-secondary">{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth/register">
                <button className={`w-full rounded-[12px] font-semibold text-sm cursor-pointer transition-all duration-200 py-3 ${p.popular ? "text-[#0a0510] border-none shadow-[0_4px_20px_rgba(154,96,16,0.3)] hover:-translate-y-0.5" : "bg-transparent border border-white/[0.08] text-text-secondary hover:text-text-primary hover:border-white/[0.15]"}`}
                  style={p.popular ? { background: "linear-gradient(135deg, #c48830, #8a5010)" } : {}}>
                  Одоо Эхлэх
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-28 relative">
        <div className="h-px mb-20" style={{ background: "linear-gradient(90deg, transparent, rgba(158,24,56,0.25), transparent)" }} />
        <h2 className="font-serif font-black mb-5 tracking-[-0.03em]" style={{ fontSize: "clamp(30px,5vw,56px)" }}>
          Таны аяллыг{" "}
          <span className="bg-gradient-to-br from-[#c22d50] to-[#8c1828] bg-clip-text text-transparent">эхлүүлэхэд бэлэн</span>
        </h2>
        <p className="text-text-secondary max-w-[440px] mx-auto mb-10" style={{ fontSize: "clamp(14px,1.8vw,17px)" }}>
          Өнөөдөр бүртгүүлж, Монголын хамгийн онцгой нийгэмлэгт нэгдэ.
        </p>
        <Link href="/auth/register">
          <button className="text-white border-none rounded-full font-semibold cursor-pointer transition-all duration-200 shadow-[0_4px_24px_rgba(158,24,56,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(158,24,56,0.55)] px-14 py-[18px] text-[16px] flex items-center gap-2.5 mx-auto"
            style={{ background: "linear-gradient(135deg, #b82040, #6e0f22)" }}>
            Одоо Нэгдэх
            <ArrowRight size={17} />
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] flex items-center justify-between flex-wrap gap-4"
        style={{ padding: "24px clamp(16px,4vw,40px)" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[6px] flex items-center justify-center text-xs font-black text-white"
            style={{ background: "linear-gradient(135deg, #b82040, #6e0f22)", fontFamily: "Playfair Display, serif" }}>С</div>
          <span className="text-[13px] text-text-muted">© 2025 Солонго. Бүх эрх хамгаалагдсан.</span>
        </div>
        <div className="flex gap-6 flex-wrap">
          {["Нууцлалын бодлого", "Үйлчилгээний нөхцөл", "Холбоо барих"].map(l => (
            <span key={l} className="text-[13px] text-text-muted cursor-pointer transition-colors duration-[180ms] hover:text-text-secondary">{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
