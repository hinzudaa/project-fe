"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthBanner from "../_components/AuthBanner";
import { authApi } from "@/apis";
import { useAuth } from "@/store/AuthProvider";
import { setAuthToken } from "@/utils/request";

const GENDERS = [
  { value: "male", label: "Эрэгтэй" },
  { value: "female", label: "Эмэгтэй" },
  { value: "other", label: "Бусад" },
];

export default function RegisterPage() {
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [smsUri, setSmsUri] = useState("");
  const [destination, setDestination] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [step, setStep] = useState<"phone" | "sms">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const router = useRouter();

  const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] text-text-primary px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-text-muted focus:border-[rgba(200,48,90,0.5)] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(200,48,90,0.1)]";
  const labelCls = "block text-[11px] font-bold text-text-muted tracking-[0.08em] uppercase mb-2.5";

  useEffect(() => {
    if (step !== "sms" || !verificationId) return;
    let cancelled = false;

    async function poll() {
      if (cancelled) return;
      try {
        const res = await authApi.phoneStatus(verificationId);
        if (res.user) {
          if (!cancelled) {
            if (res.token) setAuthToken(res.token);
            loginUser(res.user);
            router.push("/");
          }
          return;
        }
        const status = res.phoneVerification?.status;
        if (status === "expired" || status === "failed") {
          if (!cancelled) {
            setError("Хугацаа дууссан. Дахин оролдоно уу.");
            setStep("phone");
          }
          return;
        }
      } catch {
        // ignore transient errors
      }
      if (!cancelled) setTimeout(poll, 2000);
    }

    poll();
    return () => { cancelled = true; };
  }, [step, verificationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await authApi.register({ phone, gender });
      const pv = res.phoneVerification;
      const uri = pv.smsUri ?? "";
      const code = uri.includes("?body=") ? decodeURIComponent(uri.split("?body=")[1]) : "";
      setVerificationId(pv.verificationId);
      setSmsUri(uri);
      setDestination(pv.shortcode ?? "");
      setSmsCode(code);
      setStep("sms");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSms = () => {
    window.location.href = smsUri;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg-primary">

      <div className="w-full h-72 md:h-screen md:w-1/2 md:shrink-0 md:sticky md:top-0 md:self-start border-b md:border-b-0 md:border-r border-white/[0.05]">
        <AuthBanner />
      </div>

      <div className="flex-1 flex items-start md:items-center justify-center px-6 py-10 md:py-12">
        <div className="w-full max-w-[420px]">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 backdrop-blur-sm">

            {step === "phone" ? (
              <>
                <div className="mb-7">
                  <h1 className="font-serif text-[28px] font-bold tracking-[-0.02em] mb-1">Бүртгүүлэх</h1>
                  <p className="text-text-secondary text-sm">Хэдхэн секундэд эхлэх боломжтой</p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className={labelCls}>Утасны дугаар</label>
                    <input
                      className={inputCls}
                      type="tel"
                      placeholder="+976 8014 2409"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Хүйс</label>
                    <div className="flex gap-2">
                      {GENDERS.map(g => (
                        <button
                          key={g.value}
                          type="button"
                          onClick={() => setGender(g.value)}
                          className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border transition-all duration-200 ${gender === g.value
                            ? "bg-[#c8254a] border-[#c8254a] text-white"
                            : "bg-white/[0.04] border-white/[0.08] text-text-muted hover:border-white/20"
                            }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <div
                      onClick={() => setAgreed(p => !p)}
                      className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${agreed
                        ? "bg-[#c8254a] border-[#c8254a]"
                        : "bg-transparent border-white/20 hover:border-white/40"
                        }`}
                    >
                      {agreed && (
                        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                          <path d="M1 3.5L4 6.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[13px] text-text-muted leading-snug">
                      Би{" "}
                      <Link href="/privacy" target="_blank" className="text-white/80 hover:text-white underline transition-colors">
                        Нууцлалын бодлого
                      </Link>
                      {" "}болон{" "}
                      <Link href="/terms" target="_blank" className="text-white/80 hover:text-white underline transition-colors">
                        Үйлчилгээний нөхцөл
                      </Link>
                      -ийг уншиж, зөвшөөрч байна
                    </span>
                  </label>

                  {error && (
                    <p className="text-[13px] text-[#e04878] text-center -mt-1">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={phone.length < 8 || !gender || !agreed || loading}
                    className="w-full text-white border-none rounded-xl font-semibold text-[15px] cursor-pointer transition-all duration-200 py-3.5 mt-1 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 bg-[linear-gradient(135deg,#c8254a,#780f20)] shadow-[0_4px_24px_rgba(200,48,90,0.35)]"
                  >
                    {loading ? "Түр хүлээнэ үү..." : "Үргэлжлүүлэх"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-7">
                  <h1 className="font-serif text-[28px] font-bold tracking-[-0.02em] mb-1">SMS илгээх</h1>
                  <p className="text-text-secondary text-sm">Доорх зааврын дагуу мессеж илгээнэ үү</p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-text-muted tracking-[0.08em] uppercase">Илгээх дугаар</span>
                      <span className="text-[22px] font-bold text-white tracking-wider">{destination}</span>
                    </div>
                    <div className="h-px bg-white/[0.06]" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-text-muted tracking-[0.08em] uppercase">Мессежийн агуулга</span>
                      <span className="text-[22px] font-bold text-[#e8415a] tracking-[0.15em]">{smsCode}</span>
                    </div>
                  </div>

                  <p className="text-[13px] text-text-muted text-center leading-relaxed">
                    <span className="text-white font-semibold">{destination}</span> дугаарт{" "}
                    <span className="text-[#e8415a] font-semibold">{smsCode}</span> кодыг илгээнэ үү
                  </p>

                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#c8254a] animate-pulse" />
                    <p className="text-[13px] text-text-muted">Баталгаажуулалт хүлээж байна...</p>
                  </div>

                  {smsUri && (
                    <button
                      onClick={handleOpenSms}
                      className="w-full text-white border-none rounded-xl font-semibold text-[15px] cursor-pointer transition-all duration-200 py-3.5 hover:-translate-y-0.5 bg-[linear-gradient(135deg,#c8254a,#780f20)] shadow-[0_4px_24px_rgba(200,48,90,0.35)]"
                    >
                      SMS апп нээх
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => { setStep("phone"); setError(""); }}
                    className="text-[13px] text-text-muted hover:text-text-secondary transition-colors text-center bg-transparent border-none cursor-pointer"
                  >
                    ← Дугаар өөрчлөх
                  </button>
                </div>
              </>
            )}

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[11px] text-text-muted tracking-wide">эсвэл</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <p className="text-center text-[13px] text-text-muted">
              Бүртгэлтэй юу?{" "}
              <Link href="/login">
                <span className="text-[#e04878] font-semibold cursor-pointer hover:text-[#c22d50] transition-colors">Нэвтрэх</span>
              </Link>
            </p>
          </div>

          <p className="text-center mt-6 text-[11px] text-white tracking-wide">
            18+ · Зөвхөн насанд хүрэгчдэд
          </p>
          <p className="text-center mt-2 text-[11px] text-white">
            <Link href="/privacy" className="hover:text-text-muted transition-colors">Нууцлалын бодлого</Link>
            {" · "}
            <Link href="/terms" className="hover:text-text-muted transition-colors">Үйлчилгээний нөхцөл</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
