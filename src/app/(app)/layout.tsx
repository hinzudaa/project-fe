"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Home, Heart, Drama, Users, MessageCircle, Film, Gamepad } from "lucide-react";
import AgeVerification from "@/components/AgeVerification";
import { useAuth } from "@/store/AuthProvider";

const NAV = [
  { href: "/", icon: Home, label: "Нүүр" },
  { href: "/swipe", icon: Heart, label: "Танилцах" },
  { href: "/roleplay", icon: Drama, label: "Roleplay" },
  { href: "/forum", icon: Users, label: "Forum" },
  { href: "/chat", icon: MessageCircle, label: "Чат" },
  { href: "/movies", icon: Film, label: "Бичлэг" },
  // { href: "/games", icon: Gamepad, label: "Тоглоом" },

];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, membershipActive } = useAuth();

  const displayName = user?.name ?? user?.phone ?? "Хэрэглэгч";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!membershipActive) {
      router.replace("/pricing");
    }
  }, [loading, user, membershipActive, pathname, router]);

  if (loading) return null;
  if (!user) return null;
  if (!membershipActive) return null;

  return (
    <div className="flex min-h-screen bg-bg-primary w-full overflow-x-hidden text-[#F6F0F3]">

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-[264px] shrink-0 fixed top-0 left-0 bottom-0 z-40 bg-white/[0.015] border-r border-white/6 flex-col p-[26px_18px_22px]">
        {/* BRAND LOGO */}
        <div className="px-2.5">
          <span className="font-cursive text-[40px] leading-[0.9] bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] bg-clip-text text-transparent select-none">Huslen</span>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-8 flex flex-col gap-1.25">
          {NAV.map(n => {
            const active = pathname === n.href;
            const Icon = n.icon;
            return (
              <Link key={n.href} href={n.href} className="no-underline">
                <div className={`flex items-center gap-3.25 p-[11px_14px] rounded-[14px] text-[15px] cursor-pointer transition-all duration-[180ms] w-full
                  ${active
                    ? "bg-gradient-to-r from-[#FF2D55]/22 to-[#FF2D55]/4 border border-[#FF2D55]/28 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-white font-bold"
                    : "text-[#F6F0F3]/62 border border-transparent hover:bg-white/5 hover:text-white font-semibold"
                  }`}>
                  <Icon size={20} strokeWidth={2} stroke={active ? "#FF2D55" : "currentColor"} />
                  <span>{n.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* USER PROFILE CARD */}
        <Link href="/profile" className="no-underline mt-auto">
          <div className="flex items-center gap-[11px] p-[11px_12px] rounded-[16px] bg-white/4 border border-white/7 transition-colors hover:bg-white/8 cursor-pointer">
            <div className="w-10 h-10 shrink-0 rounded-[12px] bg-gradient-to-br from-[#8b5cf6] to-[#FF2D55] flex items-center justify-center font-bold text-white text-base overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                avatarLetter
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[7px]">
                <span className="text-[14px] font-bold text-white truncate">{displayName}</span>
                {membershipActive ? (
                  <span className="text-[9px] font-extrabold tracking-[0.06em] px-1.5 py-0.5 rounded-[5px] bg-gradient-to-br from-[#F5C451] to-[#E8A23D] text-[#3A2A08]">PRO</span>
                ) : (
                  <span className="text-[9px] font-extrabold tracking-[0.06em] px-1.5 py-0.5 rounded-[5px] bg-gradient-to-br from-[#c8254a] to-[#780f20] text-white">PRO</span>
                )}
              </div>
              <div className="text-[12px] text-[#F6F0F3]/50 text-left">Профайл харах</div>
            </div>
          </div>
        </Link>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-[264px] min-h-screen flex flex-col pt-16 pb-[72px] md:pb-0 min-w-0 overflow-x-hidden">
        <div className="p-5 md:p-7 flex-1">{children}</div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[rgba(12,9,25,0.97)] backdrop-blur-[24px] border-t border-[rgba(158,24,56,0.15)] py-1.5 justify-around items-center">
        {NAV.map(n => {
          const Icon = n.icon;
          const active = pathname === n.href;
          return (
            <Link key={n.href} href={n.href} className="no-underline">
              <div
                className={`flex flex-col items-center gap-[3px] px-2.5 py-1 rounded-[10px] transition-colors duration-[180ms] ${active ? "text-[#e8415a]" : "text-text-muted"}`}
              >
                <Icon size={22} strokeWidth={active ? 2.2 : 1.6} />
                <span className={`text-[10px] tracking-[0.01em] ${active ? "font-bold" : "font-normal"}`}>{n.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
