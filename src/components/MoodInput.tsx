"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { PRESET_PROMPTS } from "@/lib/prompts";

interface MoodInputProps {
  onAnalyze: (prompt: string) => void;
  isLoading?: boolean;
}

export function MoodInput({ onAnalyze, isLoading = false }: MoodInputProps) {
  const [userInput, setUserInput] = useState("");

  // 랜덤 프리셋 (suppressHydrationWarning으로 서버/클라이언트 불일치 허용)
  const [randomPresets] = useState(() =>
    [...PRESET_PROMPTS].sort(() => Math.random() - 0.5).slice(0, 3),
  );

  const handleGenerate = () => {
    const trimmed = userInput.trim();
    if (trimmed) {
      onAnalyze(trimmed);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* 자연어 입력 + 예시 프리셋 */}
      <h3 className="text-3xl font-bold gradient-text">
        How are you feeling today?
      </h3>

      <Input
        className="glow-primary"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        placeholder="예: 비 오는 날 카페에서 코딩할 때"
      />
      <div className="flex gap-2">
        {randomPresets.map((preset) => (
          <Badge
            suppressHydrationWarning
            variant="default"
            className="gradient-text cursor-pointer hover:opacity-80 transition-opacity"
            key={preset}
            onClick={() => setUserInput(preset)}
          >
            {preset}
          </Badge>
        ))}
      </div>

      <Button
        variant="gradient"
        onClick={handleGenerate}
        disabled={isLoading || !userInput.trim()}
      >
        {isLoading ? "Analyzing..." : "Generate"}
      </Button>
    </div>
  );
}
