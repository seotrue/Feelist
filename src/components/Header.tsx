"use client";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <h1 className="text-xl font-bold gradient-text">Feelist</h1>
      <div>{/* SpotifyLoginButton will go here */}</div>
    </header>
  );
}
