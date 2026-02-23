import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/spotify";
import type { SpotifyAuthTokens } from "@/types";

/**
 * 에러 응답 타입
 */
interface ErrorResponse {
  error: string;
  details?: string;
}

/**
 * 요청 바디 타입
 */
interface TokenExchangeRequest {
  code: string;
  codeVerifier: string;
}

/**
 * 타입 가드: TokenExchangeRequest 검증
 */
function isTokenExchangeRequest(value: unknown): value is TokenExchangeRequest {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.code === "string" &&
    record.code.length > 0 &&
    typeof record.codeVerifier === "string" &&
    record.codeVerifier.length > 0
  );
}

/**
 * 환경변수 검증
 */
function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

/**
 * POST /api/auth/spotify
 * Spotify Authorization Code → Access Token 교환 (PKCE)
 *
 * body: { code: string, codeVerifier: string }
 * response: SpotifyAuthTokens
 */
export async function POST(request: NextRequest) {
  try {
    // 1. JSON 파싱
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    // 2. 타입 검증
    if (!isTokenExchangeRequest(body)) {
      return NextResponse.json<ErrorResponse>(
        { error: "code and codeVerifier fields are required" },
        { status: 400 }
      );
    }

    const { code, codeVerifier } = body;

    // 3. 환경변수 검증
    const clientId = getEnvOrThrow("SPOTIFY_CLIENT_ID");
    const redirectUri = getEnvOrThrow("NEXT_PUBLIC_REDIRECT_URI");

    // 4. Spotify 토큰 교환
    const tokens = await exchangeCodeForTokens(
      code,
      codeVerifier,
      clientId,
      redirectUri
    );

    // 5. 성공 응답
    return NextResponse.json<SpotifyAuthTokens>(tokens, { status: 200 });
  } catch (error) {
    // 6. 에러 로깅
    console.error("[API /auth/spotify] Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // 7. 에러 응답
    return NextResponse.json<ErrorResponse>(
      {
        error: "Failed to exchange Spotify authorization code",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
