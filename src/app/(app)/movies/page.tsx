"use client";
import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import { Loader2, Play, Lock, CheckCircle, X, Film, Info, ChevronRight, Zap } from "lucide-react";
import { movieApi, Movie, MovieBundle, QPayInvoice, MovieBulkPurchaseResponse } from "@/apis";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3080";

function resolveImg(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL}${url}`;
}

function fmtDuration(seconds: number) {
  if (!seconds) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}ц ${m}мин` : `${m}мин`;
}

function fmtPrice(price: number) {
  return `₮${price.toLocaleString()}`;
}

const POLL_MS = 3000;

export default function MoviesPage() {
  const [genre, setGenre] = useState("");
  const [selected, setSelected] = useState<Movie | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkInvoice, setBulkInvoice] = useState<MovieBulkPurchaseResponse | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  const { data, mutate, isLoading } = useSWR("movies-list", async () => {
    const [res, bundleRes] = await Promise.all([
      movieApi.list(1, 100),
      movieApi.getBundle().catch(() => null),
    ]);
    
    const allGenres = Array.from(new Set(res.data.flatMap(m => m.genres))).filter(Boolean);
    
    return {
      movies: res.data,
      genres: allGenres,
      bundle: bundleRes?.data ?? null
    };
  });

  const movies = data?.movies ?? [];
  const genres = data?.genres ?? [];
  const bundle = data?.bundle ?? null;

  const handlePurchased = (updatedMovie: Movie) => {
    mutate(prev => prev ? {
      ...prev,
      movies: prev.movies.map(m => m._id === updatedMovie._id ? updatedMovie : m)
    } : prev, false);
    setSelected(updatedMovie);
  };

  const handleBulkPurchased = (updatedMovies: Movie[]) => {
    mutate(prev => {
      if (!prev) return prev;
      const movieMap = new Map(updatedMovies.map(m => [m._id, m]));
      return {
        ...prev,
        movies: prev.movies.map(m => movieMap.has(m._id) ? { ...m, ...movieMap.get(m._id), owned: true } : m)
      };
    }, false);
    setSelectedIds([]);
  };

  const setBundle = (newBundle: MovieBundle) => {
    mutate(prev => prev ? { ...prev, bundle: newBundle } : prev, false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkBuy = async () => {
    if (selectedIds.length === 0) return;
    if (selectedIds.length === 1) {
      const movie = movies.find(m => m._id === selectedIds[0]);
      if (movie) setSelected(movie);
      return;
    }

    setBulkLoading(true);
    try {
      const res = await movieApi.bulkPurchase(selectedIds);
      setBulkInvoice(res);
    } catch (e: any) {
      alert(e?.message ?? "Алдаа гарлаа");
    } finally {
      setBulkLoading(false);
    }
  };

  const filtered = genre ? movies.filter(m => m.genres.includes(genre)) : movies;

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pb-24">
      {/* Background Orbs */}
      <div className="pointer-events-none fixed top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(circle, #e8415a 0%, transparent 70%)" }} />
      <div className="pointer-events-none fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #9e1838 0%, transparent 70%)" }} />

      <div className="relative z-10">
        <header className="mb-10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(232,65,90,0.1)] border border-[rgba(232,65,90,0.2)] flex items-center justify-center">
              <Film size={22} className="text-[#e8415a]" />
            </div>
            <div>
              <h1 className="font-serif text-[28px] font-black tracking-tight">Кино сая</h1>
              <p className="text-text-secondary text-[14px]">Танд зориулсан онцгой цуглуулга</p>
            </div>
          </div>
          
          {selectedIds.length > 0 && (
            <button 
              onClick={() => setSelectedIds([])}
              className="text-sm font-medium text-text-muted hover:text-white transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer"
            >
              <X size={14} /> Цуцлах ({selectedIds.length})
            </button>
          )}
        </header>

        {/* Bundle banner */}
        {bundle?.isActive && (
          <BundleBanner bundle={bundle} onPurchased={b => setBundle(b)} />
        )}

        {/* Genre filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4 scrollbar-hide">
          <button
            onClick={() => setGenre("")}
            className={`px-5 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-300 border ${!genre
              ? "bg-[#e8415a] border-[#e8415a] text-white shadow-[0_4px_12px_rgba(232,65,90,0.3)]"
              : "bg-white/[0.03] border-white/[0.08] text-text-secondary hover:border-white/[0.2] hover:bg-white/[0.05]"
              }`}
          >
            Бүх кино
          </button>
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-5 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-300 border ${genre === g
                ? "bg-[#e8415a] border-[#e8415a] text-white shadow-[0_4px_12px_rgba(232,65,90,0.3)]"
                : "bg-white/[0.03] border-white/[0.08] text-text-secondary hover:border-white/[0.2] hover:bg-white/[0.05]"
                }`}
            >
              {g}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-[#e8415a] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Film size={20} className="text-[#e8415a]" />
              </div>
            </div>
            <p className="text-text-muted text-sm font-medium">Ачаалж байна...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-32 gap-4 text-text-muted bg-white/[0.02] border border-white/[0.05] rounded-[32px]">
            <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center">
              <Film size={32} strokeWidth={1.5} />
            </div>
            <p className="text-[15px] font-medium">Одоогоор кино байхгүй байна</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map(m => (
              <MovieCard 
                key={m._id} 
                movie={m} 
                isSelected={selectedIds.includes(m._id)}
                onSelect={toggleSelect}
                onClick={setSelected} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Bulk Checkout Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-32px)] max-w-[500px]">
          <div className="bg-[#1a161f]/80 backdrop-blur-xl border border-white/10 rounded-[28px] p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 pl-2">
              <div className="w-10 h-10 rounded-2xl bg-[#e8415a] text-white flex items-center justify-center font-black">
                {selectedIds.length}
              </div>
              <div>
                <p className="text-[14px] font-bold text-white">Кино сонгосон</p>
                <p className="text-[11px] text-text-muted">Нийт {fmtPrice(movies.filter(m => selectedIds.includes(m._id)).reduce((acc, m) => acc + m.effectivePrice, 0))}</p>
              </div>
            </div>
            <button
              onClick={handleBulkBuy}
              disabled={bulkLoading}
              className="px-6 h-12 rounded-2xl bg-[#e8415a] text-white font-black text-sm shadow-[0_10px_20px_rgba(232,65,90,0.3)] hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer border-none flex items-center gap-2"
            >
              {bulkLoading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} fill="white" />}
              ХУДАЛДАН АВАХ
            </button>
          </div>
        </div>
      )}

      {selected && (
        <MovieDetailModal
          movie={selected}
          bundleOwned={bundle?.owned ?? false}
          onClose={() => setSelected(null)}
          onPurchased={handlePurchased}
        />
      )}

      {bulkInvoice && (
        <BulkInvoiceModal 
          res={bulkInvoice} 
          onClose={() => setBulkInvoice(null)}
          onSuccess={handleBulkPurchased}
        />
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes orb-drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        
        .animate-orb-drift { animation: orb-drift 8s infinite ease-in-out; }
      `}</style>
    </div>
  );
}

function MovieCard({ 
  movie, 
  isSelected,
  onSelect,
  onClick 
}: { 
  movie: Movie; 
  isSelected: boolean;
  onSelect: (id: string) => void;
  onClick: (m: Movie) => void 
}) {
  const img = resolveImg(movie.image?.url);
  const isOwned = movie.owned;

  return (
    <div
      onClick={() => isOwned ? onClick(movie) : onSelect(movie._id)}
      className={`group relative flex flex-col bg-bg-card border rounded-[24px] overflow-hidden cursor-pointer transition-all duration-[400ms] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${
        isSelected 
          ? "border-[#e8415a] shadow-[0_0_20px_rgba(232,65,90,0.2)]" 
          : "border-white/[0.06] hover:border-[rgba(232,65,90,0.3)]"
      }`}
    >
      <div className="relative aspect-[3/4] bg-bg-elevated overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={movie.title}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${!isOwned ? "blur-[12px] scale-110 opacity-70" : ""}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bg-elevated to-bg-card">
            <Film size={40} className="text-white/10" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

        {/* Selection Indicator */}
        {!isOwned && (
          <div className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-20 ${
            isSelected 
              ? "bg-[#e8415a] border-[#e8415a]" 
              : "bg-black/20 border-white/40 backdrop-blur-md"
          }`}>
            {isSelected && <CheckCircle size={14} className="text-white" strokeWidth={3} />}
          </div>
        )}

        {/* Lock Overlay for non-owned */}
        {!isOwned && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className={`w-12 h-12 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center mb-3 shadow-2xl transition-all duration-300 group-hover:scale-110 ${
              isSelected ? "bg-[#e8415a]/80" : "bg-black/40"
            }`}>
              <Lock size={20} className="text-white" />
            </div>
            <div className="px-3 py-1.5 rounded-full bg-[#e8415a] text-white text-[11px] font-black shadow-[0_4px_12px_rgba(232,65,90,0.4)]">
              {fmtPrice(movie.effectivePrice)}
            </div>
          </div>
        )}

        {/* Play button for owned */}
        {isOwned && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-full bg-[#e8415a] text-white flex items-center justify-center shadow-[0_0_30px_rgba(232,65,90,0.5)] transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <Play size={24} fill="currentColor" />
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOwned && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3cc878]/90 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 shadow-lg">
              <CheckCircle size={10} strokeWidth={3} /> АВСАН
            </div>
          )}
          {movie.genres[0] && (
            <div className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-bold border border-white/10">
              {movie.genres[0].toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1">
        <h3 className={`font-bold text-[14px] truncate transition-colors ${isSelected ? "text-[#e8415a]" : "text-text-primary group-hover:text-[#e8415a]"}`}>{movie.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-text-muted font-medium">{movie.releaseYear ?? "2024"} · {fmtDuration(movie.duration)}</span>
          <div className={`text-[12px] font-bold transition-colors ${isSelected ? "text-[#e8415a]" : "text-text-muted group-hover:text-[#e8415a]"}`}>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BundleBanner({ bundle, onPurchased }: { bundle: MovieBundle; onPurchased: (b: MovieBundle) => void }) {
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<QPayInvoice | null>(null);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [paid, setPaid] = useState(bundle.owned);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!purchaseId || paid) return;
    intervalRef.current = setInterval(async () => {
      try {
        const s = await movieApi.getPurchaseStatus(purchaseId);
        if (s.active) {
          setPaid(true);
          setInvoice(null);
          clearInterval(intervalRef.current!);
          onPurchased({ ...bundle, owned: true });
        }
      } catch { /* keep polling */ }
    }, POLL_MS);
    return () => clearInterval(intervalRef.current!);
  }, [purchaseId, paid]);

  if (paid || bundle.owned) {
    return (
      <div className="flex items-center gap-4 px-6 py-4 rounded-[24px] border border-[#3cc878]/20 bg-[#3cc878]/05 mb-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#3cc878] opacity-[0.05] rounded-full translate-x-10 -translate-y-10" />
        <div className="w-10 h-10 rounded-full bg-[#3cc878]/20 flex items-center justify-center shrink-0">
          <CheckCircle size={20} className="text-[#3cc878]" />
        </div>
        <div>
          <p className="text-[15px] font-bold text-[#3cc878]">Та бүх кино багцыг авсан байна</p>
          <p className="text-[12px] text-[#3cc878]/70">Бүх шинэ кинонууд танд шууд нээгдэх болно</p>
        </div>
      </div>
    );
  }

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await movieApi.purchaseBundle();
      setInvoice(res.invoice);
      setPurchaseId(res.purchaseId);
    } catch (e: any) {
      alert(e?.message ?? "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  if (invoice) {
    return <InvoiceModal invoice={invoice} title={bundle.title} price={bundle.effectivePrice} onClose={() => setInvoice(null)} />;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 rounded-[28px] border border-[#e8b850]/20 bg-[linear-gradient(135deg,rgba(232,184,80,0.08),rgba(192,136,40,0.03))] mb-10 gap-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#e8b850] opacity-[0.03] rounded-full translate-x-20 -translate-y-20 transition-transform duration-[2s] group-hover:scale-110" />
      <div className="relative z-10 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded bg-[#e8b850] text-black text-[10px] font-black uppercase tracking-wider">Bundle</span>
          <p className="font-serif font-black text-[20px] text-[#e8b850]">{bundle.title}</p>
        </div>
        <p className="text-[13px] text-text-secondary max-w-[400px]">
          {bundle.totalMovies ? `${bundle.totalMovies} киног` : "Бүх киног"} нэг дор хямдралтай үнээр аваад хязгааргүй үзээрэй.
        </p>
      </div>
      <div className="relative z-10 flex flex-col items-center sm:items-end gap-3">
        <div className="flex flex-col items-end">
          {bundle.discountedPrice != null && bundle.discountedPrice < bundle.price && (
            <span className="text-[12px] text-text-muted line-through">₮{bundle.price.toLocaleString()}</span>
          )}
          <span className="text-[24px] font-black text-white">{fmtPrice(bundle.effectivePrice)}</span>
        </div>
        <button
          onClick={handleBuy}
          disabled={loading}
          className="px-8 py-3.5 rounded-2xl text-[14px] font-black text-white bg-[linear-gradient(135deg,#e8b850,#c08828)] shadow-[0_10px_25px_rgba(232,184,80,0.3)] hover:shadow-[0_15px_35px_rgba(232,184,80,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 shrink-0 flex items-center gap-2 cursor-pointer border-none"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} fill="white" />}
          БАГЦ АВАХ
        </button>
      </div>
    </div>
  );
}

function MovieDetailModal({
  movie,
  bundleOwned,
  onClose,
  onPurchased,
}: {
  movie: Movie;
  bundleOwned: boolean;
  onClose: () => void;
  onPurchased: (m: Movie) => void;
}) {
  const [buying, setBuying] = useState(false);
  const [invoice, setInvoice] = useState<QPayInvoice | null>(null);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isOwned = movie.owned || bundleOwned;

  useEffect(() => {
    if (!purchaseId) return;
    intervalRef.current = setInterval(async () => {
      try {
        const s = await movieApi.getPurchaseStatus(purchaseId);
        if (s.active) {
          clearInterval(intervalRef.current!);
          setInvoice(null);
          onPurchased({ ...movie, owned: true, ownership: "single" });
        }
      } catch { /* keep polling */ }
    }, POLL_MS);
    return () => clearInterval(intervalRef.current!);
  }, [purchaseId]);

  const handleBuy = async () => {
    setBuying(true);
    try {
      const res = await movieApi.purchase(movie._id);
      setInvoice(res.invoice);
      setPurchaseId(res.purchaseId);
    } catch (e: any) {
      alert(e?.message ?? "Алдаа гарлаа");
    } finally {
      setBuying(false);
    }
  };

  const handleStream = async () => {
    setStreaming(true);
    try {
      const res = await movieApi.getStream(movie._id);
      setStreamUrl(res.data.streamUrl);
    } catch (e: any) {
      alert(e?.message ?? "Алдаа гарлаа");
    } finally {
      setStreaming(false);
    }
  };

  const img = resolveImg(movie.image?.url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div
        className="w-full max-w-[500px] rounded-[32px] overflow-hidden border border-white/[0.1] bg-bg-card shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 cursor-pointer hover:bg-black/60 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Poster Section */}
        <div className="relative aspect-[16/10] bg-bg-elevated overflow-hidden">
          {img ? (
            <img
              src={img}
              alt={movie.title}
              className={`w-full h-full object-cover ${!isOwned ? "blur-[20px] scale-110 opacity-60" : ""}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-bg-elevated">
              <Film size={60} className="text-white/5" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/20 to-transparent" />

          {/* Locked Status Overlay */}
          {!isOwned && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-4 shadow-2xl">
                <Lock size={28} className="text-white" />
              </div>
              <p className="text-white/60 text-[13px] font-medium tracking-wide">ҮЗЭХИЙН ТУЛД НЭЭХ</p>
            </div>
          )}

          {/* Owned Status Tag */}
          {isOwned && (
            <div className="absolute bottom-4 left-6 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#3cc878]/20 backdrop-blur-md border border-[#3cc878]/30">
              <CheckCircle size={14} className="text-[#3cc878]" />
              <span className="text-[12px] font-bold text-[#3cc878] uppercase">Нээлттэй</span>
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="flex flex-col gap-1 mb-6">
            <h2 className="font-serif font-black text-[26px] text-text-primary leading-tight tracking-tight">{movie.title}</h2>
            <div className="flex items-center gap-3 text-[13px] text-text-muted">
              <span className="flex items-center gap-1"><Film size={14} /> {movie.releaseYear ?? "2024"}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>{fmtDuration(movie.duration)}</span>
              {movie.genres.length > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[#e8415a] font-bold uppercase tracking-wider text-[11px]">{movie.genres[0]}</span>
                </>
              )}
            </div>
          </div>

          <div className="bg-white/[0.03] rounded-2xl p-5 mb-8 border border-white/[0.05]">
            <p className="text-[14px] text-text-secondary leading-relaxed">
              {movie.description || "Энэхүү киноны тайлбар одоогоор ороогүй байна."}
            </p>
          </div>

          {isOwned ? (
            <button
              onClick={handleStream}
              disabled={streaming}
              className="w-full py-4.5 rounded-2xl font-black text-[16px] text-white bg-[linear-gradient(135deg,#e8415a,#9e1838)] shadow-[0_12px_30px_rgba(232,65,90,0.35)] flex items-center justify-center gap-3 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(232,65,90,0.45)] transition-all duration-300 disabled:opacity-60 cursor-pointer border-none"
            >
              {streaming ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} fill="currentColor" />}
              ҮЗЭЖ ЭХЛЭХ
            </button>
          ) : (
            <button
              onClick={handleBuy}
              disabled={buying}
              className="w-full py-4.5 rounded-2xl font-black text-[16px] text-white bg-[linear-gradient(135deg,#e8415a,#9e1838)] shadow-[0_12px_30px_rgba(232,65,90,0.35)] flex items-center justify-center gap-3 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(232,65,90,0.45)] transition-all duration-300 disabled:opacity-60 cursor-pointer border-none"
            >
              {buying ? <Loader2 size={20} className="animate-spin" /> : <Lock size={20} />}
              {fmtPrice(movie.effectivePrice)} — НЭЭХ
            </button>
          )}
        </div>
      </div>

      {invoice && (
        <InvoiceModal
          invoice={invoice}
          title={movie.title}
          price={movie.effectivePrice}
          onClose={() => setInvoice(null)}
        />
      )}

      {streamUrl && (
        <VideoPlayer url={streamUrl} title={movie.title} onClose={() => setStreamUrl(null)} />
      )}
    </div>
  );
}

