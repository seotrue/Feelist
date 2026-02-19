"use client";
import { Header } from "@/components/Header";
import { MoodInput } from "@/components/MoodInput";
import { MoodTags } from "@/components/MoodTags";
import { TrackList } from "@/components/TrackList";
import { PlaylistCard } from "@/components/PlaylistCard";
import { useAnalyzeMood } from "@/hooks/useAnalyzeMood";

export default function Home() {
  const { mutate, data, isPending, isError, error } = useAnalyzeMood();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-8 px-6 py-12">
        <MoodInput onAnalyze={mutate} isLoading={isPending} />

        {/* 로딩 중 */}
        {isPending && (
          <p className="text-muted-foreground">AI가 분석 중입니다...</p>
        )}

        {/* 에러 */}
        {isError && (
          <p className="text-destructive">
            분석 실패: {error?.message || "알 수 없는 오류"}
          </p>
        )}

        {/* 분석 결과 */}
        {data && <MoodTags analysis={data} />}

        <PlaylistCard />
        <TrackList />
      </main>
    </div>
  );
}
