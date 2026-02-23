import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SpotifyUser } from "@/types";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  getAuthorizationUrl,
} from "@/lib/spotify";

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ?? "";
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI ?? "";

interface AuthStore {
  user: SpotifyUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;

  login: () => Promise<void>;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string, expiresIn: number) => void;
  setUser: (user: SpotifyUser) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,

      login: async () => {
        const verifier = generateCodeVerifier();
        const challenge = await generateCodeChallenge(verifier);
        sessionStorage.setItem("pkce_verifier", verifier);
        const url = getAuthorizationUrl(CLIENT_ID, REDIRECT_URI, challenge);
        window.location.href = url;
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
        });
      },

      setTokens: (accessToken, refreshToken, expiresIn) => {
        set({
          accessToken,
          refreshToken,
          expiresAt: Date.now() + expiresIn * 1000,
          isAuthenticated: true,
        });
      },

      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: "feelist-auth",
      // accessToken만 persist, 나머지는 필요에 따라 추가
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
