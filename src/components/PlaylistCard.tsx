"use client";

import { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Music, Clock, Play, Share2 } from "lucide-react";
import type { Playlist } from "@/types";

interface PlaylistCardProps {
  playlist?: Playlist;
  isLoading?: boolean;
  onShare?: () => void;
}

const UI_TEXT = {
  empty: "플레이리스트가 생성되면 여기 표시됩니다",
  loadingAriaLabel: "플레이리스트 로딩 중",
  openInSpotify: "Spotify에서 재생",
  shareAriaLabel: "플레이리스트 공유",
  loadingSrText: "플레이리스트를 생성하고 있습니다...",
  aiCuration: "AI 큐레이션",
  trackCount: (count: number) => `${count}트랙`,
  moreTracksText: (count: number) => `+ ${count}개 트랙 더 보기`,
} as const;

type ViewState =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "ready"; playlist: Playlist };

function resolveViewState(params: {
  isLoading?: boolean;
  playlist?: Playlist;
}): ViewState {
  if (params.isLoading === true) return { status: "loading" };
  if (!params.playlist) return { status: "empty" };
  return { status: "ready", playlist: params.playlist };
}

function formatTrackDuration(milliseconds: number): string {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return "0:00";

  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatTotalDuration(milliseconds: number): string {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return "0분";

  const totalMinutes = Math.floor(milliseconds / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) return `${minutes}분`;
  if (minutes <= 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

function calculateTotalDurationMilliseconds(playlist: Playlist): number {
  return playlist.tracks.reduce((sum, track) => sum + track.duration_ms, 0);
}

function PlaylistCardSkeleton() {
  return (
    <Card
      className="w-full max-w-md"
      role="status"
      aria-busy="true"
      aria-label={UI_TEXT.loadingAriaLabel}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-14 w-14 rounded-lg shrink-0" aria-hidden="true" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" aria-hidden="true" />
            <Skeleton className="h-4 w-24" aria-hidden="true" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-2 py-1.5">
            <div className="flex flex-col gap-1.5 flex-1">
              <Skeleton className="h-4 w-32" aria-hidden="true" />
              <Skeleton className="h-3 w-20" aria-hidden="true" />
            </div>
            <Skeleton className="h-3 w-10 shrink-0" aria-hidden="true" />
          </div>
        ))}
        <Skeleton className="h-3 w-28 mt-1" aria-hidden="true" />
      </CardContent>

      <CardFooter className="gap-2">
        <Skeleton className="h-9 flex-1 rounded-md" aria-hidden="true" />
        <Skeleton className="h-9 w-9 rounded-md" aria-hidden="true" />
      </CardFooter>

      <span className="sr-only">{UI_TEXT.loadingSrText}</span>
    </Card>
  );
}

function PlaylistCardEmpty() {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="flex items-center justify-center h-40">
        <p className="text-sm text-muted-foreground">{UI_TEXT.empty}</p>
      </CardContent>
    </Card>
  );
}

function PlaylistCardReady(props: { playlist: Playlist; onShare?: () => void }) {
  const { playlist, onShare } = props;

  const trackCount = playlist.tracks.length;
  const previewTracks = useMemo(() => playlist.tracks.slice(0, 3), [playlist.tracks]);
  const remainingTracksCount = Math.max(0, trackCount - 3);

  const spotifyUrl = typeof playlist.spotifyUrl === "string" ? playlist.spotifyUrl : "";
  const canOpenSpotify = spotifyUrl.length > 0;
  const canShare = typeof onShare === "function";

  const handleOpenSpotify = () => {
    if (!canOpenSpotify) return;
    window.open(spotifyUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted shrink-0">
            <Music className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <CardTitle className="text-base truncate">{playlist.name}</CardTitle>
            <CardDescription>
              {UI_TEXT.aiCuration} · {UI_TEXT.trackCount(trackCount)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {previewTracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
          >
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium truncate">{track.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {track.artists.map((a) => a.name).join(", ")}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 ml-2">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {formatTrackDuration(track.duration_ms)}
            </div>
          </div>
        ))}

        {remainingTracksCount > 0 && (
          <p className="text-xs text-muted-foreground pt-1">
            {UI_TEXT.moreTracksText(remainingTracksCount)}
          </p>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        {canOpenSpotify && (
          <Button variant="gradient" size="sm" className="flex-1" onClick={handleOpenSpotify}>
            <Play className="h-4 w-4" aria-hidden="true" />
            {UI_TEXT.openInSpotify}
          </Button>
        )}

        {canShare && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onShare}
            aria-label={UI_TEXT.shareAriaLabel}
            title={UI_TEXT.shareAriaLabel}
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function PlaylistCard(props: PlaylistCardProps) {
  const viewState = resolveViewState({
    playlist: props.playlist,
    isLoading: props.isLoading,
  });

  if (viewState.status === "loading") return <PlaylistCardSkeleton />;
  if (viewState.status === "empty") return <PlaylistCardEmpty />;
  return <PlaylistCardReady playlist={viewState.playlist} onShare={props.onShare} />;
}