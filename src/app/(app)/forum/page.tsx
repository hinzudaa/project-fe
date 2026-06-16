"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Loader2, Send, Trash2, Heart, MessageSquare, Plus, Sparkles } from "lucide-react";
import { networkApi, NetworkPost, NetworkComment } from "@/apis";
import { useAuth } from "@/store/AuthProvider";

const BASE_URL = "https://projectm.zuraach.site";

const CATEGORIES = [
  { id: "new", label: "✨ Шинэ", color: "#3cc878" },
  { id: "hot", label: "🔥 Халуун", color: "#e8415a" },
  { id: "breakup", label: "💔 Харилцаа", color: "#ff6b35" },
  { id: "friends", label: "👥 Найзлалт", color: "#9b59ff" },
];

const CAT_LABELS: Record<string, string> = { breakup: "💔 Харилцаа", friends: "👥 Найзлалт" };

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Саяхан";
  if (diff < 3600) return `${Math.floor(diff / 60)} мин өмнө`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} цаг өмнө`;
  return `${Math.floor(diff / 86400)} өдрийн өмнө`;
}

function resolveAvatar(avatar?: string) {
  if (!avatar) return null;
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
  return `${BASE_URL}${avatar}`;
}

function AuthorAvatar({ author, size = 32 }: { author: { name?: string; username?: string; avatar?: string }; size?: number }) {
  const letter = (author.name ?? author.username ?? "?")[0].toUpperCase();
  const src = resolveAvatar(author.avatar);
  return (
    <div className="rounded-full overflow-hidden flex items-center justify-center font-bold text-white shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38, background: "linear-gradient(135deg,#c8254a,#780f20)" }}>
      {src ? <img src={src} loading="lazy" decoding="async" className="w-full h-full object-cover" alt="" /> : letter}
    </div>
  );
}

function CommentSection({ post, currentUserId }: { post: NetworkPost; currentUserId?: string }) {
  const [comments, setComments] = useState<NetworkComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    networkApi.listComments(post._id).then(res => {
      setComments(res.data.slice().reverse());
    }).catch(() => { }).finally(() => setLoading(false));
  }, [post._id]);

  async function submit() {
    if (!message.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await networkApi.createComment(post._id, message.trim());
      setComments(prev => [...prev, res.data]);
      setMessage("");
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  }

  async function removeComment(id: string) {
    await networkApi.deleteComment(id).catch(() => { });
    setComments(prev => prev.filter(c => c._id !== id));
  }

  return (
    <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-3">
      {loading ? (
        <div className="flex justify-center py-4"><Loader2 size={18} className="animate-spin text-[#FF2D55]" /></div>
      ) : (
        <div className="flex flex-col gap-2.5 mb-2 max-h-[260px] overflow-y-auto pr-1">
          {comments.length === 0 && (
            <p className="text-[12px] text-[#F6F0F3]/40 text-center py-3">Одоогоор сэтгэгдэл байхгүй байна</p>
          )}
          {comments.map(c => (
            <div key={c._id} className="flex gap-3 items-start group bg-white/[0.02] border border-white/[0.04] p-3 rounded-2xl">
              <AuthorAvatar author={c.user} size={28} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="text-[12.5px] font-bold text-white">
                    {c.isAiGenerated ? (
                      <span className="px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-[9px] font-extrabold text-violet-400 uppercase tracking-wide">
                        🤖 AI хариулт
                      </span>
                    ) : (
                      c.user.name ?? c.user.username
                    )}
                  </span>
                  <span className="text-[10px] text-[#F6F0F3]/40 font-medium">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-[13px] text-[#F6F0F3]/75 leading-relaxed m-0">{c.message}</p>
              </div>
              {c.user._id === currentUserId && (
                <button
                  onClick={() => removeComment(c._id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-[#FF2D55] p-1 cursor-pointer border-none bg-transparent"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2.5 items-center mt-1">
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && submit()}
          placeholder="Сэтгэгдэл бичих..."
          className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] text-white placeholder-[#F6F0F3]/30 outline-none focus:border-[#FF2D55]/50 transition-all font-sans"
        />
        <button
          onClick={submit}
          disabled={submitting || !message.trim()}
          className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all hover:-translate-y-0.5 border-none cursor-pointer bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] shadow-md shrink-0 active:translate-y-0"
        >
          {submitting ? <Loader2 size={15} className="animate-spin text-white" /> : <Send size={15} className="text-white" />}
        </button>
      </div>
    </div>
  );
}

function PostCard({ post: initialPost, currentUserId, onDelete }: {
  post: NetworkPost;
  currentUserId?: string;
  onDelete: (id: string) => void;
}) {
  const [post, setPost] = useState(initialPost);
  const [showComments, setShowComments] = useState(false);
  const [liking, setLiking] = useState(false);

  async function toggleLike() {
    if (liking) return;
    setLiking(true);
    const wasLiked = post.likedByMe;
    setPost(p => ({ ...p, likedByMe: !wasLiked, likeCount: p.likeCount + (wasLiked ? -1 : 1) }));
    try {
      if (wasLiked) await networkApi.unlikePost(post._id);
      else await networkApi.likePost(post._id);
    } catch {
      setPost(p => ({ ...p, likedByMe: wasLiked, likeCount: p.likeCount + (wasLiked ? 1 : -1) }));
    }
    setLiking(false);
  }

  const author = post.createdBy;
  const isOwn = author._id === currentUserId;

  return (
    <div className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/8 hover:border-[#FF2D55]/30 rounded-[20px] p-5 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5)] flex flex-col gap-3.5">

      {/* Author row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${author._id}`}>
            <AuthorAvatar author={author} size={36} />
          </Link>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/profile/${author._id}`}
                className="text-[13.5px] font-bold text-white truncate hover:text-[#FF2D55] transition-colors no-underline">
                {author.name ?? author.username ?? "Хэрэглэгч"}
              </Link>
              {post.isPinned && (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-[#e8b850] border border-amber-500/20 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-0.5">
                  📌 Тогтоосон
                </span>
              )}
              {post.category && (
                <span className="px-2 py-0.5 rounded bg-[#FF2D55]/8 text-[#FF5C8A] border border-[#FF2D55]/15 text-[9px] font-extrabold uppercase tracking-wider">
                  {CAT_LABELS[post.category] ?? post.category}
                </span>
              )}
            </div>
            <span className="text-[10.5px] text-[#F6F0F3]/40 font-medium mt-0.5">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        {isOwn && (
          <button
            onClick={() => networkApi.deletePost(post._id).then(() => onDelete(post._id))}
            className="text-[#F6F0F3]/40 hover:text-[#FF2D55] transition-colors p-1.5 cursor-pointer bg-transparent border-none"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="text-left">
        <h3 className="text-[17px] font-bold text-white mb-2 leading-snug">{post.title}</h3>
        <p className="text-[13.5px] text-[#F6F0F3]/65 leading-relaxed m-0 line-clamp-3">{post.description}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-5 pt-3.5 mt-1 border-t border-white/5">
        <button
          onClick={toggleLike}
          disabled={liking}
          className={`flex items-center gap-1.5 text-[13px] font-bold bg-transparent border-none cursor-pointer transition-transform active:scale-90 duration-200 ${
            post.likedByMe ? "text-[#FF2D55]" : "text-[#F6F0F3]/50 hover:text-white"
          }`}
        >
          <Heart size={16} fill={post.likedByMe ? "#FF2D55" : "none"} strokeWidth={post.likedByMe ? 0 : 2} />
          <span>{post.likeCount}</span>
        </button>
        <button
          onClick={() => setShowComments(v => !v)}
          className={`flex items-center gap-1.5 text-[13px] font-bold bg-transparent border-none cursor-pointer transition-transform active:scale-90 duration-200 ${
            showComments ? "text-white" : "text-[#F6F0F3]/50 hover:text-white"
          }`}
        >
          <MessageSquare size={16} strokeWidth={2} />
          <span>{post.commentCount} коммент</span>
        </button>
      </div>

      {showComments && (
        <CommentSection post={post} currentUserId={currentUserId} />
      )}
    </div>
  );
}

export default function ForumPage() {
  const { user } = useAuth();
  const [cat, setCat] = useState("new");
  const [posts, setPosts] = useState<NetworkPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [newCat, setNewCat] = useState<"" | "breakup" | "friends">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setPosts([]);
    setPage(1);
    networkApi.listPosts(1, 50).then(res => {
      setPosts(res.data);
      setTotalPages(res.totalPages);
    }).catch(() => { }).finally(() => setLoading(false));
  }, []);

  async function loadMore() {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    try {
      const res = await networkApi.listPosts(page + 1, 50);
      setPosts(prev => [...prev, ...res.data]);
      setPage(p => p + 1);
      setTotalPages(res.totalPages);
    } catch { /* ignore */ } finally {
      setLoadingMore(false);
    }
  }

  async function submitPost() {
    if (!title.trim() || !body.trim() || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await networkApi.createPost({
        title: title.trim(),
        description: body.trim(),
        category: newCat || undefined,
      });
      setPosts(prev => [res.data, ...prev]);
      setTitle(""); setBody(""); setNewCat(""); setShowModal(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  }

  const displayed = (() => {
    if (cat === "hot") return [...posts].sort((a, b) => b.likeCount - a.likeCount);
    if (cat === "breakup") return posts.filter(p => p.category === "breakup");
    if (cat === "friends") return posts.filter(p => p.category === "friends");
    return posts;
  })();

  return (
    <div className="max-w-[860px] mx-auto w-full px-4 pb-20 sm:px-0">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8 text-left">
        <div>
          <h1 className="font-serif text-[26px] font-black text-white tracking-tight">Нийгэмлэгийн Forum</h1>
          <p className="text-[#F6F0F3]/60 text-[13.5px] mt-1 leading-relaxed">Санаа бодлоо чөлөөтэй хуваалцаж, нийгэмлэгтэй танилцаарай</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="shrink-0 text-white border-none rounded-[14px] font-bold text-[13px] cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 px-5 py-3 bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] shadow-[0_4px_20px_rgba(255,45,85,0.4)] flex items-center gap-1.5"
        >
          <Plus size={16} strokeWidth={2.5} />
          Нийтлэх
        </button>
      </div>

      {/* New post modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center backdrop-blur-md p-4 overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) { setShowModal(false); setError(""); } }}
        >
          <div className="bg-[#0e0714]/98 border border-white/10 rounded-[24px] p-6 sm:p-8 w-full max-w-[560px] my-auto shadow-[0_24px_80px_rgba(0,0,0,0.8),_0_0_40px_rgba(255,45,85,0.1)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-[22px] font-bold text-white">Шинэ нийтлэг хийх</h3>
              <button
                onClick={() => { setShowModal(false); setError(""); }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#F6F0F3]/50 hover:text-white hover:bg-white/10 transition-colors border-none bg-transparent cursor-pointer text-[18px]"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-4.5">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#F6F0F3]/40 pl-1">Гарчиг</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-xl text-[14px] outline-none w-full placeholder:text-[#F6F0F3]/25 focus:border-[#FF2D55] focus:ring-1 focus:ring-[#FF2D55] transition-all"
                  placeholder="Бичлэгийн гарчиг юу вэ?"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#F6F0F3]/40 pl-1">Агуулга</label>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  className="bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-xl text-[14px] outline-none w-full placeholder:text-[#F6F0F3]/25 resize-none focus:border-[#FF2D55] focus:ring-1 focus:ring-[#FF2D55] transition-all"
                  placeholder="Санаа бодлоо энд хуваалцаарай..."
                  rows={4}
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#F6F0F3]/40 pl-1">Ангилал сонгох</label>
                <div className="flex gap-2.5">
                  {[
                    { val: "" as const, label: "Ангилалгүй" },
                    { val: "breakup" as const, label: "💔 Харилцаа" },
                    { val: "friends" as const, label: "👥 Найзлалт" },
                  ].map(opt => {
                    const isSel = newCat === opt.val;
                    return (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setNewCat(opt.val)}
                        className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all border cursor-pointer ${
                          isSel
                            ? "bg-[#FF2D55]/15 border-[#FF2D55]/50 text-[#FF5C8A]"
                            : "bg-white/[0.03] border-white/10 text-[#F6F0F3]/50 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && <p className="text-[12px] text-[#FF2D55] font-semibold mt-1 text-left">{error}</p>}

              <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-white/5">
                <button
                  onClick={() => { setShowModal(false); setError(""); }}
                  className="bg-transparent text-white border border-white/15 rounded-xl font-bold text-[13px] cursor-pointer px-5 py-2.5 hover:bg-white/5 hover:border-white/20 transition-all"
                >
                  Болих
                </button>
                <button
                  onClick={submitPost}
                  disabled={submitting || !title.trim() || !body.trim()}
                  className="text-white border-none rounded-xl font-bold text-[13px] cursor-pointer px-5 py-2.5 disabled:opacity-50 flex items-center gap-2 bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] shadow-[0_4px_20px_rgba(255,45,85,0.4)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Нийтлэх
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 mb-6 scrollbar-hide">
        {CATEGORIES.map(c => {
          const isActive = cat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`px-4.5 py-[7px] rounded-full text-[13.5px] cursor-pointer transition-all duration-200 shrink-0 whitespace-nowrap border font-bold ${
                isActive
                  ? "text-white shadow-md"
                  : "text-[#F6F0F3]/60 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white"
              }`}
              style={{
                backgroundColor: isActive ? `${c.color}20` : undefined,
                borderColor: isActive ? c.color : undefined,
                boxShadow: isActive ? `0 0 16px ${c.color}22` : undefined,
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 size={38} className="animate-spin text-[#FF2D55]" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#F6F0F3]/30 border border-white/5 bg-white/[0.01] rounded-2xl">
          <Sparkles size={32} className="mb-2" />
          <p className="text-[14.5px] font-medium">Нийтлэл олдсонгүй</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {displayed.map(post => (
              <PostCard key={post._id} post={post} currentUserId={user?._id}
                onDelete={id => setPosts(prev => prev.filter(p => p._id !== id))} />
            ))}
          </div>

          {cat === "new" && page < totalPages && (
            <div className="flex justify-center mt-8">
              <button onClick={loadMore} disabled={loadingMore}
                className="px-6 py-3 rounded-xl text-[13.5px] font-bold text-[#F6F0F3]/70 border border-white/10 hover:border-[#FF2D55]/30 hover:text-white bg-transparent cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center gap-2">
                {loadingMore && <Loader2 size={14} className="animate-spin" />}
                Цааш үзэх
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
