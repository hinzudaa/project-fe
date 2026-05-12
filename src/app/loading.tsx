"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg-primary/80 backdrop-blur-md">
      <div className="relative flex flex-col items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[rgba(232,65,90,0.15)] rounded-full blur-2xl animate-pulse" />

        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-white/5" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#e8415a] border-r-[#9b59ff] animate-spin" style={{ animationDuration: '1s' }} />
        </div>

        <div className="text-white/80 text-[15px] font-medium tracking-wide flex items-center gap-1.5">
          Уншиж байна
          <span className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-[#e8415a] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-1 rounded-full bg-[#e8415a] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-1 rounded-full bg-[#e8415a] animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
      </div>
    </div>
  );
}
