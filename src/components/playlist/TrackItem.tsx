import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SpotifyTrack } from "@/types";

// 헬퍼 함수: 아티스트 이름 문자열 변환
function getArtistNames(artists: SpotifyTrack["artists"]): string {
  if (!Array.isArray(artists) || artists.length === 0) return "Unknown Artist";
  return artists
    .map((artist) => artist.name)
    .filter(Boolean)
    .join(", ");
}

// 헬퍼 함수: 앨범 이미지 URL 추출 (없으면 null)
function getAlbumImageUrl(track: SpotifyTrack): string | null {
  const images = track.album?.images;
  if (!Array.isArray(images) || images.length === 0) return null;
  const url = images[0]?.url;
  return typeof url === "string" && url.length > 0 ? url : null;
}

interface TrackItemProps {
  track: SpotifyTrack;
}

export function TrackItem({ track }: TrackItemProps) {
  const artistNames = getArtistNames(track.artists);
  const albumImageUrl = getAlbumImageUrl(track);
  const hasPreview = typeof track.preview_url === "string";

  return (
    <Card variant="glass">
      <CardContent className="flex items-center gap-4 p-4">
        {/* 앨범 아트 */}
        {albumImageUrl ? (
          <Image
            src={albumImageUrl}
            alt={`${track.name} 앨범 커버`}
            width={64}
            height={64}
            className="rounded-md shrink-0 object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="size-16 rounded-md shrink-0 bg-muted flex items-center justify-center text-xs text-muted-foreground"
            aria-label="앨범 이미지 없음"
          >
            N/A
          </div>
        )}

        {/* 트랙 정보 */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{track.name}</p>
          <p className="text-sm text-muted-foreground truncate">{artistNames}</p>
        </div>

        {/* 미리듣기 버튼 */}
        <Button variant="outline" size="sm" disabled={!hasPreview}>
          {hasPreview ? "미리듣기" : "미리보기 없음"}
        </Button>
      </CardContent>
    </Card>
  );
}
