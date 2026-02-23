import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Music, ExternalLink } from "lucide-react";
import { Playlist } from "@/types";

interface PlaylistCardProps {
  playlist: Playlist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  // 앨범아트 이미지 최대 4개 추출
  const albumImages = playlist.tracks
    .slice(0, 4)
    .map((track) => track.album.images[0]?.url)
    .filter(Boolean);

  // 생성 날짜 포맷
  const formattedDate = new Date(playlist.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card variant="glass" className="max-w-md mx-auto overflow-hidden">
      <CardContent className="p-6 space-y-4">
        {/* 앨범아트 그리드 */}
        <div className="grid grid-cols-2 gap-2 w-full aspect-square rounded-lg overflow-hidden bg-muted">
          {albumImages.length > 0 ? (
            albumImages.map((url, i) => (
              <div key={i} className="relative w-full h-full">
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))
          ) : (
            <div className="col-span-2 flex items-center justify-center">
              <Music className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* 텍스트 정보 */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold gradient-text">
            {playlist.name}
          </h2>
          <p className="text-muted-foreground line-clamp-3">
            {playlist.description}
          </p>
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Music className="h-4 w-4" />
          <span>
            {playlist.tracks.length} tracks • {formattedDate}
          </span>
        </div>

        {/* Spotify 버튼 */}
        {playlist.spotifyUrl && (
          <Button variant="gradient" className="w-full" asChild>
            <a
              href={playlist.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Spotify에서 열기
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
