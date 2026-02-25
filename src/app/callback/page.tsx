"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTokens, setUser, logout } = useAuthStore();
  const hasStarted = useRef(false);

  const handleExchangeCode = async (code: string, verifier: string) => {
    try {
      const response = await fetch("/api/auth/spotify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, codeVerifier: verifier }),
      });

      if (!response.ok) {
        throw new Error("Failed to exchange authorization code");
      }

      const data = await response.json();
      setTokens(data.access_token, data.refresh_token, data.expires_in);
      setUser(data.user);
      router.replace("/");
    } catch (error) {
      console.error("Authentication failed:", error);
      logout();
      router.replace("/");
    }
  };

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const code = searchParams.get("code");
    const verifier = sessionStorage.getItem("pkce_verifier");

    if (!code || !verifier) {
      router.replace("/");
      return;
    }

    sessionStorage.removeItem("pkce_verifier");
    handleExchangeCode(code, verifier);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">로그인 중...</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">로그인 중...</p>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
