"use client";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Music, ListMusic, Clock, ExternalLink, Share2 } from "lucide-react";
import type { Playlist } from "@/types";

// 타입 정의
interface PlaylistCardProps {
  playlist?: Playlist;
  isLoading?: boolean;
  onShare?: () => void;
}

// Discriminated Union으로 타입 안전성 확보
type ViewState =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "ready"; playlist: Playlist };

// 메시지 상수
const MESSAGES = {
  EMPTY: "플레이리스트가 생성되면 여기 표시됩니다",
} as const;

// 헬퍼 함수: ms를 "1시간 23분" 형식으로 변환
function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "0분";

  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) return `${hours}시간 ${minutes}분`;
  return `${minutes}분`;
}

// 헬퍼 함수: 트랙 총 재생 시간 계산 (ms)
function getTotalDuration(playlist: Playlist): number {
  return playlist.tracks.reduce((sum, track) => sum + track.duration_ms, 0);
}

// 헬퍼 함수: 뷰 상태 결정
function getViewState(input: {
  isLoading?: boolean;
  playlist?: Playlist;
}): ViewState {
  if (input.isLoading === true) return { status: "loading" };
  if (!input.playlist) return { status: "empty" };
  return { status: "ready", playlist: input.playlist };
}

// Skeleton 컴포넌트
function PlaylistCardSkeleton() {
  return (
    <Card variant="glass" className="w-full max-w-2xl">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="size-6 rounded shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return <PlaylistCardSkeleton />;
}

function EmptyState() {
  return (
    <Card variant="glass" className="w-full max-w-2xl">
      <CardContent className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">{MESSAGES.EMPTY}</p>
      </CardContent>
    </Card>
  );
}

function ReadyState({
  playlist,
  onShare,
}: {
  playlist: Playlist;
  onShare?: () => void;
}) {
  const trackCount = playlist.tracks.length;
  const totalDuration = getTotalDuration(playlist);

  const handleOpenSpotify = () => {
    if (playlist.spotifyUrl) {
      window.open(playlist.spotifyUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card variant="glass" className="w-full max-w-2xl">
      <CardContent className="p-6 space-y-4">
        {/* 헤더: 아이콘 + 제목 + 설명 */}
        <div className="flex items-start gap-3">
          <Music className="size-6 text-primary shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold gradient-text truncate">
              {playlist.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {playlist.description}
            </p>
          </div>
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ListMusic className="size-4" />
            {trackCount}곡
          </span>
          {totalDuration > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {formatDuration(totalDuration)}
            </span>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2">
          {playlist.spotifyUrl && (
            <Button
              variant="gradient"
              className="flex-1"
              onClick={handleOpenSpotify}
            >
              <ExternalLink className="size-4 mr-2" />
              Spotify에서 열기
            </Button>
          )}
          {onShare && (
            <Button variant="outline" size="icon" onClick={onShare}>
              <Share2 className="size-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function PlaylistCard({
  playlist,
  isLoading,
  onShare,
}: PlaylistCardProps) {
  const viewState = getViewState({ playlist, isLoading });

  function renderContent() {
    switch (viewState.status) {
      case "loading":
        return <LoadingState />;
      case "empty":
        return <EmptyState />;
      case "ready":
        return <ReadyState playlist={viewState.playlist} onShare={onShare} />;
    }
  }

  return renderContent();
}
