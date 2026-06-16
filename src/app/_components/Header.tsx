"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, User, Search } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "@/store/AuthProvider";
import { useNotifications } from "@/store/NotificationProvider";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  if (loading || pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/terms") || pathname.startsWith("/privacy")) return null;

  const isLoggedIn = !!user;
  const avatarLetter = (user?.name ?? user?.username ?? "М").charAt(0).toUpperCase();

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    router.push("/login");
  }

  return (
    <header className="md:left-[264px] fixed top-0 left-0 right-0 z-30 flex items-center justify-between h-16 px-6 md:px-10 bg-[rgba(11,9,11,0.55)] backdrop-blur-[14px] border-b border-white/5">
      <div className="hidden md:flex items-center gap-2.5 px-4 py-2.5 rounded-[14px] bg-white/5 border border-white/8 w-[340px]">
        <Search size={18} className="text-[#F6F0F3]/50" />
        <input
          type="text"
          placeholder="Хүн, сонирхол хайх..."
          className="bg-transparent border-none outline-none text-[#F6F0F3] text-sm w-full font-sans placeholder-[#F6F0F3]/40"
        />
      </div>

      <Link href="/" className="md:hidden flex items-center gap-2.5 no-underline shrink-0">
        <span className="font-cursive text-[40px] leading-[0.9] bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] bg-clip-text text-transparent select-none">Huslen</span>
      </Link>
      {isLoggedIn ? (
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <Link href="/notifications" className="no-underline">
            <button className="relative w-[42px] h-[42px] rounded-[13px] flex items-center justify-center bg-white/5 border border-white/8 text-[#F6F0F3] cursor-pointer transition-colors duration-200 hover:bg-white/10">
              <Bell size={19} strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] text-white text-[11px] font-bold flex items-center justify-center border-2 border-[#0B090B]">
                  {unreadCount > 99 ? "99" : unreadCount}
                </span>
              )}
            </button>
          </Link>

          {/* User Menu Trigger */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="w-[42px] h-[42px] rounded-[13px] overflow-hidden bg-gradient-to-br from-[#8b5cf6] to-[#FF2D55] flex items-center justify-center font-bold text-white text-base shadow-lg border-none p-0 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                avatarLetter
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-44 rounded-xl bg-[rgba(18,10,24,0.95)] border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-[13px] font-semibold text-white truncate m-0">{user?.name ?? user?.username}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#F6F0F3]/70 hover:text-white hover:bg-white/[0.04] transition-colors no-underline text-left"
                >
                  <User size={14} strokeWidth={1.8} />
                  Профайл
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#FF2D55] hover:bg-white/[0.04] transition-colors bg-transparent border-none cursor-pointer text-left font-sans"
                >
                  <LogOut size={14} strokeWidth={1.8} />
                  Гарах
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/login">
            <button className="text-[#F6F0F3]/70 border border-white/7 rounded-[12px] font-medium text-[13px] cursor-pointer transition-all duration-200 hover:text-white hover:border-white/14 px-5 py-[9px] bg-transparent">
              Нэвтрэх
            </button>
          </Link>
          <Link href="/register">
            <button className="text-white border-none rounded-[12px] font-semibold text-[13px] cursor-pointer transition-all duration-200 hover:-translate-y-px px-5 py-[9px] bg-gradient-to-br from-[#FF5C8A] to-[#FF2D55] shadow-[0_4px_22px_rgba(255,45,85,0.38)]">
              Бүртгүүлэх
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
