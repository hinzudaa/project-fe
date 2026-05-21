"use client";
import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Globe, ArrowRight, Phone } from "lucide-react";
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
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Top bar */}
      <nav className="relative z-20 px-6 py-6">
        <div className="flex items-center max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Globe size={22} />
            <span className="font-semibold text-lg">Khuslen</span>
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Radial glow behind card */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(60% 50% at 50% 55%, rgba(255,255,255,0.04), rgba(0,0,0,0) 60%)",
          }}
        />

        <div className="relative w-full max-w-md">
          {step === "phone" ? (
            <div className="pane-in liquid-glass-card rounded-[28px] p-7 md:p-9 space-y-6">
              {/* Segmented toggle */}
              <div className="liquid-glass rounded-full p-1 flex items-center">
                <button
                  onClick={() => router.push("/login")}
                  className="relative z-[1] flex-1 text-sm font-medium rounded-full px-5 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Нэвтрэх
                </button>
                <button className="relative z-[1] flex-1 text-sm font-medium rounded-full px-5 py-2 bg-white text-black transition-colors">
                  Бүртгүүлэх
                </button>
              </div>

              {/* Heading */}
              <header className="space-y-2">
                <h1
                  className="text-4xl md:text-5xl leading-[1.05] tracking-tight text-white"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Аяллаа <em className="italic">эхлүүлье</em>.
                </h1>
                <p className="text-white/55 text-sm leading-relaxed">
                  Утасны дугаараа оруулж бүртгэл үүсгэнэ үү.
                </p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Phone field */}
                <label className="block">
                  <div className="field-row flex items-center gap-3">
                    <Phone size={18} className="text-white/45 shrink-0" />
                    <input
                      className="field-input"
                      type="tel"
                      placeholder="+976 8014 2409"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                      autoFocus
                      autoComplete="tel"
                    />
                  </div>
                </label>

                {error && (
                  <p className="text-[13px] text-red-300/80 text-center">{error}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={phone.length < 8 || loading}
                  className="group w-full rounded-full bg-white text-black py-3.5 px-6 text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span>Түр хүлээнэ үү...</span>
                  ) : (
                    <>
                      <span>Бүртгүүлэх</span>
                      <ArrowRight size={16} className="-mr-1 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-[11.5px] leading-relaxed text-white/40 text-center">
                Үргэлжлүүлснээр та манай{" "}
                <Link href="/terms" className="text-white/65 hover:text-white underline underline-offset-2 transition-colors">Үйлчилгээний нөхцөл</Link>
                {" "}болон{" "}
                <Link href="/privacy" className="text-white/65 hover:text-white underline underline-offset-2 transition-colors">Нууцлалын бодлого</Link>
                -г зөвшөөрч байна.
              </p>
            </div>
          ) : (
            <div className="pane-in liquid-glass-card rounded-[28px] p-7 md:p-9 space-y-5">
              <header className="space-y-2 text-center">
                <h1
                  className="text-4xl leading-[1.05] tracking-tight text-white"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  SMS <em className="italic">илгээх</em>.
                </h1>
                <p className="text-white/55 text-sm leading-relaxed">
                  Доорх зааврын дагуу мессеж илгээнэ үү
                </p>
              </header>

              <div className="bg-white/[0.04] rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-white/40 tracking-[0.08em] uppercase">Илгээх дугаар</span>
                  <span className="text-[22px] font-bold text-white tracking-wider">{destination}</span>
                </div>
                <div className="h-px bg-white/[0.06]" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-white/40 tracking-[0.08em] uppercase">Мессежийн агуулга</span>
                  <span className="text-[22px] font-bold text-white/80 tracking-[0.15em]">{smsCode}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center">
                <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                <p className="text-[13px] text-white/50">Баталгаажуулалт хүлээж байна...</p>
              </div>

              {error && <p className="text-[13px] text-red-300/80 text-center">{error}</p>}

              <div className="flex flex-col items-center gap-3 pt-1">
                {smsUri && (
                  <button
                    onClick={() => { window.location.href = smsUri; }}
                    className="group w-full rounded-full bg-white text-black py-3.5 px-6 text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
                  >
                    <span>SMS апп нээх</span>
                    <ArrowRight size={16} className="-mr-1 transition-transform group-hover:translate-x-0.5" />
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
