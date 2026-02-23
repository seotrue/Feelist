"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { exchangeCodeForTokens, getCurrentUser } from "@/lib/spotify";

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI ?? "";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTokens, setUser } = useAuthStore();
  const hasStarted = useRef(false);

  const handleExchangeCode = async (code: string, verifier: string) => {
    try {
      const tokens = await exchangeCodeForTokens(
        code,
        verifier,
        CLIENT_ID,
        REDIRECT_URI,
      );
      setTokens(tokens.access_token, tokens.refresh_token, tokens.expires_in);

      console.log("Token scopes:", tokens); // scope 필드 확인

      const user = await getCurrentUser(tokens.access_token);
      setUser(user);
      router.replace("/");
    } catch (error) {
      console.error(error);
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
