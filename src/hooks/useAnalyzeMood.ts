import { useMutation } from "@tanstack/react-query";
import { MoodAnalysis } from "@/types";

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
 * Rate Limit 에러 클래스
 */
export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

/**
 * 타입 가드: AnalyzeResponse 검증
 */
function isAnalyzeResponse(value: unknown): value is { analysis: MoodAnalysis } {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;

  // analysis가 객체인지 확인
  if (typeof record.analysis !== "object" || record.analysis === null) {
    return false;
  }

  const analysis = record.analysis as Record<string, unknown>;

  // MoodAnalysis 필수 필드 검증
  return (
    typeof analysis.mood === "string" &&
    Array.isArray(analysis.genres) &&
    typeof analysis.target_energy === "number" &&
    typeof analysis.target_valence === "number"
  );
}

/**
 * Gemini 분석 API 호출 함수
 */
async function postAnalyzeMood(params: {
  prompt: string;
  signal?: AbortSignal;
}): Promise<MoodAnalysis> {
  const { prompt, signal } = params;

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
    signal,
  });

  if (!response.ok) {
    const responseBodyText = await response.text().catch(() => undefined);
    
    if (response.status === 429) {
      let errorDetails = "오늘 AI 분석 할당량을 모두 사용했습니다.";
      try {
        const errorJson = responseBodyText ? JSON.parse(responseBodyText) : null;
        if (errorJson?.details) {
          errorDetails = errorJson.details;
        }
      } catch {
        // JSON 파싱 실패 시 기본 메시지 사용
      }
      throw new RateLimitError(errorDetails);
    }
    
    throw new HttpError({
      status: response.status,
      statusText: response.statusText,
      responseBodyText,
    });
  }

  const json: unknown = await response.json();

  if (!isAnalyzeResponse(json)) {
    throw new Error("Analyze API 응답 형식이 예상과 다릅니다.");
  }

  return json.analysis;
}

/**
 * Gemini AI로 사용자 입력을 분석하는 mutation 훅
 */
export function useAnalyzeMood() {
  return useMutation<MoodAnalysis, Error, string>({
    mutationFn: async (prompt: string) => {
      return postAnalyzeMood({ prompt });
    },
    onSuccess: (analysis) => {
      console.log("분석 성공:", analysis);
    },
    onError: (error) => {
      if (error instanceof HttpError) {
        console.error("분석 실패:", {
          status: error.status,
          statusText: error.statusText,
          responseBodyText: error.responseBodyText,
        });
        return;
      }
      console.error("분석 실패:", error);
    },
  });
}
