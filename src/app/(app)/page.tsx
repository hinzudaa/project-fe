"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Film, Flame, Heart, Zap, Lock, CheckCircle, ChevronRight, MessageSquare, Play, Users, Tv2Icon, MapPin, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/store/AuthProvider";
import { swipeApi, SwipeUser, SwipeQuota, movieApi, Movie, MatchResult } from "@/apis";

interface HomeData {
  feedTotal: number;
  matchTotal: number;
  quota: SwipeQuota | null;
  recentMatches: { _id: string; target: SwipeUser }[];
  likes: { _id: string; user: SwipeUser }[];
  movies: Movie[];
}

const BASE_URL = "https://projectm.zuraach.site";

function resolveAvatar(avatar?: string | null, photos?: string[]) {
  const url = avatar || (photos && photos.length > 0 ? photos[0] : null);
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL}${url}`;
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data, isLoading, mutate } = useSWR<HomeData>("home-dashboard", async () => {
    const [feedRes, matchRes, likesRes, moviesRes] = await Promise.all([
      swipeApi.getFeedSingle(),
      swipeApi.getMatches(),
      swipeApi.getLikes(),
      movieApi.list(1, 10),
    ]);
    return {
      feedTotal: feedRes.total,
      matchTotal: matchRes.total,
      quota: feedRes.quota,
      recentMatches: matchRes.data,
      likes: likesRes.data,
      movies: moviesRes.data,
    };
  });

  const [localLikes, setLocalLikes] = useState<{ _id: string; user: SwipeUser }[]>([]);
  const [swipedActions, setSwipedActions] = useState<Record<string, "left" | "right">>(Object.create(null));
  const [swiping, setSwiping] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  useEffect(() => {
    if (data?.likes) {
      setLocalLikes(data.likes.filter(entry => !swipedActions[entry._id]));
    }
  }, [data?.likes]);

  const handleSwipe = async (entry: { _id: string; user: SwipeUser }, action: "like" | "pass") => {
    if (swiping) return;
    const targetId = entry.user._id;

    setSwipedActions(prev => ({ ...prev, [entry._id]: action === "like" ? "right" : "left" }));
    setSwiping(true);

    await new Promise(resolve => setTimeout(resolve, 400));

    try {
      const res = await swipeApi.performSwipe(targetId, action === "like" ? "like" : "pass");
      if (res.isNewMatch && res.match) {
        setMatchResult(res.match);
      }
    } catch (err) {
      console.error("Home swipe failed:", err);
    }

    setLocalLikes(prev => prev.filter(item => item._id !== entry._id));
    setSwiping(false);
    mutate();
  };

  const displayName = user?.username ?? user?.name ?? "Хэрэглэгч";

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-t-2 border-[#FF2D55] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart size={16} className="text-[#FF2D55]" fill="currentColor" />
          </div>
        </div>
        <p className="text-text-muted text-sm font-medium animate-pulse">Ачаалж байна...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-[#F6F0F3] overflow-hidden -m-5 md:-m-7 p-5 md:p-7">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#0B090B] bg-[radial-gradient(1100px_680px_at_72%_-8%,rgba(255,45,85,0.16),transparent_60%),_radial-gradient(820px_560px_at_4%_2%,rgba(255,92,138,0.07),transparent_55%)]" />

      {/* Main Container */}
      <div className="relative z-10 max-w-[1080px] mx-auto pb-10">

        {/* GREETING */}
        <div className="text-left mb-6">
          <h1 className="font-serif text-[34px] font-bold m-0 tracking-[-0.01em] text-white">
            Сайн байна уу, <span className="text-[#FF2D55]">{displayName}</span> 👋
          </h1>
          <p className="mt-[9px] mb-0 text-[#F6F0F3]/60 text-[16px]">
            Өнөөдөр таныг <strong className="text-white font-bold">{data.feedTotal} шинэ хүн</strong> хүлээж байна.
          </p>
        </div>

        {/* Match modal overlay */}
        {matchResult && (
          <>
            <style>{`
              @keyframes matchModalIn { from { opacity:0; transform:scale(0.75) translateY(24px); } to { opacity:1; transform:scale(1) translateY(0); } }
              @keyframes matchAvatarPop { 0% { opacity:0; transform:scale(0) rotate(-12deg); } 65% { transform:scale(1.12) rotate(3deg); opacity:1; } 100% { transform:scale(1) rotate(0deg); opacity:1; } }
              @keyframes matchRingPulse { 0% { transform:scale(1); opacity:0.7; } 100% { transform:scale(2.8); opacity:0; } }
              @keyframes matchHeartBeat { 0%,100% { transform:scale(1); } 30% { transform:scale(1.25); } 60% { transform:scale(0.92); } 80% { transform:scale(1.1); } }
              @keyframes matchHeartFloat { 0% { opacity:0; transform:translateY(0) scale(0.6) rotate(var(--r)); } 15% { opacity:1; } 85% { opacity:0.5; } 100% { opacity:0; transform:translateY(-220px) scale(1.2) rotate(var(--r)); } }
              @keyframes matchTextUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
            `}</style>

            <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-[14px] p-5 overflow-hidden bg-black/88">
              {[
                { l: "8%", d: 0, r: "-15deg", dur: 2.8 }, { l: "20%", d: 0.4, r: "10deg", dur: 3.1 },
                { l: "35%", d: 0.15, r: "-5deg", dur: 2.5 }, { l: "50%", d: 0.6, r: "20deg", dur: 3.3 },
                { l: "63%", d: 0.25, r: "-12deg", dur: 2.7 }, { l: "77%", d: 0.5, r: "8deg", dur: 3.0 },
                { l: "88%", d: 0.1, r: "-20deg", dur: 2.9 },
              ].map((h, i) => (
                <div key={i} className="absolute bottom-[12%] text-[20px] pointer-events-none select-none"
                  style={{ left: h.l, ["--r" as string]: h.r, animation: `matchHeartFloat ${h.dur}s ease-out ${h.d}s infinite` }}>❤️</div>
              ))}

              <div className="rounded-[32px] px-8 py-10 text-center w-full max-w-[340px] relative z-10 bg-[#0a0616]/98 border border-[#FF2D55]/28 shadow-[0_0_80px_rgba(255,45,85,0.22),_0_24px_60px_rgba(0,0,0,0.6)] animate-[matchModalIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)_both]">
                <div className="flex items-center justify-center gap-3 mb-7">
                  <div className="w-[66px] h-[66px] rounded-full overflow-hidden flex items-center justify-center text-[26px] font-black text-white shrink-0 shadow-[0_4px_24px_rgba(255,45,85,0.55)] animate-[matchAvatarPop_0.6s_cubic-bezier(0.34,1.56,0.64,1)_0.15s_both] bg-gradient-to-br from-[#FF2D55] to-[#FF5C8A]">
                    {user?.avatar ? (
                      <img src={resolveAvatar(user.avatar, user.photos)!} className="w-full h-full object-cover" alt="" />
                    ) : (
                      (user?.name ?? "М")[0].toUpperCase()
                    )}
                  </div>

                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#FF2D55]/35 animate-[matchRingPulse_1.3s_ease-out_0.6s_infinite]" />
                    <div className="absolute inset-0 rounded-full bg-[#FF2D55]/20 animate-[matchRingPulse_1.3s_ease-out_0.9s_infinite]" />
                    <div className="w-10 h-10 rounded-full flex items-center justify-center relative z-10 bg-gradient-to-br from-[#FF2D55] to-[#F5C451] shadow-[0_0_24px_rgba(255,45,85,0.8)] animate-[matchHeartBeat_1.1s_ease-in-out_0.7s_infinite]">
                      <Heart size={17} fill="white" strokeWidth={0} />
                    </div>
                  </div>

                  <div className="w-[66px] h-[66px] rounded-full overflow-hidden flex items-center justify-center text-[26px] font-black text-white shrink-0 shadow-[0_4px_24px_rgba(255,45,85,0.4)] animate-[matchAvatarPop_0.6s_cubic-bezier(0.34,1.56,0.64,1)_0.3s_both] bg-gradient-to-br from-[#FF2D55] to-[#8b5cf6]">
                    {matchResult.target.avatar ? (
                      <img src={resolveAvatar(matchResult.target.avatar, matchResult.target.photos)!} className="w-full h-full object-cover" alt="" />
                    ) : (
                      (matchResult.target.name ?? matchResult.target.username ?? "?")[0].toUpperCase()
                    )}
                  </div>
                </div>

                <h2 className="font-serif text-[28px] font-black mb-2 text-[#FF2D55] animate-[matchTextUp_0.45s_ease-out_0.45s_both]">
                  Match болсон!
                </h2>
                <p className="text-[#F6F0F3]/60 text-[14px] mb-7 leading-relaxed animate-[matchTextUp_0.45s_ease-out_0.6s_both]">
                  Та болон <strong className="text-white">{matchResult.target.name ?? matchResult.target.username}</strong> хоёр бие биедээ таалагдсан байна.
                </p>
                <div className="flex gap-2.5 animate-[matchTextUp_0.45s_ease-out_0.8s_both]">
                  <button onClick={() => setMatchResult(null)}
                    className="flex-1 py-3 rounded-[14px] text-[13px] font-medium text-[#F6F0F3]/60 border border-white/10 hover:text-white bg-transparent cursor-pointer transition-colors duration-200">
                    Үргэлжлүүлүх
                  </button>
                  <Link href={`/chat?user=${matchResult.target._id}`} onClick={() => setMatchResult(null)} className="flex-1 no-underline">
                    <button className="w-full py-3 rounded-[14px] text-[13px] font-bold text-white border-none cursor-pointer bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] shadow-[0_4px_20px_rgba(255,45,85,0.4)] transition-transform duration-200 hover:-translate-y-0.5">
                      Мессеж
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[18px] mt-[26px]">
          {/* Card 1: New Profiles */}
          <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/8 rounded-[22px] p-[22px_24px] relative transition-all duration-200 hover:-translate-y-[3px] hover:border-[#FF2D55]/30 text-left">
            <div className="flex items-start justify-between">
              <div className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center bg-gradient-to-br from-[#FF2D55]/18 to-[#FF5C8A]/8 border border-[#FF2D55]/20 text-[#FF2D55]">
                <Users size={22} />
              </div>
              <span className="text-[12px] font-semibold px-2.5 py-1.25 rounded-full bg-[#FF2D55]/12 text-[#FF9CB2]">
                ↑ 12 өнөөдөр
              </span>
            </div>
            <div className="text-[38px] font-extrabold mt-[18px] tracking-[-0.02em] leading-none text-white">
              {data.feedTotal}
            </div>
            <div className="mt-[7px] text-[12px] font-semibold tracking-[0.12em] uppercase text-[#F6F0F3]/45">
              Шинэ профайл
            </div>
          </div>

          {/* Card 2: Match Count */}
          <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/8 rounded-[22px] p-[22px_24px] relative transition-all duration-200 hover:-translate-y-[3px] hover:border-[#FF2D55]/30 text-left">
            <div className="flex items-start justify-between">
              <div className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center bg-gradient-to-br from-[#FF2D55]/18 to-[#FF5C8A]/8 border border-[#FF2D55]/20 text-[#FF2D55]">
                <Heart size={22} />
              </div>
              <span className="text-[12px] font-semibold px-2.5 py-1.25 rounded-full bg-[#FF2D55]/12 text-[#FF9CB2]">
                ↑ 2 шинэ
              </span>
            </div>
            <div className="text-[38px] font-extrabold mt-[18px] tracking-[-0.02em] leading-none text-white">
              {data.matchTotal}
            </div>
            <div className="mt-[7px] text-[12px] font-semibold tracking-[0.12em] uppercase text-[#F6F0F3]/45">
              Match
            </div>
          </div>

          {/* Card 3: Swipe Remaining */}
          <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/8 rounded-[22px] p-[22px_24px] relative transition-all duration-200 hover:-translate-y-[3px] hover:border-[#FF2D55]/30 text-left">
            <div className="flex items-start justify-between">
              <div className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center bg-gradient-to-br from-[#FF2D55]/18 to-[#FF5C8A]/8 border border-[#FF2D55]/20 text-[#FF2D55]">
                <Zap size={22} />
              </div>
              <span className="text-[12px] font-semibold px-2.5 py-1.25 rounded-full bg-white/7 text-[#F6F0F3]/55">
                {data.quota ? `${data.quota.limit}-аас` : "25-аас"}
              </span>
            </div>
            <div className="text-[38px] font-extrabold mt-[18px] tracking-[-0.02em] leading-none text-white">
              {data.quota ? data.quota.remaining : "—"}
            </div>
            <div className="mt-[7px] text-[12px] font-semibold tracking-[0.12em] uppercase text-[#F6F0F3]/45">
              Swipe үлдсэн
            </div>
          </div>
        </div>

        {/* HERO DISCOVER */}
        <Link href="/swipe" className="block mt-[18px] group no-underline">
          <div className="relative overflow-hidden rounded-[24px] p-[30px_34px] flex items-center justify-between gap-6 border border-[#FF2D55]/22 bg-[#160810] bg-[radial-gradient(560px_280px_at_88%_50%,rgba(255,45,85,0.30),transparent_70%),_linear-gradient(120deg,rgba(255,45,85,0.16),rgba(255,92,138,0.05))]">
            <div className="min-w-0 text-left">
              <span className="inline-block text-[11px] font-bold tracking-[0.14em] px-[11px] py-[5px] rounded-full bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] text-white">
                DISCOVER
              </span>
              <h2 className="font-serif text-[27px] font-bold mt-[14px] mb-0 text-white leading-tight">
                Шинэ хүнтэй танилцах
              </h2>
              <p className="m-0 mt-2 text-[#F6F0F3]/65 text-[15px]">
                Танд таалагдах <strong className="text-white font-bold">{data.feedTotal} хүн</strong> хүлээж байна
              </p>
              <div className="flex items-center gap-3 mt-[18px]">
                <div className="flex -space-x-3">
                  <div className="w-[34px] h-[34px] rounded-full border-2 border-[#160810] bg-[repeating-linear-gradient(135deg,rgba(255,92,138,0.5)_0_6px,rgba(255,45,85,0.3)_6px_12px)]"></div>
                  <div className="w-[34px] h-[34px] rounded-full border-2 border-[#160810] bg-[repeating-linear-gradient(135deg,rgba(139,92,246,0.5)_0_6px,rgba(255,45,85,0.3)_6px_12px)]"></div>
                  <div className="w-[34px] h-[34px] rounded-full border-2 border-[#160810] bg-[repeating-linear-gradient(135deg,rgba(255,196,81,0.45)_0_6px,rgba(255,92,138,0.35)_6px_12px)]"></div>
                </div>
                <span className="text-[13px] font-semibold text-[#F6F0F3]/70">
                  +38 хүн идэвхтэй
                </span>
              </div>
            </div>
            <div className="shrink-0 w-[62px] h-[62px] rounded-full flex items-center justify-center bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] text-white shadow-[0_12px_30px_rgba(255,45,85,0.4)] transition-transform duration-200 group-hover:scale-108">
              <ChevronRight size={26} strokeWidth={2.4} />
            </div>
          </div>
        </Link>

        {/* DAILY LIMIT */}
        {data.quota && (
          <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/8 rounded-[22px] p-[22px_26px] mt-4 text-left">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-[13px]">
                <div className="w-[38px] h-[38px] shrink-0 rounded-[11px] flex items-center justify-center bg-gradient-to-br from-[#FF2D55]/18 to-[#FF5C8A]/8 border border-[#FF2D55]/20 text-[#FF2D55]">
                  <Flame size={20} />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-white">Өнөөдрийн эрх</div>
                  <div className="text-[13px] text-[#F6F0F3]/50 mt-0.5">Таны өдөрт ашиглах swipe-ийн хязгаар</div>
                </div>
              </div>
              <div className="text-right">
                <div>
                  <span className="text-[22px] font-extrabold text-[#FF2D55]">{data.quota.remaining}</span>
                  <span className="text-[15px] font-semibold text-[#F6F0F3]/45"> / {data.quota.limit}</span>
                </div>
                <div className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#F6F0F3]/40 mt-px">Үлдсэн</div>
              </div>
            </div>
            <div className="h-2.5 rounded-full bg-white/8 overflow-hidden mt-[18px]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF5C8A] to-[#FF2D55] shadow-[0_0_16px_rgba(255,45,85,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, (data.quota.used / data.quota.limit) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* NEW MATCH */}
        <div className="flex items-center justify-between mt-[38px]">
          <div className="flex items-center gap-2.5">
            <Heart size={20} className="text-[#FF2D55]" fill="#FF2D55" />
            <h3 className="font-serif text-[21px] font-bold m-0 text-white">Шинэ Match</h3>
          </div>
          <Link href="/chat" className="flex items-center gap-1 text-[14px] font-semibold text-[#FF2D55] hover:underline no-underline">
            Бүгд <ChevronRight size={15} strokeWidth={2.4} />
          </Link>
        </div>

        {data.recentMatches && data.recentMatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {data.recentMatches.map(m => {
              const age = m.target.birthYear ? new Date().getFullYear() - m.target.birthYear : null;
              const avatarUrl = resolveAvatar(m.target.avatar, m.target.photos);
              return (
                <Link key={m._id} href="/chat" className="no-underline group block">
                  <div className="rounded-[18px] overflow-hidden border border-white/8 bg-white/3 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[#FF2D55]/40 hover:shadow-[0_16px_40px_rgba(255,45,85,0.16)]">
                    <div className="relative h-[188px] bg-[#1a1216] bg-[radial-gradient(180deg,rgba(11,9,11,0)_38%,rgba(11,9,11,0.9)_100%),_repeating-linear-gradient(135deg,rgba(255,92,138,0.12)_0_11px,rgba(255,92,138,0.04)_11px_22px)] flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <>
                          <img src={avatarUrl} alt={m.target.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B090B]/90 via-transparent to-transparent" />
                        </>
                      ) : (
                        <span className="text-white/20 font-bold text-2xl uppercase">
                          {(m.target.name ?? m.target.username ?? "?").charAt(0)}
                        </span>
                      )}

                      {m.target.isOnline && (
                        <span className="absolute top-2.5 right-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-white bg-black/42 px-[9px] py-1 rounded-full">
                          <span className="w-[7px] h-[7px] rounded-full bg-[#4ade80] animate-his-pulse"></span>
                          Идэвхтэй
                        </span>
                      )}

                      <div className="absolute left-3.5 right-3.5 bottom-3 text-left">
                        <div className="text-[17px] font-bold text-white truncate">
                          {m.target.name ?? m.target.username ?? "Хэрэглэгч"}{age ? `, ${age}` : ""}
                        </div>
                        <div className="flex items-center gap-1 mt-[3px] text-[12px] text-white/65">
                          <MapPin size={12} />
                          Улаанбаатар
                        </div>
                      </div>
                    </div>
                    <div className="p-3 text-left">
                      <div className="w-full p-2.25 rounded-[11px] border-none bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-transform duration-200 group-hover:scale-[1.02]">
                        <MessageSquare size={15} />
                        Мессеж бичих
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="w-full py-10 px-4 rounded-[22px] border border-white/8 bg-white/3 flex flex-col items-center justify-center gap-3 text-[#F6F0F3]/40 mt-4">
            <Heart size={28} strokeWidth={1.2} />
            <p className="text-[13px] font-medium m-0">Одоогоор match байхгүй</p>
          </div>
        )}

        {/* SUGGESTED */}
        <div className="flex items-center justify-between mt-[34px]">
          <div className="flex items-center gap-2.5">
            <Zap size={20} className="text-[#FF2D55]" fill="#FF2D55" />
            <h3 className="font-serif text-[21px] font-bold m-0 text-white">Түүнд таалагдсан</h3>
          </div>
          <Link href="/likes" className="flex items-center gap-1 text-[14px] font-semibold text-[#FF2D55] hover:underline no-underline">
            Бүгд <ChevronRight size={15} strokeWidth={2.4} />
          </Link>
        </div>

        {localLikes && localLikes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {localLikes.map(l => {
              const age = l.user.birthYear ? new Date().getFullYear() - l.user.birthYear : null;
              const avatarUrl = resolveAvatar(l.user.avatar, l.user.photos);
              const matchPercent = 85 + (l._id.charCodeAt(0) % 15);
              const isSwipedRight = swipedActions[l._id] === "right";
              const isSwipedLeft = swipedActions[l._id] === "left";

              return (
                <div
                  key={l._id}
                  className={`rounded-[18px] overflow-hidden border border-white/8 bg-white/3 transition-all duration-200 hover:-translate-y-1 hover:border-[#FF2D55]/40 hover:shadow-[0_16px_40px_rgba(255,45,85,0.16)] group ${isSwipedLeft ? "animate-swipe-left" : isSwipedRight ? "animate-swipe-right" : ""
                    }`}
                >
                  <div className="relative h-[188px] bg-[#181420] flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={l.user.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FF2D55]/10 to-[#9b59ff]/10 text-white/20 font-bold text-2xl">
                        {(l.user.name ?? "?").charAt(0).toUpperCase()}
                      </div>
                    )}

                    <span className="absolute top-2.5 right-2.5 text-[11px] font-bold text-white bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] px-[9px] py-1 rounded-full z-30">
                      {matchPercent}% таарц
                    </span>

                    <div className="absolute left-3.5 right-3.5 bottom-3 text-left">
                      <div className="text-[17px] font-bold text-white truncate">
                        {l.user.name ?? l.user.username ?? "Хэрэглэгч"}{age ? `, ${age}` : ""}
                      </div>
                      <div className="flex items-center gap-1 mt-[3px] text-[12px] text-white/65">
                        <MapPin size={12} />
                        Улаанбаатар
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 p-3">
                    <button
                      onClick={() => handleSwipe(l, "pass")}
                      className="flex-1 p-2.25 rounded-[11px] border border-white/12 bg-white/4 text-[#F6F0F3]/70 flex items-center justify-center cursor-pointer hover:bg-white/12 transition-colors duration-200"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => handleSwipe(l, "like")}
                      className="flex-1 p-2.25 rounded-[11px] border-none bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] text-white flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.03] active:scale-95 duration-200"
                    >
                      <Heart size={16} fill="currentColor" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full py-10 px-4 rounded-[22px] border border-white/8 bg-white/3 flex flex-col items-center justify-center gap-3 text-[#F6F0F3]/40 mt-4">
            <Zap size={28} strokeWidth={1.2} />
            <p className="text-[13px] font-medium m-0">Хэн нэгэнд лайк дарж эхлээрэй</p>
          </div>
        )}

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-[38px]">
          <Link href="/roleplay" className="no-underline group">
            <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/8 rounded-[20px] p-[22px] flex flex-col gap-[14px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[#FF2D55]/35 h-full text-left">
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] text-white">
                <Play size={22} fill="currentColor" />
              </div>
              <div>
                <div className="text-[16px] font-bold text-white">Roleplay</div>
                <div className="text-[13px] text-[#F6F0F3]/50 mt-0.75 leading-tight">Дүрд тоглон чатлах</div>
              </div>
            </div>
          </Link>

          <Link href="/forum" className="no-underline group">
            <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/8 rounded-[20px] p-[22px] flex flex-col gap-[14px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[#FF2D55]/35 h-full text-left">
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] text-white">
                <Users size={22} />
              </div>
              <div>
                <div className="text-[16px] font-bold text-white">Forum</div>
                <div className="text-[13px] text-[#F6F0F3]/50 mt-0.75 leading-tight">Нийтийн хэлэлцүүлэг</div>
              </div>
            </div>
          </Link>

          <Link href="/chat" className="no-underline group">
            <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/8 rounded-[20px] p-[22px] flex flex-col gap-[14px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[#FF2D55]/35 h-full text-left">
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] text-white">
                <MessageSquare size={22} />
              </div>
              <div>
                <div className="text-[16px] font-bold text-white">Chat</div>
                <div className="text-[13px] text-[#F6F0F3]/50 mt-0.75 leading-tight">Шууд мессеж бичих</div>
              </div>
            </div>
          </Link>

          <Link href="/movies" className="no-underline group">
            <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/8 rounded-[20px] p-[22px] flex flex-col gap-[14px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[#FF2D55]/35 h-full text-left">
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] text-white">
                <Tv2Icon size={22} />
              </div>
              <div>
                <div className="text-[16px] font-bold text-white">Бичлэг</div>
                <div className="text-[13px] text-[#F6F0F3]/50 mt-0.75 leading-tight">Видео контент үзэх</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Featured Movies Section */}
        {data.movies && data.movies.length > 0 && (
          <div className="mb-12 pt-10 mt-10 border-t border-white/8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF2D55]/10 border border-[#FF2D55]/20 flex items-center justify-center text-[#FF2D55]">
                  <Film size={20} />
                </div>
                <div className="text-left">
                  <h2 className="text-[20px] font-bold text-white font-serif tracking-tight m-0">Онцлох бичлэг</h2>
                  <p className="text-[12px] text-[#F6F0F3]/50 m-0 mt-0.5">Танд зориулсан шинэ контент</p>
                </div>
              </div>
              <Link href="/movies" className="px-4 py-2 rounded-xl bg-white/5 text-[13px] font-bold text-white hover:bg-white/10 transition-all flex items-center gap-2 no-underline">
                Бүгдийг үзэх <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {data.movies.slice(0, 3).map(m => <HomeMovieCard key={m._id} movie={m} />)}
            </div>
          </div>
        )}

      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

const BASE_URL_MOVIE = "https://projectm.zuraach.site";
function resolveMovieImg(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL_MOVIE}${url}`;
}

