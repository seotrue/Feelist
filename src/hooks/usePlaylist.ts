import { useMutation } from "@tanstack/react-query";
import { MoodAnalysis, Playlist } from "@/types";

/**
 * 커스텀 HTTP 에러 클래스
 */
class HttpError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly responseBodyText?: string;

  constructor(params: {
    status: number;
    statusText: string;
    responseBodyText?: string;
  }) {
    super(`HTTP ${params.status} ${params.statusText}`);
    this.name = "HttpError";
    this.status = params.status;
    this.statusText = params.statusText;
    this.responseBodyText = params.responseBodyText;
  }
}

/**
 * 타입 가드: CreatePlaylistResponse 검증
 */
function isCreatePlaylistResponse(
  value: unknown
): value is { playlist: Playlist; spotifyPlaylistId: string } {
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
  accessToken?: string;
  signal?: AbortSignal;
}): Promise<Playlist> {
  const { analysis, accessToken, signal } = params;

  const response = await fetch("/api/playlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis, accessToken }),
    signal,
  });

  if (!response.ok) {
    const responseBodyText = await response.text().catch(() => undefined);
    throw new HttpError({
      status: response.status,
      statusText: response.statusText,
      responseBodyText,
    });
  }

  const json: unknown = await response.json();

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
    { analysis: MoodAnalysis; accessToken?: string }
  >({
    mutationFn: async ({ analysis, accessToken }) => {
      return postCreatePlaylist({ analysis, accessToken });
    },
    onSuccess: (playlist) => {
      console.log("플레이리스트 생성 성공:", playlist);
    },
    onError: (error) => {
      if (error instanceof HttpError) {
        console.error("플레이리스트 생성 실패:", {
          status: error.status,
          statusText: error.statusText,
          responseBodyText: error.responseBodyText,
        });
        return;
      }
      console.error("플레이리스트 생성 실패:", error);
    },
  });
}
