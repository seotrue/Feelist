import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface TrackItemProps {
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
      images: { url: string }[];
    };
    preview_url?: string;
  };
}

export function TrackItem({ track }: TrackItemProps) {
  return (
    <Card variant="glass">
      <CardContent className="flex items-center gap-4 p-4">
        {/* 앨범 아트 */}
        <Image
          src={track.album.images[0].url}
          alt={track.name}
          width={64}
          height={64}
          className="rounded-md"
        />
        {/* 트랙 정보 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{track.name}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {track.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
        {/* 미리듣기 */}
        <Button variant="outline">미리듣기 재생</Button>
      </CardContent>
    </Card>
  );
}
