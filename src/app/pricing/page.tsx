"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, Zap, Film, Heart, Bot } from "lucide-react";
import { membershipApi, MembershipPlan, QPayInvoice } from "@/apis";
import QPayModal from "@/components/QPayModal";
import { useAuth } from "@/store/AuthProvider";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? "";

function resolveUrl(url?: string) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}

function formatLimit(val: number, unit: string) {
  if (val < 0) return `Хязгааргүй ${unit}`;
  return `${unit} өдөрт ${val}`;
}

const TIER_STYLE: Record<string, { label: string; badge: string; glow: string; selBorder: string }> = {
  basic: {
    label: "Basic",
    badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    glow: "shadow-[0_0_48px_rgba(16,185,129,0.18)]",
    selBorder: "1px solid rgba(16,185,129,0.45)",
  },
  standard: {
    label: "Standard",
    badge: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    glow: "shadow-[0_0_48px_rgba(59,130,246,0.18)]",
    selBorder: "1px solid rgba(59,130,246,0.45)",
  },
  premium: {
    label: "Premium",
    badge: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    glow: "shadow-[0_0_48px_rgba(168,85,247,0.22)]",
    selBorder: "1px solid rgba(168,85,247,0.45)",
  },
};

interface ActiveInvoice {
  invoice: QPayInvoice;
  membershipId: string;
  plan: MembershipPlan;
}

export default function PricingPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [selected, setSelected] = useState<string>("");
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<ActiveInvoice | null>(null);
  const [error, setError] = useState("");

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
    membershipApi.getPlans()
      .then(res => {
        setPlans(res.plans);
        if (res.plans.length > 0) setSelected(res.plans[0]._id);
      })
      .catch(() => setError("Багцуудыг ачаалахад алдаа гарлаа"))
      .finally(() => setPlansLoading(false));
  }, []);

  const handleBuy = async (plan: MembershipPlan) => {
    setBuyingId(plan._id);
    setError("");
    try {
      const res = await membershipApi.purchase(plan._id);
      setActiveInvoice({ invoice: res.invoice, membershipId: res.membershipId, plan });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нэхэмжлэл үүсгэхэд алдаа гарлаа");
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Fixed video background */}
      <div className="fixed inset-0 z-0">
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
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {activeInvoice && (
        <QPayModal
          invoice={activeInvoice.invoice}
          membershipId={activeInvoice.membershipId}
          plan={activeInvoice.plan}
          onPaid={async () => { await refreshUser(); router.push("/onboarding"); }}
          onClose={() => setActiveInvoice(null)}
        />
      )}

      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 pt-24 pb-16">

        {/* Heading */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl text-white mb-3 tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Багцаа сонгоно уу
          </h1>
          <p className="text-white/50 text-sm">QPay-аар шууд төлөх боломжтой</p>
          {error && <p className="text-[13px] text-red-400 mt-3">{error}</p>}
        </div>

        {plansLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-white/40" />
          </div>
        ) : plans.length === 0 ? (
          <p className="text-center text-white/40">Идэвхтэй багц олдсонгүй</p>
        ) : (
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
            {plans.map(plan => {
              const isSel = selected === plan._id;
              const isBuying = buyingId === plan._id;
              const tier = TIER_STYLE[plan.tier] ?? TIER_STYLE.basic;
              const imgUrl = resolveUrl(plan.image?.url);

              const features: { icon: React.ReactNode; text: string }[] = [];
              if (plan.swipeDailyLimit !== 0) features.push({ icon: <Heart size={13} />, text: formatLimit(plan.swipeDailyLimit, "Swipe") });
              if (plan.aiHumanDailyMessageLimit !== 0) features.push({ icon: <Bot size={13} />, text: formatLimit(plan.aiHumanDailyMessageLimit, "AI мессеж") });
              if (plan.movieComplimentaryQuota > 0) features.push({ icon: <Film size={13} />, text: `${plan.movieComplimentaryQuota} Бичлэг үнэгүй` });

              return (
                <div
                  key={plan._id}
                  onClick={() => setSelected(plan._id)}
                  className={`liquid-glass rounded-[28px] cursor-pointer relative transition-all duration-300 overflow-hidden flex flex-col ${isSel ? tier.glow : ''}`}
                  style={{
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    background: isSel ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
                    ...(isSel && { border: tier.selBorder }),
                  }}
                >
                  {/* Cover image */}
                  {imgUrl && (
                    <div className="relative w-full aspect-[16/9] overflow-hidden">
                      <img src={imgUrl} alt={plan.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1 gap-4">
                    {/* Tier + month badges */}
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${tier.badge}`}>
                        {tier.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                        isSel ? "bg-white/15 text-white" : "bg-white/[0.06] text-white/40"
                      }`}>
                        {plan.months === 1 ? "1 сар" : `${plan.months} сар`}
                      </span>
                    </div>

                    {/* Title + price */}
                    <div>
                      <div className="text-xs font-bold text-white/40 tracking-[0.06em] mb-1 uppercase">
                        {plan.title}
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className="text-[34px] font-black text-white"
                          style={{ fontFamily: "'Instrument Serif', serif" }}
                        >
                          ₮{plan.price.toLocaleString()}
                        </span>
                        <span className="text-[13px] text-white/40">
                          /{plan.months === 1 ? "сар" : `${plan.months} сар`}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {plan.description && (
                      <p className="text-[13px] text-white/55 leading-relaxed whitespace-pre-line">
                        {plan.description}
                      </p>
                    )}

                    {/* Feature list */}
                    {features.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-[13px]">
                            <span className="shrink-0 text-white/40">{f.icon}</span>
                            <span className="text-white/75">{f.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Buy button */}
                    <button
                      disabled={isBuying}
                      onClick={e => { e.stopPropagation(); handleBuy(plan); }}
                      className={`mt-auto w-full py-3 rounded-[14px] font-bold text-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 border-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSel
                          ? "bg-white text-black shadow-[0_4px_24px_rgba(255,255,255,0.15)]"
                          : "bg-white/[0.07] text-white/50 hover:bg-white/[0.12] hover:text-white/70"
                      }`}
                    >
                      {isBuying
                        ? <Loader2 size={14} className="animate-spin" />
                        : isSel ? <Zap size={14} /> : <Check size={14} />}
                      {isBuying
                        ? "Нэхэмжлэл үүсгэж байна..."
                        : isSel ? "QPay-аар төлөх" : "Сонгох"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
