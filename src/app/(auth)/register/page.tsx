"use client";
import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Globe, ArrowRight, Camera, X } from "lucide-react";
import { authApi } from "@/apis";
import { useAuth } from "@/store/AuthProvider";
import { setAuthToken } from "@/utils/request";

export default function RegisterPage() {
  const [phone, setPhone] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [smsUri, setSmsUri] = useState("");
  const [destination, setDestination] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [step, setStep] = useState<"phone" | "sms">("phone");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  const fadeIn = useCallback(() => {
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    const video = videoRef.current;
    if (!video) return;
    const startOpacity = parseFloat(video.style.opacity || "0");
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / 500, 1);
      video.style.opacity = String(startOpacity + (1 - startOpacity) * progress);
      if (progress < 1) {
        fadeRef.current = requestAnimationFrame(animate);
      } else {
        fadeRef.current = null;
      }
    };
    fadeRef.current = requestAnimationFrame(animate);
  }, []);

  const fadeOut = useCallback(() => {
    if (fadingOutRef.current) return;
    fadingOutRef.current = true;
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    const video = videoRef.current;
    if (!video) return;
    const startOpacity = parseFloat(video.style.opacity || "1");
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / 500, 1);
      video.style.opacity = String(startOpacity * (1 - progress));
      if (progress < 1) {
        fadeRef.current = requestAnimationFrame(animate);
      } else {
        fadeRef.current = null;
      }
    };
    fadeRef.current = requestAnimationFrame(animate);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || fadingOutRef.current || !video.duration) return;
    if (video.duration - video.currentTime <= 0.55) fadeOut();
  }, [fadeOut]);

  const handleEnded = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.style.opacity = "0";
    fadingOutRef.current = false;
    setTimeout(() => {
      video.currentTime = 0;
      video.play();
      fadeIn();
    }, 100);
  }, [fadeIn]);

  const handleCanPlay = useCallback(() => {
    fadeIn();
  }, [fadeIn]);

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
      } catch { }
      if (!cancelled) setTimeout(poll, 2000);
    }
    poll();
    return () => { cancelled = true; };
  }, [step, verificationId, loginUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await authApi.register({ phone, gender: "" });
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

  return (
    <div className="min-h-screen bg-black overflow-hidden relative flex flex-col">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4"
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onCanPlay={handleCanPlay}
          style={{ opacity: 0 }}
          className="absolute inset-0 w-full h-full object-cover translate-y-[17%]"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <h1
          className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {step === "phone" ? "Бүртгүүлэх" : "SMS илгээх"}
        </h1>

        <div className="max-w-xl w-full space-y-4">
          {step === "phone" ? (
            <>
              <div className="liquid-glass rounded-2xl p-7 space-y-5" style={{ backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", background: "rgba(255,255,255,0.05)" }}>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-white/50 tracking-[0.1em] uppercase">
                      Утасны дугаар
                    </label>
                    <div className="bg-white/[0.08] border border-white/[0.14] rounded-xl px-4 py-3.5 flex items-center gap-3 focus-within:border-white/30 focus-within:bg-white/[0.1] transition-all">
                      <input
                        className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30 min-w-0"
                        type="tel"
                        placeholder="+976 8014 2409"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div
                    className="flex items-start gap-3 cursor-pointer"
                    onClick={() => setAgreed(p => !p)}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${agreed ? "bg-white border-white" : "bg-transparent border-white/25 hover:border-white/45"
                      }`}>
                      {agreed && (
                        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                          <path d="M1 3.5L4 6.5L10 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[13px] text-white/55 leading-snug text-left select-none">
                      Би{" "}
                      <Link href="/privacy" target="_blank" onClick={e => e.stopPropagation()} className="text-white/80 hover:text-white underline transition-colors">
                        Нууцлалын бодлого
                      </Link>
                      {" "}болон{" "}
                      <Link href="/terms" target="_blank" onClick={e => e.stopPropagation()} className="text-white/80 hover:text-white underline transition-colors">
                        Үйлчилгээний нөхцөл
                      </Link>
                      -ийг уншиж, зөвшөөрч байна
                    </span>
                  </div>

                  {error && <p className="text-[13px] text-red-400 text-center">{error}</p>}

                  <button
                    type="submit"
                    disabled={phone.length < 8 || !agreed || loading}
                    className="w-full bg-white text-black rounded-xl font-semibold text-[15px] py-3.5 flex items-center justify-center gap-2 disabled:opacity-35 disabled:cursor-not-allowed hover:bg-white/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-[0_4px_24px_rgba(255,255,255,0.15)]"
                  >
                    {loading ? "Түр хүлээнэ үү..." : (
                      <>Бүртгүүлэх</>
                    )}
                  </button>

                  <p className="text-white text-sm leading-relaxed px-4">
                    Бүртгэлтэй юу?{" "}

                  </p>
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full bg-white text-black rounded-xl font-semibold text-[15px] py-3.5 flex items-center justify-center gap-2 disabled:opacity-35 disabled:cursor-not-allowed hover:bg-white/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-[0_4px_24px_rgba(255,255,255,0.15)]"
                  >
                    <>Нэвтрэх</>
                  </button>
                </form>
              </div>
              <div className="flex justify-center">
                <span className="text-[11px] text-white/30 tracking-wide">18+ · Зөвхөн насанд хүрэгчдэд</span>
              </div>
            </>
          ) : (
            <>
              <div className="liquid-glass rounded-2xl p-6 text-left space-y-4">
                <p className="text-white/60 text-sm text-center">Доорх зааврын дагуу мессеж илгээнэ үү</p>

                <div className="bg-white/[0.04] rounded-xl p-5 flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-white/50 tracking-[0.08em] uppercase">Илгээх дугаар</span>
                    <span className="text-[22px] font-bold text-white tracking-wider">{destination}</span>
                  </div>
                  <div className="h-px bg-white/[0.06]" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-white/50 tracking-[0.08em] uppercase">Мессежийн агуулга</span>
                    <span className="text-[22px] font-bold text-white/80 tracking-[0.15em]">{smsCode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                  <p className="text-[13px] text-white/50">Баталгаажуулалт хүлээж байна...</p>
                </div>

                {error && <p className="text-[13px] text-red-400 text-center">{error}</p>}
              </div>

              <div className="flex flex-col items-center gap-3">
                {smsUri && (
                  <button
                    onClick={() => { window.location.href = smsUri; }}
                    className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors"
                  >
                    SMS апп нээх
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { setStep("phone"); setError(""); }}
                  className="text-[13px] text-white/50 hover:text-white/70 transition-colors bg-transparent border-none cursor-pointer"
                >
                  ← Дугаар өөрчлөх
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
