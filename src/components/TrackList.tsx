import { TrackItem } from "./TrackItem";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "./ui/card";

// 타입 정의
interface TrackListProps {
  tracks?: Array<{
    id: string;
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
    preview_url?: string;
  }>;
  isLoading?: boolean;
}

type Track = NonNullable<TrackListProps["tracks"]>[number];

// Discriminated Union으로 타입 안전성 확보
type ViewState =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "ready"; tracks: Track[] };

// 메시지 상수
const MESSAGES = {
  EMPTY: "추천 트랙이 없습니다.",
} as const;

// 헬퍼 함수: 뷰 상태 결정
function getViewState(input: {
  isLoading?: boolean;
  tracks?: TrackListProps["tracks"];
}): ViewState {
  if (input.isLoading === true) {
    return { status: "loading" };
  }

  if (!input.tracks || input.tracks.length === 0) {
    return { status: "empty" };
  }

  return { status: "ready", tracks: input.tracks };
}

// Skeleton 컴포넌트
function TrackItemSkeleton() {
  return (
    <Card variant="glass">
      <CardContent className="flex items-center gap-4 p-4">
        <Skeleton className="size-16 rounded-md shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-5 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <TrackItemSkeleton key={index} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center h-24">
      <p className="text-muted-foreground">{MESSAGES.EMPTY}</p>
    </div>
  );
}

function ReadyState({ tracks }: { tracks: Track[] }) {
  return (
    <div className="space-y-3">
      {tracks.map((track) => (
        <TrackItem key={track.id} track={track} />
      ))}
    </div>
  );
}

export function TrackList({ tracks, isLoading }: TrackListProps) {
  const viewState = getViewState({ tracks, isLoading });

  function renderContent() {
    switch (viewState.status) {
      case "loading":
        return <LoadingState />;
      case "empty":
        return <EmptyState />;
      case "ready":
        return <ReadyState tracks={viewState.tracks} />;
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <h3 className="text-xl font-semibold text-muted-foreground">추천 트랙</h3>
      {renderContent()}
    </div>
  );
}
