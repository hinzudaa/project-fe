"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function AgeVerification() {
  const [isVerified, setIsVerified] = useState(true);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem("age_verified");
    if (verified !== "true") {
      setIsVerified(false);
    }
  }, []);

  const handleVerify = (isAdult: boolean) => {
    if (isAdult) {
      localStorage.setItem("age_verified", "true");
      setIsVerified(true);
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  if (isVerified) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div 
        className="w-full max-w-md p-8 rounded-2xl relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(200,37,74,0.1) 0%, rgba(12,9,25,0.95) 100%)",
          border: "1px solid rgba(232,65,90,0.3)",
          boxShadow: "0 8px 32px rgba(232,65,90,0.2)",
        }}
      >
        <div className="absolute right-0 top-0 w-32 h-32 pointer-events-none"
            style={{ background: "radial-gradient(circle at 75% 25%, rgba(232,65,90,0.15) 0%, transparent 65%)" }} />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
            style={{ background: "rgba(232,65,90,0.15)", border: "1px solid rgba(232,65,90,0.4)" }}>
            <AlertTriangle size={32} strokeWidth={1.5} style={{ color: "#e8415a" }} />
          </div>
          
          <h2 className="text-2xl font-serif font-black mb-3 text-white">
            Насны хязгаар
          </h2>
          
          {!showError ? (
            <>
              <p className="text-text-secondary mb-8 text-[15px] leading-relaxed">
                Энэхүү цахим хуудас нь насанд хүрэгчдэд зориулагдсан контент агуулсан байж болзошгүй. Та 18 нас хүрсэн үү?
              </p>
              
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => handleVerify(false)}
                  className="flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:bg-white/5"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Үгүй
                </button>
                <button 
                  onClick={() => handleVerify(true)}
                  className="flex-1 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{ 
                    background: "linear-gradient(135deg, #e8415a, #9e1838)", 
                    boxShadow: "0 4px 16px rgba(232,65,90,0.4)" 
                  }}
                >
                  Тийм, би 18+
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-text-secondary mb-6 text-[15px] leading-relaxed">
                Уучлаарай, та 18 нас хүрээгүй тул энэхүү сайтад нэвтрэх боломжгүй.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
