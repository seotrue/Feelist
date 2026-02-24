import { NextRequest, NextResponse } from "next/server";
import {
  getRecommendations,
  createPlaylist,
  getCurrentUser,
} from "@/lib/spotify";
import type { MoodAnalysis } from "@/types";

/**
 * 요청 바디 타입
 */
interface CreatePlaylistRequest {
  analysis: MoodAnalysis;
}

/**
 * 성공 응답 타입
 */
interface CreatePlaylistResponse {
  playlist: {
    id: string;
    name: string;
    description: string;
    url: string;
    trackCount: number;
  };
}

/**
 * 에러 응답 타입
 */
interface ErrorResponse {
  error: string;
  details?: string;
}

/**
 * 타입 가드: CreatePlaylistRequest 검증
 */
function isCreatePlaylistRequest(
  value: unknown
): value is CreatePlaylistRequest {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;

  // analysis 객체 검증
  if (typeof record.analysis !== "object" || record.analysis === null) {
    return false;
  }

  const analysis = record.analysis as Record<string, unknown>;

  return (
    typeof analysis.mood === "string" &&
    Array.isArray(analysis.genres) &&
    typeof analysis.target_energy === "number" &&
    typeof analysis.target_valence === "number" &&
    typeof analysis.target_tempo === "number" &&
    typeof analysis.target_danceability === "number" &&
    typeof analysis.playlist_name === "string" &&
    typeof analysis.description === "string"
  );
}

/**
 * POST /api/playlist
 * MoodAnalysis를 받아서 Spotify 추천 트랙 조회 → 플레이리스트 생성
 *
 * Headers:
 *   Authorization: Bearer {access_token}
 *
 * Body:
 *   { analysis: MoodAnalysis }
 *
 * Response:
 *   { playlist: { id, name, description, url, trackCount } }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authorization 헤더에서 accessToken 추출
    const authorization = request.headers.get("Authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json<ErrorResponse>(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }

    const accessToken = authorization.replace("Bearer ", "");

    // 2. JSON 파싱
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    // 3. 타입 검증
    if (!isCreatePlaylistRequest(body)) {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid request body. Required: { analysis: MoodAnalysis }" },
        { status: 400 }
      );
    }

    const { analysis } = body;

    // 4. 현재 사용자 정보 조회 (userId 필요)
    const user = await getCurrentUser(accessToken);

    // 5. Spotify Recommendations API로 트랙 추천받기
    const tracks = await getRecommendations(accessToken, analysis);

    if (tracks.length === 0) {
      return NextResponse.json<ErrorResponse>(
        { error: "No tracks found matching the mood analysis" },
        { status: 404 }
      );
    }

    // 6. 트랙 URIs 추출
    const trackUris = tracks.map((track) => track.uri);

    // 7. Spotify 플레이리스트 생성
    const playlist = await createPlaylist(
      accessToken,
      user.id,
      analysis.playlist_name,
      analysis.description,
      trackUris
    );

    // 8. 성공 응답
    const response: CreatePlaylistResponse = {
      playlist: {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        url: playlist.external_urls.spotify,
        trackCount: playlist.tracks.total,
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    // 에러 로깅
    console.error("[API /playlist] Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // 에러 응답
    return NextResponse.json<ErrorResponse>(
      {
        error: "Failed to create playlist",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
