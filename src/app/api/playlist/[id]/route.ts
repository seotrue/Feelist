import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/playlist/[id]
 * Spotify 공개 플레이리스트 정보 반환 (Spotify URL과 Embed용 데이터)
 * 
 * Spotify의 공개 플레이리스트는 인증 없이도 Embed로 공유 가능하므로
 * API로 직접 조회하지 않고 Spotify URL과 Embed 정보만 반환
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "플레이리스트 ID가 필요합니다" },
        { status: 400 },
      );
    }

    // Spotify 공개 URL과 Embed URL 생성
    const spotifyUrl = `https://open.spotify.com/playlist/${id}`;
    const embedUrl = `https://open.spotify.com/embed/playlist/${id}`;

    return NextResponse.json({
      playlist: {
        id,
        spotifyUrl,
        embedUrl,
      },
    });
  } catch (error) {
    console.error("GET /api/playlist/[id] error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "플레이리스트 조회 실패",
      },
      { status: 500 },
    );
  }
}
