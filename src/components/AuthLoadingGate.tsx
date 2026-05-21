"use client";
import { useState, useEffect, ReactNode } from "react";
import SplashScreen from "@/components/SplashScreen";
import AgeVerification from "@/components/AgeVerification";

export default function AuthLoadingGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [showAgeVerify, setShowAgeVerify] = useState(false);

  useEffect(() => {
    const isFirstSession = !sessionStorage.getItem("splashShown");
    const isAgeVerified = localStorage.getItem("age_verified") === "true";

    if (isFirstSession) {
      sessionStorage.setItem("splashShown", "1");
      setShowSplash(true);
    } else if (!isAgeVerified) {
      setShowAgeVerify(true);
    }

    setReady(true);
  }, []);

  if (!ready) return null;

  if (showSplash) {
    return (
      <SplashScreen
        onDone={() => {
          setShowSplash(false);
          if (localStorage.getItem("age_verified") !== "true") {
            setShowAgeVerify(true);
          }
        }}
      />
    );
  }

  if (showAgeVerify) {
    return (
      <>
        {children}
        <AgeVerification onVerified={() => setShowAgeVerify(false)} />
      </>
    );
  }

  return <>{children}</>;
}
