import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequest, AnalyzeResponse } from "@/types";
import { analyzeMood } from "@/lib/gemini";

/**
 * 에러 응답 타입
 */
interface ErrorResponse {
  error: string;
  details?: string;
}

/**
 * 입력 검증 상수
 */
const VALIDATION = {
  MIN_PROMPT_LENGTH: 2,
  MAX_PROMPT_LENGTH: 500,
} as const;

/**
 * 타입 가드: AnalyzeRequest 검증
 */
function isAnalyzeRequest(value: unknown): value is AnalyzeRequest {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.prompt === "string";
}

/**
 * POST /api/analyze
 * 사용자의 자연어 입력을 Gemini AI로 분석하여 음악 특성을 반환
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
    if (!isAnalyzeRequest(body)) {
      return NextResponse.json<ErrorResponse>(
        { error: "prompt field is required and must be a string" },
        { status: 400 }
      );
    }

    const { prompt } = body;

    // 3. 입력 검증
    const trimmedPrompt = prompt.trim();

    if (trimmedPrompt.length < VALIDATION.MIN_PROMPT_LENGTH) {
      return NextResponse.json<ErrorResponse>(
        {
          error: "Prompt is too short",
          details: `Minimum ${VALIDATION.MIN_PROMPT_LENGTH} characters required`,
        },
        { status: 400 }
      );
    }

    if (trimmedPrompt.length > VALIDATION.MAX_PROMPT_LENGTH) {
      return NextResponse.json<ErrorResponse>(
        {
          error: "Prompt is too long",
          details: `Maximum ${VALIDATION.MAX_PROMPT_LENGTH} characters allowed`,
        },
        { status: 400 }
      );
    }

    // 4. Gemini API 호출
    const analysis = await analyzeMood(trimmedPrompt);

    // 5. 성공 응답
    const response: AnalyzeResponse = { analysis };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    // 6. 에러 로깅 (프로덕션에서는 로깅 서비스로)
    console.error("[API /analyze] Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // 7. 에러 응답
    return NextResponse.json<ErrorResponse>(
      {
        error: "Failed to analyze mood",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