function HomeMovieCard({ movie }: { movie: Movie }) {
  const img = resolveMovieImg(movie.image?.url);
  const isOwned = movie.owned;

  return (
    <Link href="/movies" className="no-underline block group h-full">
      <div className="relative w-full rounded-[24px] overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] cursor-pointer transition-all duration-[400ms] hover:border-[#FF2D55]/50 hover:shadow-[0_20px_45px_rgba(255,45,85,0.15)] hover:-translate-y-1.5 group flex flex-col h-full">
        
        {/* Cinematic Backdrop Image */}
        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-white/5 to-white/2 shrink-0">
          {img ? (
            <img
              src={img}
              alt={movie.title}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!isOwned ? "blur-[20px] opacity-75" : ""}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/2">
              <Film size={36} className="text-white/10" />
            </div>
          )}

          {/* Immersive Dark Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#040208] via-transparent to-black/20" />

          {/* Interactive Play Overlay for owned movies on hover */}
          {isOwned && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <Play size={20} fill="white" strokeWidth={0} className="ml-1" />
              </div>
            </div>
          )}

          {/* Interactive Lock Overlay for unowned movies on hover */}
          {!isOwned && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <Lock size={16} strokeWidth={2} className="text-[#FF2D55]" />
              </div>
            </div>
          )}

          {/* Price badge / Lock overlay if not owned */}
          {!isOwned && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold shadow-md flex items-center gap-1.5">
              <Lock size={10} strokeWidth={2.5} className="text-[#FF2D55]" />
              ₮{movie.effectivePrice.toLocaleString()}
            </div>
          )}

          {/* Owned badge */}
          {isOwned && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-emerald-500/90 backdrop-blur-md border border-emerald-400/20 text-white text-[11px] font-bold shadow-md flex items-center gap-1">
              <CheckCircle size={10} strokeWidth={2.5} className="text-white" />
              Нээлттэй
            </div>
          )}
        </div>

        {/* Card Metadata & Content */}
        <div className="p-5 text-left flex flex-col flex-1 gap-2.5">
          {/* Genre Tags */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {movie.genres.slice(0, 2).map(g => (
                <span key={g} className="px-2.5 py-0.5 rounded-md bg-[#FF2D55]/8 border border-[#FF2D55]/15 text-[9px] font-extrabold text-[#FF5C8A] uppercase tracking-wider">{g}</span>
              ))}
            </div>
          )}

          {/* Title */}
          <h4 className="text-[17px] font-bold text-white truncate leading-tight group-hover:text-[#FF2D55] transition-colors duration-200 m-0">
            {movie.title}
          </h4>

          {/* Short Description */}
          {movie.description && (
            <p className="text-[13px] text-[#F6F0F3]/50 line-clamp-2 m-0 leading-relaxed min-h-[38px]">
              {movie.description}
            </p>
          )}

          {/* Footer Card Info */}
          <div className="flex items-center justify-between mt-auto pt-3.5 border-t border-white/5 text-[11.5px] text-[#F6F0F3]/45 font-medium">
            <span>
              {movie.duration ? `${movie.duration} мин` : ""}
              {movie.duration && movie.releaseYear ? " • " : ""}
              {movie.releaseYear || ""}
            </span>
            <span className={`flex items-center gap-1 font-bold transition-colors duration-200 ${isOwned ? "text-[#3cc878]" : "text-[#FF2D55]"}`}>
              {isOwned ? "Үзэх" : "Нээх"}
              <ChevronRight size={14} strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
