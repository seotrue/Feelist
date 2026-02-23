import { NextRequest, NextResponse } from "next/server";
import { CreatePlaylistRequest, CreatePlaylistResponse, SpotifyTrack } from "@/types";

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
function isCreatePlaylistRequest(value: unknown): value is CreatePlaylistRequest {
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
    typeof analysis.target_valence === "number"
  );
}

/**
 * 목(Mock) Spotify 트랙 데이터
 * TODO: 실제 Spotify Recommendations API 호출로 교체
 */
const MOCK_TRACKS: SpotifyTrack[] = [
  {
    id: "3n3Ppam7vgaVa1iaRUc9Lp",
    name: "Mr. Blue Sky",
    artists: [{ id: "7d2XFBSW2H8T0m7T7F5yXo", name: "Electric Light Orchestra" }],
    album: {
      id: "1A3nVEWRJ8yvlPzawHI1pQ",
      name: "Out of the Blue",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273a41f7f67e3d2d7bd609cbac2",
          height: 640,
          width: 640,
        },
      ],
    },
    duration_ms: 303000,
    preview_url: "https://p.scdn.co/mp3-preview/c00d9e8d0bc55e08e1546c8e7d5e8e3c1f7c0e1a",
    external_urls: {
      spotify: "https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp",
    },
    uri: "spotify:track:3n3Ppam7vgaVa1iaRUc9Lp",
  },
  {
    id: "5nTtCOCds6I0PHMNtqelas",
    name: "September",
    artists: [{ id: "4QQgXkCYTt3BlENzhyNETg", name: "Earth, Wind & Fire" }],
    album: {
      id: "5FxKjyYq1N4L7xqtlXIqGE",
      name: "The Best of Earth, Wind & Fire Vol. 1",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273f98fab5d61c4b39c55e8d493",
          height: 640,
          width: 640,
        },
      ],
    },
    duration_ms: 215000,
    preview_url: "https://p.scdn.co/mp3-preview/b5bb4f3891a2b1e5e1b5e1c1b5e1c1b5e1c1b5e1",
    external_urls: {
      spotify: "https://open.spotify.com/track/5nTtCOCds6I0PHMNtqelas",
    },
    uri: "spotify:track:5nTtCOCds6I0PHMNtqelas",
  },
  {
    id: "60nZcImufyMA1MKQY3dcCH",
    name: "Here Comes the Sun",
    artists: [{ id: "3WrFJ7ztbogyGnTHbHJFl2", name: "The Beatles" }],
    album: {
      id: "0ETFjACtuP2ADo6LFhL6HN",
      name: "Abbey Road",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25",
          height: 640,
          width: 640,
        },
      ],
    },
    duration_ms: 185000,
    preview_url: "https://p.scdn.co/mp3-preview/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    external_urls: {
      spotify: "https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH",
    },
    uri: "spotify:track:60nZcImufyMA1MKQY3dcCH",
  },
  {
    id: "7qiZfU4dY1lWllzX7mPBI",
    name: "Sweet Child O' Mine",
    artists: [{ id: "3qm84nBOXUEQ2vnTfUTTFC", name: "Guns N' Roses" }],
    album: {
      id: "28yHV3Gdpj0grVzdk3pAr",
      name: "Appetite for Destruction",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b27321ebf49b3292c3f0f575f0f5",
          height: 640,
          width: 640,
        },
      ],
    },
    duration_ms: 356000,
    preview_url: null, // 미리듣기 없는 경우 예시
    external_urls: {
      spotify: "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI",
    },
    uri: "spotify:track:7qiZfU4dY1lWllzX7mPBI",
  },
  {
    id: "0VjIjW4GlUZAMYd2vXMi3b",
    name: "Blinding Lights",
    artists: [{ id: "1Xyo4u8uXC1ZmMpatF05PJ", name: "The Weeknd" }],
    album: {
      id: "4yP0hdKOZPNshxUOjY0cZj",
      name: "After Hours",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
          height: 640,
          width: 640,
        },
      ],
    },
    duration_ms: 200000,
    preview_url: "https://p.scdn.co/mp3-preview/z1y2x3w4v5u6t7s8r9q0p1o2n3m4l5k6j7i8h9g0",
    external_urls: {
      spotify: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b",
    },
    uri: "spotify:track:0VjIjW4GlUZAMYd2vXMi3b",
  },
];

/**
 * POST /api/playlist
 * MoodAnalysis를 받아서 Spotify 플레이리스트 생성 (현재는 목 데이터 반환)
 *
 * TODO: 실제 구현 시
 * 1. Spotify Recommendations API 호출 (analysis 기반 seed)
 * 2. 사용자 Spotify 계정에 플레이리스트 생성
 * 3. 실제 SpotifyTrack[] 반환
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authorization 헤더에서 accessToken 추출
    const authorization = request.headers.get("Authorization");
    const accessToken = authorization?.replace("Bearer ", "");

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
        { error: "analysis field is required" },
        { status: 400 }
      );
    }

    const { analysis } = body;

    // 4. 목 데이터 응답 (실제 Spotify API 호출 전까지 임시)
    console.log("[Mock] Received analysis:", analysis);
    console.log("[Mock] Access token:", accessToken ? "present" : "missing");

    // TODO: 실제 구현
    // const recommendations = await getSpotifyRecommendations(analysis, accessToken);
    // const playlistId = await createSpotifyPlaylist(analysis, recommendations, accessToken);

    const response: CreatePlaylistResponse = {
      playlist: {
        id: `mock-playlist-${Date.now()}`,
        name: analysis.playlist_name,
        description: analysis.description,
        tracks: MOCK_TRACKS,
        analysis,
        createdAt: new Date(),
        spotifyUrl: "https://open.spotify.com/playlist/mock",
      },
      spotifyPlaylistId: "mock-spotify-id",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[API /playlist] Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

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
