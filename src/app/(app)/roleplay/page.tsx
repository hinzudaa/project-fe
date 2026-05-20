"use client";
import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Loader2, Trash2, ArrowLeft, Send, Zap } from "lucide-react";
import { aiHumanApi, AIHuman, AIHumanMessage, AIHumanQuota } from "@/apis";
import { useAuth } from "@/store/AuthProvider";

const BASE_URL = "https://projectm.zuraach.site";

function resolveAvatar(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BASE_URL}${url}`;
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Саяхан";
  if (diff < 3600) return `${Math.floor(diff / 60)} мин`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} цаг`;
  return `${Math.floor(diff / 86400)} өдөр`;
}

function QuotaBar({ quota }: { quota: AIHumanQuota }) {
  if (quota.unlimited) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-[#3cc878]">
        <Zap size={11} />
        <span>Хязгааргүй</span>
      </div>
    );
  }
  const pct = quota.limit > 0 ? Math.round(((quota.remaining ?? 0) / quota.limit) * 100) : 0;
  const color = pct > 40 ? "#3cc878" : pct > 15 ? "#e8b850" : "#e8415a";
  return (
    <div className="flex items-center gap-2 text-[11px] text-text-muted">
      <div className="w-20 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span style={{ color }}>{quota.remaining}/{quota.limit}</span>
    </div>
  );
}

export default function RoleplayPage() {
  const { user } = useAuth();
  const [active, setActive] = useState<AIHuman | null>(null);

  const { data, mutate, isLoading } = useSWR("ai-human-list", () => aiHumanApi.list(1, 50));
  const personas = data?.data ?? [];
  const quota = data?.quota ?? null;

  const handleChatOpen = (persona: AIHuman) => setActive(persona);

  const handleChatClose = () => {
    mutate(); // Refresh list to get latest previews
    setActive(null);
  };

  if (active) {
    return <ChatView persona={active} userId={user?._id ?? ""} onClose={handleChatClose} />;
  }

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex items-end justify-between mb-7">
        <div>
          <h1 className="font-serif text-[26px] font-bold mb-1">AI Туслагч</h1>
          <p className="text-text-secondary text-sm">Хиймэл оюун ухааны дүртэй ярилцаарай</p>
        </div>
        {quota && <QuotaBar quota={quota} />}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={36} className="animate-spin text-[#c8254a]" />
        </div>
      ) : personas.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-text-muted gap-3">
          <p className="text-[14px]">Одоогоор AI туслагч байхгүй байна</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
          {personas.map(p => <PersonaCard key={p._id} persona={p} onOpen={handleChatOpen} />)}
        </div>
      )}
    </div>
  );
}

