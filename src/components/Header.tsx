"use client";

import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border/50 px-6 glass">
      <h1 className="text-xl font-bold gradient-text">Feelist</h1>
      <Button className="" onClick={() => console.log("login")}>
        Spotify Login
      </Button>
    </header>
  );
}
