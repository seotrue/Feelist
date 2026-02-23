"use client";

import { useState, useCallback } from "react";
import type { KeyboardEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { PRESET_PROMPTS } from "@/lib/prompts";

// 타입 정의
interface MoodInputProps {
  onAnalyze: (prompt: string) => void;
  isLoading?: boolean;
}

// UI 텍스트 상수
const UI_TEXT = {
  TITLE: "How are you feeling today?",
  PLACEHOLDER: "예: 비 오는 날 카페에서 코딩할 때",
  BUTTON_IDLE: "Generate",
  BUTTON_LOADING: "Analyzing...",
} as const;

// 헬퍼 함수: 랜덤 프리셋 N개 선택
function getRandomPresets(count: number = 3): string[] {
  return [...PRESET_PROMPTS].sort(() => Math.random() - 0.5).slice(0, count);
}

export function MoodInput({ onAnalyze, isLoading = false }: MoodInputProps) {
  const [userInput, setUserInput] = useState("");

  // 랜덤 프리셋 (suppressHydrationWarning으로 서버/클라이언트 불일치 허용)
  const [randomPresets] = useState(() => getRandomPresets());

  const isSubmittable = !isLoading && userInput.trim().length > 0;

  const handleGenerate = useCallback(() => {
    const trimmed = userInput.trim();
    if (!trimmed) return;
    onAnalyze(trimmed);
  }, [userInput, onAnalyze]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      // isComposing 체크: 한글 IME 조합 중 Enter 이중 발생 방지
      if (e.key === "Enter" && !e.nativeEvent.isComposing) {
        handleGenerate();
      }
    },
    [handleGenerate],
  );

  const handlePresetClick = useCallback((preset: string) => {
    setUserInput(preset);
  }, []);

  return (
    <div className="w-full max-w-2xl space-y-6">
      <h2 className="text-3xl font-bold gradient-text">{UI_TEXT.TITLE}</h2>

      <Input
        className="glow-primary"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={UI_TEXT.PLACEHOLDER}
        disabled={isLoading}
        aria-label="무드 입력"
      />

      {/* 랜덤 프리셋 */}
      <div className="flex flex-wrap gap-2">
        {randomPresets.map((preset) => (
          <Badge
            suppressHydrationWarning
            key={preset}
            variant="secondary"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handlePresetClick(preset)}
          >
            {preset}
          </Badge>
        ))}
      </div>

      <Button
        variant="gradient"
        onClick={handleGenerate}
        disabled={!isSubmittable}
      >
        {isLoading ? UI_TEXT.BUTTON_LOADING : UI_TEXT.BUTTON_IDLE}
      </Button>
    </div>
  );
}
