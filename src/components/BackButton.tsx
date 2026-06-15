"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="liquid-glass rounded-full pl-3 pr-5 py-2 inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
    >
      <ArrowLeft size={16} />
      <span>Буцах</span>
    </button>
  );
}
