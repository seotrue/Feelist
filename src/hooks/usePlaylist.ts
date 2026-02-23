import { useMutation } from "@tanstack/react-query";
import { MoodAnalysis, Playlist } from "@/types";
import { apiRequest, HttpError } from "@/lib/api/httpClient";

/**
 * 플레이리스트 생성 API 응답 타입
 */
type PlaylistResponse = {
  playlist: Playlist;
  spotifyPlaylistId: string;
};

/**
 * 타입 가드: CreatePlaylistResponse 검증
 */
function isCreatePlaylistResponse(
  value: unknown
): value is PlaylistResponse {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;

  // playlist 객체 검증
  if (typeof record.playlist !== "object" || record.playlist === null) {
    return false;
  }

  const playlist = record.playlist as Record<string, unknown>;

  return (
    typeof playlist.id === "string" &&
    typeof playlist.name === "string" &&
    Array.isArray(playlist.tracks) &&
    typeof record.spotifyPlaylistId === "string"
  );
}

/**
 * 플레이리스트 생성 API 호출 함수
 */
async function postCreatePlaylist(params: {
  analysis: MoodAnalysis;
  signal?: AbortSignal;
}): Promise<Playlist> {
  const { analysis, signal } = params;

  const json = await apiRequest<PlaylistResponse>({
    url: "/api/playlist",
    method: "POST",
    body: { analysis },
    signal,
  });

  if (!isCreatePlaylistResponse(json)) {
    throw new Error("Playlist API 응답 형식이 예상과 다릅니다.");
  }

  return json.playlist;
}

/**
 * MoodAnalysis로 Spotify 플레이리스트 생성하는 mutation 훅
 *
 * @example
 * const { mutate, data, isPending } = useCreatePlaylist();
 * mutate(analysis);
 */
export function useCreatePlaylist() {
  return useMutation<
    Playlist,
    Error,
    { analysis: MoodAnalysis;}
  >({
    mutationFn: async ({ analysis }) => {
      return postCreatePlaylist({ analysis });
    },
    onSuccess: (playlist) => {
      console.log("플레이리스트 생성 성공:", playlist);
    },
    onError: (error) => {
      if (error instanceof HttpError) {
        console.error("플레이리스트 생성 실패:", {
          status: error.status,
          statusText: error.statusText,
          errorCode: error.errorCode,
          requestId: error.requestId,
          responseBodyText: error.responseBodyText,
        });
        return;
      }
      console.error("플레이리스트 생성 실패:", error);
    },
  });
}