function PersonaCard({ persona, onOpen }: { persona: AIHuman; onOpen: (p: AIHuman) => void }) {
  const avatarUrl = resolveAvatar(persona.image?.url);
  const hasConvo = !!persona.conversation?.messageCount;

  return (
    <div
      onClick={() => onOpen(persona)}
      className="bg-bg-card border border-white/[0.06] rounded-[22px] overflow-hidden cursor-pointer transition-all duration-[250ms] hover:-translate-y-[5px] hover:shadow-[0_16px_50px_rgba(0,0,0,0.5)]"
    >
      <div className="relative h-52 bg-bg-elevated overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt={persona.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-[linear-gradient(135deg,rgba(200,37,74,0.2),rgba(155,89,255,0.2))]">
            🤖
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex flex-wrap gap-1">
            {persona.badge.slice(0, 3).map(b => (
              <span key={b} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white/80 backdrop-blur-sm border border-white/10">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1.5">
          <div>
            <h3 className="font-semibold text-[15px] text-text-primary">{persona.name}</h3>
            <p className="text-[12px] text-text-muted">
              {[persona.age ? `${persona.age} нас` : null, persona.gender === "female" ? "Эмэгтэй" : persona.gender === "male" ? "Эрэгтэй" : persona.gender].filter(Boolean).join(" · ")}
            </p>
          </div>
          {hasConvo && (
            <span className="text-[10px] text-[#3cc878] font-semibold px-2 py-0.5 rounded-full bg-[rgba(60,200,120,0.1)] border border-[rgba(60,200,120,0.2)]">
              Үргэлжлэх
            </span>
          )}
        </div>

        <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-2 mb-3">
          {persona.shortBio}
        </p>

        {hasConvo && persona.conversation?.lastMessagePreview && (
          <p className="text-[11px] text-text-muted italic truncate border-t border-white/[0.05] pt-2">
            "{persona.conversation.lastMessagePreview}"
          </p>
        )}

        <button className="mt-3 w-full py-2 rounded-xl text-[13px] font-semibold text-white bg-[linear-gradient(135deg,#c8254a,#780f20)] shadow-[0_4px_16px_rgba(158,24,56,0.35)] hover:-translate-y-px transition-all duration-200">
          {hasConvo ? "Үргэлжлүүлэх →" : "Ярилцах →"}
        </button>
      </div>
    </div>
  );
}

function ChatView({
  persona: initialPersona,
  userId,
  onClose,
}: {
  persona: AIHuman;
  userId: string;
  onClose: (p?: AIHuman, q?: AIHumanQuota | null) => void;
}) {
  const [persona, setPersona] = useState(initialPersona);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const sentIds = useRef<Set<string>>(new Set());

  const { data, mutate, isLoading } = useSWR(["ai-human-history", persona._id], () => aiHumanApi.getHistory(persona._id, 1, 100));
  const messages = data?.data ?? [];
  const quota = data?.quota ?? null;

  useEffect(() => {
    if (data?.persona) setPersona(data.persona);
  }, [data]);

  useEffect(() => {
    const socket = io(BASE_URL, { withCredentials: true, reconnectionAttempts: 5 });
    socketRef.current = socket;

    socket.on("ai-human:message", (msg: AIHumanMessage) => {
      if (String(msg.persona) !== String(persona._id)) return;
      if (sentIds.current.has(msg._id)) { sentIds.current.delete(msg._id); return; }
      mutate(prev => {
        if (!prev) return prev;
        if (prev.data.some(m => m._id === msg._id)) return prev;
        return { ...prev, data: [...prev.data, msg] };
      }, false);
    });

    socket.on("ai-human:typing", (data: { personaId: string; isTyping: boolean }) => {
      if (String(data.personaId) === String(persona._id)) setIsTyping(data.isTyping);
    });

    socket.on("ai-human:quota", (q: AIHumanQuota) => {
      mutate(prev => prev ? { ...prev, quota: q } : prev, false);
    });

    socket.on("ai-human:error", (data: { personaId: string; message: string }) => {
      if (String(data.personaId) === String(persona._id)) setError(data.message);
    });

    return () => { socket.disconnect(); socketRef.current = null; };
  }, [persona._id, mutate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setError(null);

    const optimistic: AIHumanMessage = {
      _id: `opt-${Date.now()}`,
      conversation: "",
      persona: persona._id,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    mutate(prev => prev ? { ...prev, data: [...prev.data, optimistic] } : prev, false);
    setSending(true);

    try {
      const res = await aiHumanApi.chat(persona._id, { message: text });
      sentIds.current.add(res.userMessage._id);
      sentIds.current.add(res.assistantMessage._id);

      mutate(prev => {
        if (!prev) return prev;
        const withoutOpt = prev.data.filter(m => m._id !== optimistic._id);
        const ids = new Set(withoutOpt.map(m => m._id));
        const toAdd = [res.userMessage, res.assistantMessage].filter(m => !ids.has(m._id));
        return {
          ...prev,
          data: [...withoutOpt, ...toAdd],
          quota: res.quota ?? prev.quota,
          persona: res.persona
        };
      }, false);
      setPersona(res.persona);
    } catch (e: any) {
      mutate(prev => prev ? { ...prev, data: prev.data.filter(m => m._id !== optimistic._id) } : prev, false);
      setError(e?.message ?? "Алдаа гарлаа");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    await aiHumanApi.deleteChat(persona._id).catch(() => { });
    setDeleting(false);
    setConfirmDelete(false);
    onClose();
  };

  const avatarUrl = resolveAvatar(persona.image?.url);

  return (
    <>
      <div className="max-w-[860px] mx-auto flex flex-col h-[calc(100vh-180px)]">
        {/* Header */}
        <div className="bg-bg-card border border-white/[0.06] rounded-[22px] p-3.5 mb-3 flex items-center gap-3">
          <button
            onClick={() => onClose(persona, quota)}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-transparent border border-white/[0.1] text-text-secondary hover:text-text-primary transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft size={17} />
          </button>

          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-bg-elevated">
            {avatarUrl
              ? <img src={avatarUrl} alt={persona.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-lg">🤖</div>
            }
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[14px] truncate">{persona.name}</p>
            <p className="text-[11px] text-text-muted">
              {isTyping ? <span className="text-[#3cc878]">Бичиж байна...</span> : "AI туслагч"}
            </p>
          </div>

          {quota && <QuotaBar quota={quota} />}

          <button
            onClick={() => setConfirmDelete(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-[#e8415a] hover:bg-[rgba(232,65,90,0.1)] transition-all cursor-pointer border border-white/[0.06] shrink-0"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-bg-card border border-white/[0.06] rounded-[22px] p-4 overflow-y-auto flex flex-col gap-3 mb-3">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 size={28} className="animate-spin text-[#c8254a]" />
            </div>
          ) : (
            <>
              {messages.length === 0 && persona.greeting && (
                <GreetingBubble avatar={avatarUrl} name={persona.name} text={persona.greeting} />
              )}
              {messages.map(m => (
                <MessageBubble key={m._id} msg={m} avatarUrl={avatarUrl} name={persona.name} />
              ))}
              {isTyping && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-bg-elevated shrink-0">
                    {avatarUrl ? <img src={avatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm">🤖</div>}
                  </div>
                  <div className="px-3.5 py-2.5 rounded-[18px] rounded-bl-[4px] bg-bg-elevated border border-white/[0.07] flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              {error && (
                <p className="text-[12px] text-[#e8415a] text-center py-1">{error}</p>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2.5">
          <input
            className="bg-[rgba(11,9,20,0.8)] border border-white/[0.08] text-text-primary px-4 py-3 rounded-xl font-[inherit] text-sm outline-none flex-1 placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,48,90,0.12)] transition-[border-color,box-shadow] duration-200"
            placeholder={`${persona.name}-д бичих...`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            disabled={sending}
          />
          <button
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="w-11 h-11 rounded-xl flex items-center justify-center bg-[linear-gradient(135deg,#c8254a,#780f20)] text-white shadow-[0_4px_16px_rgba(158,24,56,0.35)] hover:-translate-y-px transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {sending ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
          </button>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card border border-white/[0.08] rounded-[24px] p-6 w-full max-w-[340px] shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
            <h3 className="font-serif text-[18px] font-bold mb-2">Яриаг устгах уу?</h3>
            <p className="text-text-secondary text-[13px] mb-6 leading-relaxed">
              {persona.name}-тай хийсэн бүх яриа устгагдана. Энэ үйлдлийг буцаах боломжгүй.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-text-secondary border border-white/[0.08] bg-transparent hover:border-white/[0.15] transition-colors cursor-pointer"
              >
                Болих
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-[linear-gradient(135deg,#e8415a,#9e1838)] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {deleting && <Loader2 size={13} className="animate-spin" />}
                Устгах
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GreetingBubble({ avatar, name, text }: { avatar?: string; name: string; text: string }) {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full overflow-hidden bg-bg-elevated shrink-0">
        {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm">🤖</div>}
      </div>
      <div className="max-w-[75%] px-3.5 py-2.5 rounded-[18px] rounded-bl-[4px] text-sm leading-relaxed bg-bg-elevated text-text-primary border border-white/[0.07] italic text-text-secondary">
        {text}
      </div>
    </div>
  );
}

function MessageBubble({ msg, avatarUrl, name }: { msg: AIHumanMessage; avatarUrl?: string; name: string }) {
  const isUser = msg.role === "user";
  const isOptimistic = msg._id.startsWith("opt-");

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className={`max-w-[75%] px-3.5 py-2.5 rounded-[18px] rounded-br-[4px] text-sm leading-relaxed text-white shadow-[0_4px_16px_rgba(200,48,90,0.3)] ${isOptimistic ? "opacity-60" : ""}`}
          style={{ background: "linear-gradient(135deg,#c8305a,#a0204a)" }}>
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full overflow-hidden bg-bg-elevated shrink-0">
        {avatarUrl ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm">🤖</div>}
      </div>
      <div className="max-w-[75%] px-3.5 py-2.5 rounded-[18px] rounded-bl-[4px] text-sm leading-relaxed bg-bg-elevated text-text-primary border border-white/[0.07]">
        {msg.content}
      </div>
    </div>
  );
}
