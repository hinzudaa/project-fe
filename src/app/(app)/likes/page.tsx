"use client";
import { useState, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import Link from "next/link";
import { Loader2, Heart, MessageCircle, ChevronRight, X, MapPin, Lock, LayoutGrid, Layers } from "lucide-react";
import { swipeApi, SwipeUser, MatchResult } from "@/apis";
import { useAuth } from "@/store/AuthProvider";

const BASE_URL = "https://projectm.zuraach.site";

function resolveAvatar(url?: string | null, photos?: string[]) {
  const targetUrl = url || (photos && photos.length > 0 ? photos[0] : null);
  if (!targetUrl) return null;
  if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) return targetUrl;
  return `${BASE_URL}${targetUrl}`;
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Саяхан";
  if (diff < 3600) return `${Math.floor(diff / 60)} мин өмнө`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} цаг өмнө`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} өдрийн өмнө`;
  return `${Math.floor(diff / (86400 * 7))} долоо хоногийн өмнө`;
}

interface LikeEntry {
  _id: string;
  likedAt: string;
  user: SwipeUser;
}

const PAGE_SIZE = 20;

const getKey = (pageIndex: number, previousPageData: any) => {
  if (previousPageData && !previousPageData.data.length) return null;
  return `likes?page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
};

const fetcher = async (url: string) => {
  const params = new URLSearchParams(url.split('?')[1]);
  return swipeApi.getLikesFull(Number(params.get('page')), Number(params.get('limit')));
};

export default function LikesPage() {
  const { user } = useAuth();
  const { data, size, setSize, isLoading, isValidating, mutate } = useSWRInfinite(getKey, fetcher);

  const [viewMode, setViewMode] = useState<"grid" | "swipe">("grid");
  const [likesList, setLikesList] = useState<LikeEntry[]>([]);
  const [swipedActions, setSwipedActions] = useState<Record<string, "left" | "right">>(Object.create(null));
  const [swiping, setSwiping] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const likes = data ? data.flatMap(res => res.data) : [];
  const total = data?.[0]?.total ?? 0;
  const hasMore = likes.length < total;
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  useEffect(() => {
    if (data) {
      const currentLikes = data.flatMap(res => res.data);
      setLikesList(currentLikes.filter(entry => !swipedActions[entry._id]));
    }
  }, [data]);

  useEffect(() => {
    setPhotoIndex(0);
  }, [likesList[0]?.user?._id]);

  const loadMore = () => setSize(size + 1);

  const handleSwipe = async (entry: LikeEntry, action: "like" | "pass") => {
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
      console.error("Swipe operation failed:", err);
    }

    setLikesList(prev => prev.filter(item => item._id !== entry._id));
    setSwiping(false);
    mutate();
  };

  return (
    <div className="relative min-h-screen text-[#F6F0F3] -m-5 md:-m-7 p-5 md:p-7 overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#0B090B] bg-[radial-gradient(1100px_680px_at_72%_-8%,rgba(255,45,85,0.16),transparent_60%),_radial-gradient(820px_560px_at_4%_2%,rgba(255,92,138,0.07),transparent_55%)]" />

      <div className="relative z-10 max-w-[860px] mx-auto pb-10">
        
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7 text-left">
          <div>
            <h1 className="text-[26px] font-black font-serif mb-1 flex items-center gap-2.5 text-white">
              <Heart size={22} className="text-[#FF2D55]" strokeWidth={2.5} />
              Танд таалагдсан
            </h1>
            <p className="text-[#F6F0F3]/60 text-[14px] m-0">
              {isLoading ? "Ачаалж байна..." : likesList.length > 0 ? `${likesList.length} хүн таны профайлыг like хийсэн байна` : "Одоохондоо хэнч like хийгээгүй байна"}
            </p>
          </div>

          {likesList.length > 0 && (
            <div className="flex items-center self-start sm:self-center p-1 rounded-xl bg-white/5 border border-white/8 shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] text-white shadow-md font-extrabold"
                    : "bg-transparent text-[#F6F0F3]/60 hover:text-white"
                }`}
              >
                <LayoutGrid size={14} />
                Сүлжээ
              </button>
              <button
                onClick={() => setViewMode("swipe")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                  viewMode === "swipe"
                    ? "bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] text-white shadow-md font-extrabold"
                    : "bg-transparent text-[#F6F0F3]/60 hover:text-white"
                }`}
              >
                <Layers size={14} />
                Свайп
              </button>
            </div>
          )}
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
                    Үргэлжлүүлэх
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

        {isLoading && likesList.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 size={36} className="animate-spin text-[#FF2D55]" />
          </div>
        ) : likesList.length === 0 ? (
          <div className="flex flex-col items-center py-24 gap-4 text-[#F6F0F3]/40 text-center">
            <div className="w-16 h-16 rounded-full bg-[#FF2D55]/8 flex items-center justify-center border border-[#FF2D55]/15">
              <Heart size={28} strokeWidth={1.5} className="text-[#FF2D55] opacity-50" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-white mb-1">Like байхгүй байна</p>
              <p className="text-[13px] text-[#F6F0F3]/40">Swipe хэсэгт идэвхтэй байгаарай</p>
            </div>
            <Link href="/swipe">
              <button className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] shadow-[0_4px_16px_rgba(255,45,85,0.35)] hover:-translate-y-px transition-all duration-200">
                Swipe хийх →
              </button>
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID MODE */
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {likesList.map(entry => {
                const age = entry.user.birthYear ? new Date().getFullYear() - entry.user.birthYear : null;
                const avatarUrl = resolveAvatar(entry.user.avatar, entry.user.photos);
                const isSwipedRight = swipedActions[entry._id] === "right";
                const isSwipedLeft = swipedActions[entry._id] === "left";
                
                return (
                  <div
                    key={entry._id}
                    className={`rounded-[18px] overflow-hidden border border-white/8 bg-white/3 transition-all duration-200 hover:-translate-y-1 hover:border-[#FF2D55]/40 hover:shadow-[0_16px_40px_rgba(255,45,85,0.16)] group ${
                      isSwipedLeft ? "animate-swipe-left" : isSwipedRight ? "animate-swipe-right" : ""
                    }`}
                  >
                    <div className="relative h-[188px] bg-[#181420] flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={entry.user.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FF2D55]/10 to-[#9b59ff]/10 text-white/20 font-bold text-2xl">
                          {(entry.user.name ?? "?").charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                      
                      {entry.user.isOnline && (
                        <span className="absolute top-2.5 right-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-white bg-black/42 px-[9px] py-1 rounded-full z-30">
                          <span className="w-[7px] h-[7px] rounded-full bg-[#4ade80] animate-his-pulse"></span>
                          Идэвхтэй
                        </span>
                      )}

                      <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-white bg-black/55 px-2.5 py-1 rounded-full border border-white/5 z-30">
                        {timeAgo(entry.likedAt)}
                      </span>

                      <div className="absolute left-3.5 right-3.5 bottom-3 text-left">
                        <div className="text-[17px] font-bold text-white truncate">
                          {entry.user.name ?? entry.user.username ?? "Хэрэглэгч"}{age ? `, ${age}` : ""}
                        </div>
                        <div className="flex items-center gap-1 mt-[3px] text-[12px] text-white/65">
                          <MapPin size={12} />
                          Улаанбаатар
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 p-3">
                      <button
                        onClick={() => handleSwipe(entry, "pass")}
                        className="flex-1 p-2.25 rounded-[11px] border border-white/12 bg-white/4 text-[#F6F0F3]/70 flex items-center justify-center cursor-pointer transition-colors hover:bg-white/12 hover:text-white"
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => handleSwipe(entry, "like")}
                        className="flex-1 p-2.25 rounded-[11px] border-none bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] text-white flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.03] active:scale-95"
                      >
                        <Heart size={16} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-7">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold text-[#F6F0F3]/60 border border-white/10 hover:border-white/20 hover:text-white transition-all duration-200 disabled:opacity-50 cursor-pointer bg-transparent"
                >
                  {isLoadingMore ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
                  {isLoadingMore ? "Ачаалж байна..." : "Цааш үзэх"}
                </button>
              </div>
            )}
          </>
        ) : (
          /* SWIPE STACK MODE */
          <LikesSwipeStack
            entry={likesList[0]}
            nextEntry={likesList[1]}
            photoIndex={photoIndex}
            setPhotoIndex={setPhotoIndex}
            onSwipe={(action) => handleSwipe(likesList[0], action)}
            swiping={swiping}
          />
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

interface SwipeStackProps {
  entry: LikeEntry;
  nextEntry?: LikeEntry;
  photoIndex: number;
  setPhotoIndex: React.Dispatch<React.SetStateAction<number>>;
  onSwipe: (action: "like" | "pass") => void;
  swiping: boolean;
}

function LikesSwipeStack({
  entry,
  nextEntry,
  photoIndex,
  setPhotoIndex,
  onSwipe,
  swiping,
}: SwipeStackProps) {
  const { user } = entry;
  const avatarUrl = resolveAvatar(user.avatar, user.photos);
  const age = user.birthYear ? new Date().getFullYear() - user.birthYear : null;
  
  const photos = user.photos && user.photos.length > 0 ? user.photos : [];

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photos.length <= 1) return;
    setPhotoIndex(prev => (prev - 1 + photos.length) % photos.length);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photos.length <= 1) return;
    setPhotoIndex(prev => (prev + 1) % photos.length);
  };

  return (
    <div className="max-w-[420px] mx-auto flex flex-col items-center mt-4 text-left">
      <div className="relative w-full aspect-[3/4.2] mb-6">
        
        {nextEntry && (
          <div
            className="absolute inset-0 rounded-[28px] overflow-hidden"
            style={{
              transform: "scale(0.94) translateY(18px)",
              transformOrigin: "bottom center",
              background: "linear-gradient(160deg, #180a18 0%, #060408 100%)",
              zIndex: 1,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[72px] h-[72px] rounded-full overflow-hidden flex items-center justify-center text-2xl font-black text-white/50 bg-gradient-to-br from-[#6b1528] to-[#2a0814] shadow-inner">
                {nextEntry.user.avatar ? (
                  <img src={resolveAvatar(nextEntry.user.avatar, nextEntry.user.photos)!} className="w-full h-full object-cover" alt="" />
                ) : (
                  (nextEntry.user.name ?? nextEntry.user.username ?? "?")[0].toUpperCase()
                )}
              </div>
            </div>
          </div>
        )}

        <div
          className="absolute inset-0 rounded-[28px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.65)] bg-[#0B090B] z-10 border border-white/6"
        >
          <div className="absolute inset-0">
            {photos.length > 0 ? (
              <img
                src={resolveAvatar(photos[photoIndex])!}
                alt={user.name}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            ) : avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[76px] font-black text-white/10 select-none">
                {(user.name ?? user.username ?? "?")[0].toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" />
          </div>

          {photos.length > 1 && (
            <div className="absolute inset-0 flex z-20">
              <div className="flex-1 cursor-pointer" onClick={handlePrevPhoto} title="Өмнөх" />
              <div className="flex-1 cursor-pointer" onClick={handleNextPhoto} title="Дараах" />
            </div>
          )}

          {photos.length > 1 && (
            <div className="absolute top-3 left-4 right-4 flex gap-1.5 z-30">
              {photos.map((_, i) => (
                <div key={i} className="h-1 flex-1 rounded-full overflow-hidden bg-white/20 backdrop-blur-md">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: i === photoIndex ? "100%" : i < photoIndex ? "100%" : "0%" }}
                  />
                </div>
              ))}
            </div>
          )}

          {user.isOnline && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-[#3cc878]/30 backdrop-blur-md z-30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3cc878]" />
              <span className="text-[11px] font-medium text-[#3cc878]">Онлайн</span>
            </div>
          )}

          <span className="absolute top-4 right-4 text-[10px] font-bold text-white bg-black/60 px-2.5 py-1 rounded-full border border-white/5 backdrop-blur-md z-30">
            {timeAgo(entry.likedAt)}
          </span>

          <div className="absolute bottom-0 left-0 right-0 px-6 py-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
            <div className="flex items-baseline gap-2 mb-1">
              <h2 className="font-serif text-[26px] font-black text-white leading-none">
                {user.name ?? user.username ?? "Хэрэглэгч"}
              </h2>
              {age && <span className="text-[18px] text-white/60 font-light">{age}</span>}
              {user.gender && <span className="text-[12px] text-white/40 uppercase tracking-wider">{user.gender === "male" ? "Эрэгтэй" : "Эмэгтэй"}</span>}
            </div>
            <div className="flex items-center gap-1 text-white/50 text-[12px]">
              <MapPin size={11} strokeWidth={2} />
              <span>Улаанбаатар</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 pb-4">
        <button
          onClick={() => onSwipe("pass")}
          disabled={swiping}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/8 text-[#FF2D55] transition-all duration-200 hover:scale-115 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg"
        >
          <X size={22} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => onSwipe("like")}
          disabled={swiping}
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] text-white transition-all duration-200 hover:scale-115 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[0_6px_30px_rgba(255,45,85,0.55)]"
        >
          {swiping ? (
            <Loader2 size={26} className="animate-spin text-white" />
          ) : (
            <Heart size={30} fill="white" strokeWidth={0} />
          )}
        </button>
      </div>
    </div>
  );
}
