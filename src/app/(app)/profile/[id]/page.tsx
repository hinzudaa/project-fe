"use client";
import Link from "next/link";
import { MessageCircle, Heart, ArrowLeft, Star, MapPin, Calendar, Clock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = decodeURIComponent(params.id as string);
  const avatarLetter = username.charAt(0).toUpperCase();

  return (
    <div className="max-w-[860px] mx-auto pb-12 w-full">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-text-muted hover:text-white mb-5 transition-colors bg-transparent border-none cursor-pointer p-0 text-sm font-medium"
      >
        <ArrowLeft size={16} /> Буцах
      </button>

      {/* Profile Header Card */}
      <div className="bg-bg-card border border-white/[0.08] rounded-[28px] overflow-hidden relative shadow-2xl">

        {/* Cover Photo */}
        <div className="h-48 md:h-64 relative w-full bg-bg-secondary">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/40 to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="px-6 md:px-10 pb-8 relative -mt-16 md:-mt-20 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end text-center md:text-left">

          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] flex items-center justify-center text-[56px] md:text-[72px] font-black font-serif text-white shrink-0 border-4 border-bg-card relative z-10"
              style={{ background: "linear-gradient(135deg, #e8415a, #9b59ff)", boxShadow: "0 16px 40px rgba(232,65,90,0.4)" }}>
              {avatarLetter}
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green rounded-full border-4 border-bg-card z-20" />
          </div>

          {/* Info */}
          <div className="flex-1 pb-2">
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-1.5 text-white">{username}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-text-muted font-medium">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#e8415a]" /> Улаанбаатар</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#a06de0]" /> 1 жилийн өмнө нэгдсэн</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full md:w-auto pb-2 shrink-0">
            <button className="flex-1 md:flex-none w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(255,255,255,0.05)] border border-white/10 text-white transition-all hover:bg-[rgba(255,255,255,0.1)] hover:scale-105 cursor-pointer">
              <Heart size={20} />
            </button>
            <Link href={`/chat?user=${encodeURIComponent(username)}`} className="flex-1 md:flex-none">
              <button className="w-full flex items-center justify-center gap-2 px-8 h-12 rounded-2xl font-bold text-white transition-all hover:scale-105 border-none cursor-pointer"
                style={{ background: "linear-gradient(135deg, #e8415a, #9e1838)", boxShadow: "0 8px 24px rgba(232,65,90,0.35)" }}>
                <MessageCircle size={18} /> Чатлах
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        {/* Left Column (About & Stats) */}
        <div className="flex flex-col gap-6 md:col-span-1">
          {/* About */}
          <div className="bg-bg-card border border-white/[0.05] rounded-[24px] p-6">
            <h3 className="font-bold text-lg mb-3 text-white flex items-center gap-2">
              <Star size={18} className="text-[#e8b850]" /> Тухай
            </h3>
            <p className="text-text-secondary text-[14px] leading-relaxed mb-5">
              Сайн байна уу? Би шинэ хүмүүстэй танилцах, сонирхолтой сэдвээр ярилцах дуртай. Амралтын өдрүүдэд аялалд явах дуртай.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Аялал', 'Roleplay', 'Кофе', 'Ном', 'Улаанбаатар'].map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[12px] text-text-muted hover:text-white transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-bg-card border border-white/[0.05] rounded-[24px] p-6">
            <h3 className="font-bold text-lg mb-4 text-white">Үзүүлэлт</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-2xl font-black font-serif text-[#e8415a] mb-1">128</div>
                <div className="text-[11px] text-text-muted uppercase tracking-wider font-bold">Нийтлэл</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-2xl font-black font-serif text-[#9b59ff] mb-1">2.4k</div>
                <div className="text-[11px] text-text-muted uppercase tracking-wider font-bold">Таалагдсан</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Recent Posts) */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h3 className="font-bold text-lg mb-1 text-white px-2 flex items-center gap-2">
            <Clock size={18} className="text-[#388add]" /> Сүүлийн нийтлэлүүд
          </h3>

          {[1, 2, 3].map((post) => (
            <div key={post} className="bg-bg-card border border-white/[0.05] rounded-[20px] p-5 hover:border-white/[0.1] transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 text-white"
                  style={{ background: "linear-gradient(135deg, #e8415a, #9b59ff)" }}>
                  {avatarLetter}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white">{username}</div>
                  <div className="text-[11px] text-text-muted">{post} өдрийн өмнө</div>
                </div>
              </div>
              <h4 className="text-[15px] font-bold mb-2 font-serif text-white">Яг одоо хамгийн их сонсож байгаа дуу чинь юу вэ?</h4>
              <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-2">
                Сүүлийн үед ажилдаа явахдаа байнга нэг дууг repeat дээр сонсоод байна. Та бүхний playlist-д юу байна хуваалцаач?
              </p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.04] text-[12px] text-text-muted font-medium">
                <span className="flex items-center gap-1.5 hover:text-[#e8415a] transition-colors"><Heart size={14} /> {45 * post}</span>
                <span className="flex items-center gap-1.5 hover:text-white transition-colors"><MessageCircle size={14} /> {12 * post}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
