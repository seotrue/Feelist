"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Music, Play, Pause, ExternalLink } from "lucide-react";
import { TrackItemProps } from "@/types";

/**
 * duration_ms를 "3:45" 형식으로 변환
 */
function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function TrackItem({ track, index, showPreview = true }: TrackItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio 인스턴스 초기화 및 정리
  useEffect(() => {
    if (track.preview_url) {
      audioRef.current = new Audio(track.preview_url);
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
    }

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [track.preview_url]);

  // 재생/일시정지 토글
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Card variant="glass" className="hover:glow-primary transition-all">
      <CardContent className="flex items-center gap-4 p-4">
        {/* 트랙 순번 (옵션) */}
        {index !== undefined && (
          <span className="text-muted-foreground text-sm w-6 text-right">
            {index + 1}
          </span>
        )}

        {/* 앨범아트 */}
        <Avatar className="h-16 w-16 rounded-md">
          <AvatarImage
            src={track.album.images[0]?.url}
            alt={track.album.name}
          />
          <AvatarFallback className="rounded-md">
            <Music className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>

        {/* 트랙 정보 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{track.name}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {track.artists.map((artist) => artist.name).join(", ")} •{" "}
            {formatDuration(track.duration_ms)}
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2">
          {/* 미리듣기 버튼 */}
          {showPreview && track.preview_url && (
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              aria-label={isPlaying ? "일시정지" : "미리듣기"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Spotify 링크 */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Spotify에서 열기"
          >
            <a
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
