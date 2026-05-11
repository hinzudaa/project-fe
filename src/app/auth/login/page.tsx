"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { router.push("/dashboard"); }, 1200);
  };

  return (
    <div className="min-h-screen flex items-stretch bg-bg-primary">
      {/* Left panel — desktop only */}
      <div className="hidden md:flex w-[440px] shrink-0 flex-col justify-between px-11 py-[52px] relative overflow-hidden border-r border-[rgba(200,48,90,0.12)]"
        style={{ background: "linear-gradient(160deg, rgba(200,48,90,0.18) 0%, rgba(139,63,212,0.12) 50%, rgba(6,5,14,0.95) 100%)" }}>
        {/* Orbs */}
        <div className="absolute w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(200,48,90,0.18) 0%, transparent 70%)", top: "-80px", left: "-80px" }} />
        <div className="absolute w-[280px] h-[280px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,63,212,0.15) 0%, transparent 70%)", bottom: "80px", right: "-60px" }} />

        {/* Logo */}
        <Link href="/" className="no-underline">
          <div className="flex items-center gap-2.5">
            <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-xl font-black text-white shadow-[0_4px_20px_rgba(200,48,90,0.4)]"
              style={{ background: "linear-gradient(135deg, #d4365a, #9a1c3e)", fontFamily: "Playfair Display, serif" }}>С</div>
            <span className="text-xl font-bold" style={{ fontFamily: "Playfair Display, serif" }}>Солонго</span>
          </div>
        </Link>

        {/* Copy */}
        <div>
          <h2 className="font-serif text-[38px] font-black leading-[1.1] mb-[18px] tracking-[-0.02em]">
            Таны нууц{" "}
            <span className="bg-gradient-to-br from-[#e04878] to-[#c8305a] bg-clip-text text-transparent">ертөнц</span>{" "}
            хүлээж байна
          </h2>
          <p className="text-text-secondary text-[15px] leading-[1.75] mb-9">
            Verified гишүүдтэй жинхэнэ холболт хий. Нууцлал, аюулгүй байдал — манай нэн тэргүүний зорилго.
          </p>
          <div className="flex flex-col gap-3.5">
            {[
              { icon: "💋", text: "Verified профайлтай хэрэглэгчид" },
              { icon: "🔒", text: "Бүрэн нууцлалтай орчин" },
              { icon: "🎭", text: "AI-powered roleplay систем" },
              { icon: "💫", text: "Smart match алгоритм" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-[10px] shrink-0 bg-[rgba(200,48,90,0.1)] border border-[rgba(200,48,90,0.2)] flex items-center justify-center text-base">{f.icon}</span>
                <span className="text-sm text-text-secondary">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-text-muted">🔒 18+ · Монгол хуулийн дагуу · SSL хамгаалагдсан</div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10"
        style={{ background: "radial-gradient(ellipse at 60% 20%, rgba(200,48,90,0.07) 0%, transparent 55%)" }}>
        <div className="w-full max-w-[400px]">
          <div className="mb-7">
            <Link href="/">
              <button className="bg-transparent text-text-primary border border-white/[0.12] rounded-[14px] font-medium text-[13px] cursor-pointer transition-all duration-[220ms] hover:bg-[rgba(200,48,90,0.08)] hover:border-accent/50 hover:text-accent-light px-4 py-2">
                ← Буцах
              </button>
            </Link>
          </div>

          <div className="text-center mb-9">
            <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-[26px] font-black text-white mx-auto mb-4 shadow-[0_8px_30px_rgba(200,48,90,0.4)]"
              style={{ background: "linear-gradient(135deg, #d4365a, #9a1c3e)", fontFamily: "Playfair Display, serif" }}>С</div>
            <h1 className="font-serif text-[28px] font-bold">Тавтай морил</h1>
            <p className="text-text-secondary text-sm mt-1.5">Таны нийгэмлэг таныг хүлээж байна</p>
          </div>

          <div className="bg-[rgba(17,14,30,0.9)] border border-[rgba(200,48,90,0.15)] rounded-[32px] p-9 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)]">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2 tracking-[0.05em]">ИМЭЙЛ</label>
                <input
                  className="bg-[rgba(11,9,20,0.8)] border border-white/[0.08] text-text-primary px-4 py-3 rounded-lg font-[inherit] text-sm transition-[border-color,box-shadow] duration-200 outline-none w-full placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,48,90,0.12)]"
                  type="email"
                  placeholder="tanii@email.mn"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-text-secondary tracking-[0.05em]">НУУЦ ҮГ</label>
                  <span className="text-xs text-accent cursor-pointer">Мартсан?</span>
                </div>
                <input
                  className="bg-[rgba(11,9,20,0.8)] border border-white/[0.08] text-text-primary px-4 py-3 rounded-lg font-[inherit] text-sm transition-[border-color,box-shadow] duration-200 outline-none w-full placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,48,90,0.12)]"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-[#d4365a] to-[#9a1c3e] text-white border-none rounded-[14px] font-semibold text-[15px] cursor-pointer transition-all duration-[220ms] shadow-[0_4px_20px_rgba(200,48,90,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(200,48,90,0.55)] active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed py-3.5 mt-2"
              >
                {loading ? "Нэвтэрч байна..." : "Нэвтрэх →"}
              </button>
            </form>

            <div className="h-px bg-white/[0.05] my-4" />

            <button className="w-full bg-transparent text-text-primary border border-white/[0.12] rounded-[14px] font-medium text-sm cursor-pointer transition-all duration-[220ms] hover:bg-[rgba(200,48,90,0.08)] hover:border-accent/50 hover:text-accent-light flex items-center justify-center gap-2.5 py-3">
              <span className="font-bold text-sm">G</span>
              Google-аар нэвтрэх
            </button>

            <p className="text-center mt-[22px] text-[13px] text-text-muted">
              Бүртгэл байхгүй?{" "}
              <Link href="/auth/register">
                <span className="text-accent-light cursor-pointer font-semibold">Бүртгүүлэх</span>
              </Link>
            </p>
          </div>

          <p className="text-center mt-[18px] text-[11px] text-text-muted">
            Зөвхөн 18+ насны иргэдэд зориулсан
          </p>
        </div>
      </div>
    </div>
  );
}
