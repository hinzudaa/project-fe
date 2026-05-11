"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = ["Нэвтрэх мэдээлэл", "Нас & Хүйс", "Таны дүрслэл"];
const STEP_ICONS = ["👤", "🔞", "✨"];
const INTERESTS = ["Уран зохиол 📚", "Кино 🎬", "Тоглоом 🎮", "Хөгжим 🎵", "Спорт ⚽", "Аялал ✈️", "Гэрэл зураг 📸", "Хоол 🍜", "Аниме 🎌", "Фитнесс 💪"];
const LOOKING_FOR = ["Найрсаг яриа", "Roleplay", "Танилцалт", "Нөхөрлөл"];
const CITIES = ["Улаанбаатар", "Дархан", "Эрдэнэт", "Чойбалсан", "Мөрөн", "Өлгий", "Бусад"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", birthYear: "", birthMonth: "", birthDay: "", gender: "", lookingFor: [] as string[], interests: [] as string[], bio: "", city: "" });

  const toggle = (arr: string[], val: string) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
  const canNext = () => {
    if (step === 0) return form.username.length >= 3 && form.email.includes("@") && form.password.length >= 6;
    if (step === 1) return form.birthYear && form.gender && agreed;
    return true;
  };
  const next = () => { if (step < STEPS.length - 1) setStep(s => s + 1); else router.push("/pricing"); };

  const inputCls = "bg-[rgba(11,9,20,0.8)] border border-white/[0.08] text-text-primary px-4 py-3 rounded-lg font-[inherit] text-sm transition-[border-color,box-shadow] duration-200 outline-none w-full placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,48,90,0.12)]";

  return (
    <div className="min-h-screen flex items-stretch bg-bg-primary">
      {/* Left panel — desktop only */}
      <div className="hidden md:flex w-[420px] shrink-0 flex-col justify-between px-10 py-12 border-r border-white/[0.05]"
        style={{ background: "linear-gradient(160deg, rgba(232,65,90,0.12) 0%, rgba(155,89,255,0.08) 100%)" }}>
        <div>
          <Link href="/" className="no-underline">
            <div className="flex items-center gap-2.5 mb-16">
              <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-xl font-black text-white"
                style={{ background: "linear-gradient(135deg, #d4365a, #9a1c3e)", fontFamily: "Playfair Display, serif" }}>С</div>
              <span className="text-xl font-bold" style={{ fontFamily: "Playfair Display, serif" }}>Солонго</span>
            </div>
          </Link>
          <h2 className="font-serif text-[32px] font-bold mb-4 leading-[1.2]">
            Монголын хамгийн{" "}
            <span className="bg-gradient-to-br from-[#e04878] to-[#c8305a] bg-clip-text text-transparent">онцгой</span>{" "}
            нийгэмлэгт нэгд
          </h2>
          <p className="text-text-secondary text-[15px] leading-[1.7]">Зөвхөн verified гишүүдтэй танилц. Нууцлал 100% хамгаалагдсан.</p>
        </div>
        <div className="flex flex-col gap-4">
          {[
            { icon: "🎭", label: "AI Roleplay систем", sub: "Grok-powered дүр тоглолт" },
            { icon: "💫", label: "Swipe & Match", sub: "Зөвхөн verified хэрэглэгчид" },
            { icon: "🔥", label: "Daily streak reward", sub: "Идэвхтэй байвал unlock content" },
            { icon: "🎮", label: "Multiplayer mini-games", sub: "Truth or dare, spin the bottle" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-[38px] h-[38px] rounded-[10px] bg-white/[0.06] flex items-center justify-center text-lg shrink-0">{f.icon}</span>
              <div>
                <div className="text-[13px] font-semibold">{f.label}</div>
                <div className="text-xs text-text-muted">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-text-muted">🔒 18+ · Монгол хуулийн дагуу · Нууцлал баталгаатай</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-[440px]">
          <div className="text-center mb-8">
            <div className="text-[13px] text-text-muted mb-5">
              <Link href="/" style={{ color: "var(--accent-primary)", textDecoration: "none" }}>← Нүүр хуудас</Link>
            </div>
            <div className="font-serif text-2xl font-bold">{STEP_ICONS[step]} {STEPS[step]}</div>
            <div className="text-text-muted text-[13px] mt-1">Алхам {step + 1} / {STEPS.length}</div>
          </div>

          {/* Progress */}
          <div className="flex gap-1.5 mb-7">
            {STEPS.map((_, i) => (
              <div key={i} className="flex-1 h-1 rounded-sm transition-colors duration-300"
                style={{ background: i <= step ? (i === 0 ? "#e8415a" : i === 1 ? "#9b59ff" : "#3cc878") : "rgba(255,255,255,0.08)" }} />
            ))}
          </div>

          <div className="bg-[rgba(17,14,30,0.88)] backdrop-blur-[24px] border border-white/[0.06] rounded-[32px] p-8">
            {/* Step 0 */}
            {step === 0 && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-[7px] tracking-[0.04em]">ХЭРЭГЛЭГЧИЙН НЭР</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">@</span>
                    <input className={`${inputCls} pl-[30px]`} placeholder="munkh_22" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
                  </div>
                  {form.username.length > 0 && form.username.length < 3 && <div className="text-[11px] text-[#e8415a] mt-1">Хамгийн багадаа 3 тэмдэгт</div>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-[7px] tracking-[0.04em]">ИМЭЙЛ</label>
                  <input className={inputCls} type="email" placeholder="tanii@email.mn" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-[7px] tracking-[0.04em]">НУУЦ ҮГ</label>
                  <div className="relative">
                    <input className={`${inputCls} pr-11`} type={showPass ? "text" : "password"} placeholder="Хамгийн багадаа 6 тэмдэгт" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                    <button onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-text-muted text-sm">{showPass ? "🙈" : "👁️"}</button>
                  </div>
                  {form.password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="flex-1 h-[3px] rounded-sm"
                            style={{ background: form.password.length >= i * 2 ? (i <= 1 ? "#e8415a" : i <= 2 ? "#f0c040" : i <= 3 ? "#388add" : "#3cc878") : "rgba(255,255,255,0.08)" }} />
                        ))}
                      </div>
                      <div className="text-[10px] text-text-muted mt-1">{form.password.length < 4 ? "Сул" : form.password.length < 6 ? "Дунд" : form.password.length < 8 ? "Сайн" : "Маш сайн"}</div>
                    </div>
                  )}
                </div>
                <div className="bg-[rgba(155,89,255,0.08)] border border-[rgba(155,89,255,0.2)] rounded-lg p-3.5 flex gap-2.5 items-start">
                  <span className="text-base">💜</span>
                  <div className="text-xs text-text-secondary leading-[1.6]">
                    Бүртгэл үүсгэсний дараа <strong className="text-[#9b59ff]">7 хоногийн үнэгүй</strong> trial авна. Кредит карт шаардлагагүй!
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div className="p-4 bg-[rgba(232,65,90,0.06)] border border-[rgba(232,65,90,0.2)] rounded-[14px] flex gap-3 items-center">
                  <span className="text-[28px]">🔞</span>
                  <div>
                    <div className="text-[13px] font-bold mb-0.5">Насны баталгаажуулалт</div>
                    <div className="text-xs text-text-secondary">Энэ платформ зөвхөн <strong className="text-[#e8415a]">18+</strong> насны хэрэглэгчдэд зориулагдсан</div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-2.5 tracking-[0.04em]">ТӨРСӨН ОГНОО</label>
                  <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 1fr 1.3fr" }}>
                    <select className={inputCls} style={{ background: "var(--bg-card)" }} value={form.birthMonth} onChange={e => setForm(p => ({ ...p, birthMonth: e.target.value }))}>
                      <option value="">Сар</option>
                      {["1-р","2-р","3-р","4-р","5-р","6-р","7-р","8-р","9-р","10-р","11-р","12-р"].map((m,i) => <option key={i} value={i+1}>{m}</option>)}
                    </select>
                    <select className={inputCls} style={{ background: "var(--bg-card)" }} value={form.birthDay} onChange={e => setForm(p => ({ ...p, birthDay: e.target.value }))}>
                      <option value="">Өдөр</option>
                      {Array.from({length: 31}, (_, i) => i+1).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select className={inputCls} style={{ background: "var(--bg-card)" }} value={form.birthYear} onChange={e => setForm(p => ({ ...p, birthYear: e.target.value }))}>
                      <option value="">Жил</option>
                      {Array.from({length: 40}, (_, i) => 2006 - i).map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-2.5 tracking-[0.04em]">ХҮЙС</label>
                  <div className="flex gap-2">
                    {[{v:"Эрэгтэй",e:"👨"},{v:"Эмэгтэй",e:"👩"},{v:"Бусад",e:"🌈"}].map(g => (
                      <button key={g.v} onClick={() => setForm(p => ({ ...p, gender: g.v }))}
                        className="flex-1 py-3.5 px-2 rounded-[14px] cursor-pointer flex flex-col items-center gap-1 text-[13px] font-semibold transition-all duration-200"
                        style={{
                          border: form.gender === g.v ? "1.5px solid #e8415a" : "1px solid rgba(255,255,255,0.08)",
                          background: form.gender === g.v ? "rgba(232,65,90,0.1)" : "var(--bg-card)",
                          color: form.gender === g.v ? "#e8415a" : "var(--text-secondary)",
                        }}>
                        <span className="text-[22px]">{g.e}</span>
                        {g.v}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-2.5 tracking-[0.04em]">ЮУ ХАЙЖ БАЙНА?</label>
                  <div className="flex gap-2 flex-wrap">
                    {LOOKING_FOR.map(l => (
                      <button key={l} onClick={() => setForm(p => ({ ...p, lookingFor: toggle(p.lookingFor, l) }))}
                        className="px-3.5 py-2 rounded-full text-[13px] cursor-pointer transition-all duration-[180ms]"
                        style={{
                          border: form.lookingFor.includes(l) ? "1px solid #9b59ff" : "1px solid rgba(255,255,255,0.1)",
                          background: form.lookingFor.includes(l) ? "rgba(155,89,255,0.12)" : "transparent",
                          color: form.lookingFor.includes(l) ? "#9b59ff" : "var(--text-secondary)",
                        }}>{l}</button>
                    ))}
                  </div>
                </div>
                <label className="flex gap-2.5 items-start cursor-pointer">
                  <div className="w-5 h-5 rounded-[5px] shrink-0 mt-px border-none flex items-center justify-center cursor-pointer transition-all duration-[180ms]"
                    style={{ background: agreed ? "#e8415a" : "transparent", border: agreed ? "none" : "1.5px solid rgba(255,255,255,0.2)" }}
                    onClick={() => setAgreed(a => !a)}>
                    {agreed && <span className="text-white text-[13px]">✓</span>}
                  </div>
                  <span className="text-xs text-text-secondary leading-[1.6]">
                    Би 18 ба түүнээс дээш настай гэдгийг баталж, Солонгогийн{" "}
                    <span className="text-[#e8415a]">үйлчилгээний нөхцөл</span> болон{" "}
                    <span className="text-[#e8415a]">нууцлалын бодлого</span>-г зөвшөөрч байна.
                  </span>
                </label>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="flex flex-col gap-[18px]">
                <div className="text-center mb-1">
                  <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-[32px] cursor-pointer border-2 border-dashed border-white/20"
                    style={{ background: "linear-gradient(135deg, rgba(232,65,90,0.3), rgba(155,89,255,0.3))" }}>📸</div>
                  <div className="text-xs text-text-muted">Профайл зураг нэмэх (сонголттой)</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-[7px] tracking-[0.04em]">ХААНА БАЙДАГ ВЭ?</label>
                  <select className={inputCls} style={{ background: "var(--bg-card)" }} value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}>
                    <option value="">Хот сонгоно уу</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-[7px] tracking-[0.04em]">ТАНЫ ТУХАЙ</label>
                  <textarea className={`${inputCls} resize-none`} placeholder="Өөрийгөө товч танилцуулна уу..." value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} />
                  <div className="text-[11px] text-text-muted text-right mt-1">{form.bio.length}/200</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-2.5 tracking-[0.04em]">СОНИРХОЛ (дурын)</label>
                  <div className="flex flex-wrap gap-[7px]">
                    {INTERESTS.map(i => (
                      <button key={i} onClick={() => setForm(p => ({ ...p, interests: toggle(p.interests, i) }))}
                        className="px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all duration-[180ms]"
                        style={{
                          border: form.interests.includes(i) ? "1px solid #e8415a" : "1px solid rgba(255,255,255,0.1)",
                          background: form.interests.includes(i) ? "rgba(232,65,90,0.12)" : "transparent",
                          color: form.interests.includes(i) ? "#e8415a" : "var(--text-secondary)",
                        }}>{i}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex gap-2.5 mt-6">
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)}
                  className="bg-transparent text-text-primary border border-white/[0.12] rounded-[14px] font-medium text-sm cursor-pointer transition-all duration-[220ms] hover:bg-[rgba(200,48,90,0.08)] hover:border-accent/50 hover:text-accent-light px-5 py-[13px]">
                  ← Буцах
                </button>
              )}
              <button onClick={next} disabled={!canNext()}
                className="flex-1 bg-gradient-to-br from-[#d4365a] to-[#9a1c3e] text-white border-none rounded-[14px] font-semibold text-[15px] cursor-pointer transition-all duration-[220ms] shadow-[0_4px_20px_rgba(200,48,90,0.35)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none py-3.5">
                {step === STEPS.length - 1 ? "🚀 Эхлэх — Багц сонгох" : "Дараагийн алхам →"}
              </button>
            </div>

            {step === 0 && (
              <>
                <div className="flex items-center gap-3 mt-5">
                  <div className="flex-1 h-px bg-white/[0.08]" />
                  <span className="text-xs text-text-muted">эсвэл</span>
                  <div className="flex-1 h-px bg-white/[0.08]" />
                </div>
                <button className="w-full mt-3 bg-transparent text-text-primary border border-white/[0.12] rounded-[14px] font-medium text-sm cursor-pointer transition-all duration-[220ms] hover:bg-[rgba(200,48,90,0.08)] hover:border-accent/50 hover:text-accent-light flex items-center justify-center gap-2 py-3">
                  <span className="font-bold">G</span> Google-аар бүртгүүлэх
                </button>
                <p className="text-center mt-4 text-[13px] text-text-muted">
                  Бүртгэл байгаа?{" "}
                  <Link href="/auth/login"><span className="text-[#e8415a] cursor-pointer font-semibold">Нэвтрэх</span></Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
