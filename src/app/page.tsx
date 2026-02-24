"use client";
import { useEffect, useState } from "react";
import { MoodInput } from "@/components/mood/MoodInput";
import { MoodTags } from "@/components/mood/MoodTags";
import { TrackList } from "@/components/playlist/TrackList";
import { PlaylistCard } from "@/components/playlist/PlaylistCard";
import { useAnalyzeMood } from "@/hooks/useAnalyzeMood";
import { useCreatePlaylist } from "@/hooks/usePlaylist";
import { useIsLogin, useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Home() {
  const isLogin = useIsLogin();
  const { login } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const { mutate, data: analysisData, isPending, isError, error } = useAnalyzeMood();
  const { mutate: createPlaylist, isPending: isCreatePlaylistPending, isError: isCreatePlaylistError, error: createPlaylistError, playlistData } = useCreatePlaylist();

  // 분석 요청 핸들러 (로그인 체크)
  const handleAnalyze = (prompt: string) => {
    if (!isLogin) {
      setShowLoginDialog(true);
      return;
    }
    mutate(prompt);
  };

  // 로그인 다이얼로그에서 로그인 버튼 클릭
  const handleLoginClick = () => {
    setShowLoginDialog(false);
    login();
  };

  useEffect(() => {
    if (analysisData) {
      createPlaylist(analysisData);
    }
  }, [analysisData]);

  console.log("createPlaylistError", analysisData);

  return (
    <>
      <main className="flex flex-1 flex-col items-center gap-8 px-6 py-12">
        <MoodInput onAnalyze={handleAnalyze} isLoading={isPending} />

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
        {analysisData && <MoodTags analysis={analysisData} />}

        <PlaylistCard />
        <TrackList />
      </main>

      {/* 로그인 필요 다이얼로그 */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>로그인이 필요합니다</DialogTitle>
            <DialogDescription>
              플레이리스트 생성 기능을 사용하려면 Spotify 계정으로 로그인해주세요.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLoginDialog(false)}
            >
              취소
            </Button>
            <Button variant="gradient" onClick={handleLoginClick}>
              Spotify로 로그인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
