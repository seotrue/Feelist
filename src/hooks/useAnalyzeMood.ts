import { useMutation } from "@tanstack/react-query";
import { MoodAnalysis } from "@/types";
import { apiRequest, HttpError } from "@/lib/api/httpClient";

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
 * Gemini 분석 API 호출 함수
 */
async function postAnalyzeMood(params: {
  prompt: string;
  signal?: AbortSignal;
}): Promise<MoodAnalysis> {
  const { prompt, signal } = params;

  try {
    const response = await apiRequest<{ analysis: MoodAnalysis }>({
      url: "/api/analyze",
      method: "POST",
      body: { prompt },
      signal,
    });

    return response.analysis;
  } catch (error) {
    if (error instanceof HttpError && error.status === 429) {
      let errorDetails = "오늘 AI 분석 할당량을 모두 사용했습니다.";
      
      if (error.responseBody && typeof error.responseBody === "object") {
        const errorBody = error.responseBody as Record<string, unknown>;
        if (typeof errorBody.details === "string") {
          errorDetails = errorBody.details;
        }
      }
      
      throw new RateLimitError(errorDetails);
    }
    
    throw error;
  }
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
