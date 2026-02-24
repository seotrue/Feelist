"use client";

import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { SpotifyUser } from "@/types";

// 로그인 후 컴포넌트
function AuthenticatedSection({
  user,
  onLogout,
}: {
  user: SpotifyUser;
  onLogout: () => void;
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

// 로그인 전 컴포넌트
function UnauthenticatedSection({ onLogin }: { onLogin: () => void }) {
  return (
    <Button variant="gradient" size="sm" onClick={onLogin}>
      Spotify로 로그인
    </Button>
  );
}

export function Header() {
  const { user, login, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/50 px-6 glass">
      <h1 className="text-xl font-bold gradient-text">Feelist</h1>

      {user ? (
        <AuthenticatedSection user={user} onLogout={logout} />
      ) : (
        <UnauthenticatedSection onLogin={login} />
      )}
    </header>
  );
}
