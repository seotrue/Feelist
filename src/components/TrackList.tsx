import { TrackItem } from "./TrackItem";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "./ui/card";
import { SpotifyTrack } from "@/types";

interface TrackListProps {
  tracks?: SpotifyTrack[];
  isLoading?: boolean;
}

/**
 * TrackItem Skeleton 로딩 상태
 */
function TrackItemSkeleton() {
  return (
    <Card variant="glass">
      <CardContent className="flex items-center gap-4 p-4">
        {/* 순번 */}
        <Skeleton className="h-4 w-6 shrink-0" />
        {/* 앨범아트 */}
        <Skeleton className="size-16 rounded-md shrink-0" />
        {/* 트랙 정보 */}
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-5 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
        {/* 액션 버튼 */}
        <Skeleton className="h-10 w-10 rounded-md shrink-0" />
        <Skeleton className="h-10 w-10 rounded-md shrink-0" />
      </CardContent>
    </Card>
  );
}

export function TrackList({ tracks, isLoading }: TrackListProps) {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <h3 className="text-xl font-semibold text-muted-foreground">추천 트랙</h3>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <TrackItemSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 빈 상태 */}
      {!isLoading && (!tracks || tracks.length === 0) && (
        <div className="flex items-center justify-center h-24">
          <p className="text-muted-foreground">추천 트랙이 없습니다.</p>
        </div>
      )}

      {/* 트랙 목록 */}
      {!isLoading && tracks && tracks.length > 0 && (
        <div className="space-y-3">
          {tracks.map((track, index) => (
            <TrackItem
              key={track.id}
              track={track}
              index={index}
              showPreview={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
