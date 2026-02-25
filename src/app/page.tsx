"use client";
import { useEffect, useState } from "react";
import { MoodInput } from "@/components/mood/MoodInput";
import { MoodTags } from "@/components/mood/MoodTags";
import { TrackList } from "@/components/playlist/TrackList";
import { PlaylistCard } from "@/components/playlist/PlaylistCard";
import { ShareButton } from "@/components/playlist/ShareButton";
import { useAnalyzeMood, RateLimitError } from "@/hooks/useAnalyzeMood";
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

  const { mutate, data: analysisData, isPending, isError, error, reset } = useAnalyzeMood();
  const { mutate: createPlaylist, isPending: isCreatePlaylistPending, playlistData } = useCreatePlaylist();

  const showQuotaDialog = isError && error instanceof RateLimitError;

  const handleAnalyze = (prompt: string) => {
    if (!isLogin) {
      setShowLoginDialog(true);
      return;
    }
    mutate(prompt);
  };

  const handleLoginClick = () => {
    setShowLoginDialog(false);
    login();
  };

  const handleQuotaDialogClose = () => {
    reset();
  };

  useEffect(() => {
    if (analysisData) {
      createPlaylist(analysisData);
    }
  }, [analysisData, createPlaylist]);

  return (
    <>
      <main className="flex flex-1 flex-col items-center gap-8 px-6 py-12">
        <MoodInput onAnalyze={handleAnalyze} isLoading={isPending} />

        {/* 로딩 중 */}
        {isPending && (
          <p className="text-muted-foreground">AI가 분석 중입니다...</p>
        )}

        {/* 에러 (Rate Limit 제외) */}
        {isError && !(error instanceof RateLimitError) && (
          <p className="text-destructive">
            분석 실패: {error?.message || "알 수 없는 오류"}
          </p>
        )}

        {/* 분석 결과 */}
        {analysisData && <MoodTags analysis={analysisData} />}

        {/* 플레이리스트 카드 */}
        <PlaylistCard
          playlist={playlistData?.playlist}
          isLoading={isCreatePlaylistPending}
        />

        {/* 공유 버튼 - 플레이리스트 생성 후에만 표시 */}
        {playlistData?.spotifyPlaylistId && (
          <ShareButton playlistId={playlistData.spotifyPlaylistId} />
        )}

        {/* 전체 트랙 리스트 - 플레이리스트 생성 후에만 표시 */}
        {playlistData && (
          <TrackList
            tracks={playlistData.playlist.tracks}
            title={`${playlistData.playlist.name}의 전체 트랙`}
          />
        )}
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

      {/* 할당량 초과 다이얼로그 */}
      <Dialog open={showQuotaDialog} onOpenChange={handleQuotaDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>오늘 분석 횟수를 모두 사용했어요</DialogTitle>
            <DialogDescription>
              Gemini AI의 무료 할당량을 모두 사용했습니다. 내일 다시 시도해주세요.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleQuotaDialogClose}>
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
