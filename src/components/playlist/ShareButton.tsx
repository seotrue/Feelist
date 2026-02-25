"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check, Copy } from "lucide-react";

// 공유 상태 타입
type ShareStatus = "idle" | "copied" | "error";

interface ShareButtonProps {
  playlistId: string;
  className?: string;
}

// 상태별 UI 상수
const STATUS_CONFIG = {
  idle: {
    icon: Share2,
    label: "공유",
    className: "",
  },
  copied: {
    icon: Check,
    label: "복사됨!",
    className: "text-green-400",
  },
  error: {
    icon: Copy,
    label: "복사 실패",
    className: "text-destructive",
  },
} as const satisfies Record<
  ShareStatus,
  { icon: React.ElementType; label: string; className: string }
>;

// 헬퍼 함수: 공유 URL 생성
function buildShareUrl(playlistId: string): string {
  return `${window.location.origin}/playlist/${playlistId}`;
}

// 헬퍼 함수: Web Share API 사용 가능 여부 확인
function canUseWebShare(data: ShareData): boolean {
  return (
    typeof navigator.share === "function" &&
    navigator.canShare?.(data) === true
  );
}

// 헬퍼 함수: 클립보드에 복사
async function copyToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    throw new Error("Clipboard API를 지원하지 않는 환경입니다.");
  }
  await navigator.clipboard.writeText(text);
}

export function ShareButton({ playlistId, className }: ShareButtonProps) {
  const [status, setStatus] = useState<ShareStatus>("idle");

  const handleShare = async () => {
    const url = buildShareUrl(playlistId);
    const shareData: ShareData = {
      title: "Feelist 플레이리스트",
      text: "AI가 큐레이션한 플레이리스트를 들어보세요!",
      url,
    };

    // Web Share API 우선 시도 (모바일 등 native share)
    if (canUseWebShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // 사용자가 직접 취소한 경우 → 무시
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }

    // 클립보드 복사 fallback
    try {
      await copyToClipboard(url);
      setStatus("copied");
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  const { icon: Icon, label, className: iconClassName } = STATUS_CONFIG[status];

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      className={className}
      aria-label="플레이리스트 링크 공유"
    >
      <Icon className={`size-4 mr-2 ${iconClassName}`} />
      {label}
    </Button>
  );
}