function InvoiceModal({ invoice, title, price, onClose }: { invoice: QPayInvoice; title: string; price: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" onClick={onClose}>
      <div className="w-full max-w-[420px] rounded-[32px] overflow-hidden border border-white/[0.1] bg-bg-card shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#e8415a]/10 border border-[#e8415a]/20 flex items-center justify-center mx-auto mb-4">
            <Zap size={28} className="text-[#e8415a]" fill="#e8415a" />
          </div>
          <h2 className="font-serif font-black text-[22px] mb-1">QPay Төлбөр</h2>
          <p className="text-[14px] text-text-muted">{title} · <span className="text-white font-bold">{fmtPrice(price)}</span></p>
        </div>

        <div className="px-8 pb-8">
          <div className="bg-white p-4 rounded-3xl shadow-xl mb-6 flex justify-center transform transition-transform hover:scale-[1.02]">
            <img src={`data:image/png;base64,${invoice.qr_image}`} alt="QR" className="w-[200px] h-[200px] block" />
          </div>

          <div className="space-y-3">
            <p className="text-center text-[12px] font-bold text-text-muted uppercase tracking-widest mb-4">Банкны апп-аар уншуулна уу</p>

            <div className="grid grid-cols-3 gap-2">
              {invoice.urls?.slice(0, 6).map((u, i) => (
                <a key={i} href={u.link} target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] transition-all hover:bg-white/[0.08] hover:border-white/[0.15] no-underline">
                  {u.logo && <img src={u.logo} alt={u.name} className="w-8 h-8 rounded-lg object-contain shadow-lg" />}
                  <span className="text-[10px] text-text-muted font-bold truncate w-full text-center">{u.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#e8415a] animate-ping" />
            <span className="text-[13px] font-medium text-text-secondary">Төлбөрийг хүлээж байна...</span>
          </div>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-white transition-colors cursor-pointer border-none bg-transparent">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

function VideoPlayer({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-black" onClick={onClose}>
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-6 bg-gradient-to-b from-black/80 to-transparent" onClick={e => e.stopPropagation()}>
        <p className="font-bold text-[17px] text-white tracking-tight">{title}</p>
        <button onClick={onClose} className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer border-none">
          <X size={22} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <video
          src={url}
          controls
          autoPlay
          controlsList="nodownload"
          className="w-full max-h-full shadow-2xl"
          style={{ maxHeight: "100vh" }}
        />
      </div>
    </div>
  );
}

function BulkInvoiceModal({ 
  res, 
  onClose,
  onSuccess
}: { 
  res: MovieBulkPurchaseResponse; 
  onClose: () => void;
  onSuccess: (movies: Movie[]) => void;
}) {
  const [paid, setPaid] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        const s = await movieApi.getPurchaseStatus(res.purchaseIds[0]);
        if (s.active) {
          setPaid(true);
          clearInterval(intervalRef.current!);
          onSuccess(res.movies);
        }
      } catch { /* keep polling */ }
    }, 3000);
    return () => clearInterval(intervalRef.current!);
  }, [res.purchaseIds]);

  if (paid) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
        <div className="w-full max-w-[420px] rounded-[32px] overflow-hidden border border-[#3cc878]/20 bg-bg-card p-8 text-center shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-[#3cc878]/10 border border-[#3cc878]/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-[#3cc878]" />
          </div>
          <h2 className="text-2xl font-black mb-2 text-white">Төлбөр амжилттай</h2>
          <p className="text-text-secondary mb-8">Таны сонгосон {res.movies.length} кино амжилттай нээгдлээ.</p>
          <button 
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-[#3cc878] text-white font-black hover:opacity-90 transition-opacity cursor-pointer border-none"
          >
            ҮРГЭЛЖЛҮҮЛЭХ
          </button>
        </div>
      </div>
    );
  }

  return (
    <InvoiceModal 
      invoice={res.invoice} 
      title={`${res.movies.length} кино багц`} 
      price={res.totalPrice} 
      onClose={onClose} 
    />
  );
}