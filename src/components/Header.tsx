"use client";

import { Button } from "./ui/button";
import type { SpotifyUser } from "@/types";

interface HeaderProps {
  user?: SpotifyUser | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

// 로그인 상태: 유저 정보 + 로그아웃 버튼
function AuthenticatedSection({
  user,
  onLogout,
}: {
  user: SpotifyUser;
  onLogout?: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground hidden sm:block">
        {user.display_name}
      </span>
      <Button variant="outline" size="sm" onClick={onLogout}>
        로그아웃
      </Button>
    </div>
  );
}

// 비로그인 상태: 로그인 버튼
function UnauthenticatedSection({ onLogin }: { onLogin?: () => void }) {
  return (
    <Button variant="gradient" size="sm" onClick={onLogin}>
      Spotify로 로그인
    </Button>
  );
}

export function Header({ user, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/50 px-6 glass">
      {/* 로고 */}
      <h1 className="text-xl font-bold gradient-text">Feelist</h1>

      {/* 인증 상태에 따른 UI 분기 */}
      {user ? (
        <AuthenticatedSection user={user} onLogout={onLogout} />
      ) : (
        <UnauthenticatedSection onLogin={onLogin} />
      )}
    </header>
  );
}
