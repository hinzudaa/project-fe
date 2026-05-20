"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthBanner from "../_components/AuthBanner";
import { authApi } from "@/apis";
import { useAuth } from "@/store/AuthProvider";
import { setAuthToken } from "@/utils/request";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
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
      const res = await authApi.login({ phone });
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
                  <h1 className="font-serif text-[28px] font-bold tracking-[-0.02em] mb-1">Нэвтрэх</h1>
                  <p className="text-text-secondary text-sm">Утасны дугаараа оруулна уу</p>
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

                  {error && (
                    <p className="text-[13px] text-[#e04878] text-center -mt-1">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={phone.length < 8 || loading}
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
              Бүртгэл байхгүй юу?{" "}
              <Link href="/register">
                <span className="text-[#e04878] font-semibold cursor-pointer hover:text-[#c22d50] transition-colors">Бүртгүүлэх</span>
              </Link>
            </p>
          </div>

          <p className="text-center mt-6 text-[11px] text-text-muted/50 tracking-wide">
            18+ · Зөвхөн насанд хүрэгчдэд
          </p>
        </div>
      </div>
    </div>
  );
}
