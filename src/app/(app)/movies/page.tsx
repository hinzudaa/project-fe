"use client";
import { useEffect, useRef, useState } from "react";
import { Loader2, Play, Lock, CheckCircle, X, Film } from "lucide-react";
import { movieApi, Movie, MovieBundle, QPayInvoice } from "@/lib/api";

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
  const [movies, setMovies] = useState<Movie[]>([]);
  const [bundle, setBundle] = useState<MovieBundle | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Movie | null>(null);

  useEffect(() => {
    Promise.all([
      movieApi.list(1, 100),
      movieApi.getBundle().catch(() => null),
    ]).then(([res, bundleRes]) => {
      setMovies(res.data);
      const allGenres = Array.from(new Set(res.data.flatMap(m => m.genres))).filter(Boolean);
      setGenres(allGenres);
      if (bundleRes?.data) setBundle(bundleRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handlePurchased = (updatedMovie: Movie) => {
    setMovies(prev => prev.map(m => m._id === updatedMovie._id ? updatedMovie : m));
    setSelected(updatedMovie);
  };

  const filtered = genre ? movies.filter(m => m.genres.includes(genre)) : movies;

  return (
    <div className="max-w-[960px] mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-serif text-[26px] font-bold mb-1">Кино</h1>
          <p className="text-text-secondary text-sm">Насанд хүрэгчдийн кино цуглуулга</p>
        </div>
      </div>

      {/* Bundle banner */}
      {bundle?.isActive && (
        <BundleBanner bundle={bundle} onPurchased={b => setBundle(b)} />
      )}

      {/* Genre filter */}
      {genres.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setGenre("")}
            className={`px-4 py-[7px] rounded-full text-[13px] cursor-pointer transition-all duration-[180ms] ${!genre ? "bg-[rgba(232,65,90,0.15)] border border-[rgba(232,65,90,0.5)] text-[#e8415a] font-semibold" : "bg-transparent border border-[rgba(255,255,255,0.1)] text-text-secondary"}`}
          >
            Бүгд
          </button>
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-4 py-[7px] rounded-full text-[13px] cursor-pointer transition-all duration-[180ms] ${genre === g ? "bg-[rgba(232,65,90,0.15)] border border-[rgba(232,65,90,0.5)] text-[#e8415a] font-semibold" : "bg-transparent border border-[rgba(255,255,255,0.1)] text-text-secondary"}`}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={36} className="animate-spin text-[#c8254a]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-24 gap-3 text-text-muted">
          <Film size={40} strokeWidth={1.5} />
          <p className="text-[14px]">Кино байхгүй байна</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
          {filtered.map(m => (
            <MovieCard key={m._id} movie={m} onClick={setSelected} />
          ))}
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
    </div>
  );
}

function MovieCard({ movie, onClick }: { movie: Movie; onClick: (m: Movie) => void }) {
  const img = resolveImg(movie.image?.url);
  return (
    <div
      onClick={() => onClick(movie)}
      className="bg-bg-card border border-white/[0.06] rounded-[18px] overflow-hidden cursor-pointer transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
    >
      <div className="relative aspect-[2/3] bg-bg-elevated">
        {img
          ? <img src={img} alt={movie.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-4xl">🎬</div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {movie.owned && (
          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#3cc878] flex items-center justify-center">
            <CheckCircle size={14} strokeWidth={2.5} className="text-white" />
          </div>
        )}
        {!movie.owned && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white border border-white/10 backdrop-blur-sm">
            {fmtPrice(movie.effectivePrice)}
          </div>
        )}
        <div className="absolute bottom-2 left-2 right-2">
          {movie.genres.length > 0 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/50 text-white/80 backdrop-blur-sm border border-white/10">
              {movie.genres[0]}
            </span>
          )}
        </div>
      </div>
      <div className="px-3 py-2.5">
        <p className="font-semibold text-[13px] text-text-primary truncate">{movie.title}</p>
        {movie.releaseYear && <p className="text-[11px] text-text-muted">{movie.releaseYear}</p>}
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
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-[#3cc878]/30 bg-[rgba(60,200,120,0.07)] mb-5">
        <CheckCircle size={18} className="text-[#3cc878] shrink-0" />
        <p className="text-[14px] font-semibold text-[#3cc878]">Та бүх кино багцыг авсан байна</p>
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
    <div className="flex items-center justify-between px-5 py-4 rounded-2xl border border-[rgba(232,184,80,0.3)] bg-[rgba(232,184,80,0.07)] mb-5 gap-4">
      <div>
        <p className="font-semibold text-[14px] text-[#e8b850]">{bundle.title}</p>
        <p className="text-[12px] text-text-muted">
          {bundle.totalMovies ? `${bundle.totalMovies} кино` : "Бүх кино"}
          {bundle.discountedPrice != null && bundle.discountedPrice < bundle.price
            ? ` · ₮${bundle.price.toLocaleString()} → `
            : " · "}
          {fmtPrice(bundle.effectivePrice)}
        </p>
      </div>
      <button
        onClick={handleBuy}
        disabled={loading}
        className="px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-[linear-gradient(135deg,#e8b850,#c08828)] shadow-[0_4px_16px_rgba(232,184,80,0.3)] hover:-translate-y-px transition-all duration-200 disabled:opacity-60 shrink-0 flex items-center gap-2 cursor-pointer border-none"
      >
        {loading && <Loader2 size={13} className="animate-spin" />}
        Бүгдийг авах
      </button>
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
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-[480px] rounded-t-[28px] md:rounded-[28px] overflow-hidden border border-white/[0.08] bg-bg-card"
        onClick={e => e.stopPropagation()}
      >
        {/* Poster */}
        <div className="relative h-56 bg-bg-elevated overflow-hidden">
          {img
            ? <img src={img} alt={movie.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-6xl">🎬</div>
          }
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-black/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white border border-white/10 cursor-pointer"
          >
            <X size={15} />
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex gap-1.5 flex-wrap">
              {movie.genres.map(g => (
                <span key={g} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/50 text-white/80 border border-white/10 backdrop-blur-sm">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h2 className="font-serif font-bold text-[20px] text-text-primary leading-tight">{movie.title}</h2>
            <div className="text-right shrink-0 ml-3">
              {isOwned ? (
                <span className="text-[12px] font-bold text-[#3cc878] flex items-center gap-1">
                  <CheckCircle size={13} /> Худалдан авсан
                </span>
              ) : (
                <div>
                  {movie.discountedPrice != null && movie.discountedPrice < movie.price && (
                    <p className="text-[11px] text-text-muted line-through">{fmtPrice(movie.price)}</p>
                  )}
                  <p className="text-[16px] font-black text-[#e8415a]">{fmtPrice(movie.effectivePrice)}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 text-[12px] text-text-muted mb-3">
            {movie.releaseYear && <span>{movie.releaseYear}</span>}
            {movie.duration > 0 && <span>· {fmtDuration(movie.duration)}</span>}
          </div>

          {movie.description && (
            <p className="text-[13px] text-text-secondary leading-relaxed mb-4 line-clamp-3">
              {movie.description}
            </p>
          )}

          {isOwned ? (
            <button
              onClick={handleStream}
              disabled={streaming}
              className="w-full py-3 rounded-xl font-semibold text-[14px] text-white bg-[linear-gradient(135deg,#3cc878,#2a9a58)] shadow-[0_4px_16px_rgba(60,200,120,0.3)] flex items-center justify-center gap-2 hover:-translate-y-px transition-all duration-200 disabled:opacity-60 cursor-pointer border-none"
            >
              {streaming ? <Loader2 size={17} className="animate-spin" /> : <Play size={17} fill="white" />}
              Үзэх
            </button>
          ) : (
            <button
              onClick={handleBuy}
              disabled={buying}
              className="w-full py-3 rounded-xl font-semibold text-[14px] text-white bg-[linear-gradient(135deg,#c8254a,#780f20)] shadow-[0_4px_16px_rgba(158,24,56,0.35)] flex items-center justify-center gap-2 hover:-translate-y-px transition-all duration-200 disabled:opacity-60 cursor-pointer border-none"
            >
              {buying ? <Loader2 size={17} className="animate-spin" /> : <Lock size={17} />}
              {fmtPrice(movie.effectivePrice)} — Худалдан авах
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-[420px] rounded-[28px] overflow-hidden border border-white/[0.08] bg-bg-card">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="font-serif font-black text-[18px]">QPay төлбөр</h2>
            <p className="text-[12px] text-text-muted mt-0.5">{title} · ₮{price.toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary transition-colors cursor-pointer border-none bg-transparent">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white rounded-2xl">
              <img src={`data:image/png;base64,${invoice.qr_image}`} alt="QR" className="w-[200px] h-[200px] block" />
            </div>
          </div>
          <p className="text-center text-[12px] text-text-muted mb-4">QPay апп-аар QR код уншуулна уу</p>
          {invoice.urls && invoice.urls.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {invoice.urls.slice(0, 6).map((u, i) => (
                <a key={i} href={u.link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-[12px] no-underline transition-all hover:bg-white/[0.07]"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  {u.logo && <img src={u.logo} alt={u.name} className="w-5 h-5 rounded object-contain shrink-0" />}
                  <span className="text-[12px] text-text-secondary truncate">{u.name}</span>
                </a>
              ))}
            </div>
          )}
          <div className="flex items-center justify-center gap-2 text-[12px] text-text-muted">
            <Loader2 size={12} className="animate-spin" />
            <span>Төлбөрийг хүлээж байна...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoPlayer({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black" onClick={onClose}>
      <div className="flex items-center justify-between px-4 py-3 shrink-0" onClick={e => e.stopPropagation()}>
        <p className="font-semibold text-[15px] text-white truncate">{title}</p>
        <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <video
          src={url}
          controls
          autoPlay
          className="w-full max-h-full"
          style={{ maxHeight: "calc(100vh - 60px)" }}
        />
      </div>
    </div>
  );
}
