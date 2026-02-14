import { GoogleGenerativeAI } from "@google/generative-ai";
import { MoodAnalysis } from "@/types";
import { createAnalysisPrompt, validateAnalysis } from "./prompts";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Gemini 2.0 Flash 모델 인스턴스
 * 무료 tier에서 빠른 응답 속도 제공
 */
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

/**
 * 자연어 입력을 음악 특성(MoodAnalysis)으로 변환
 * @param userInput 사용자 자연어 입력 (예: "비 오는 날 카페에서 코딩할 때")
 * @returns MoodAnalysis 객체
 */
export async function analyzeMood(userInput: string): Promise<MoodAnalysis> {
  try {
    const prompt = createAnalysisPrompt(userInput);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // JSON 추출 (코드 블록으로 감싸진 경우 처리)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Gemini response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return validateAnalysis(parsed);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to analyze mood"
    );
  }
}

/**
 * Spotify Recommendations API를 위한 seed 파라미터 생성
 */
export function convertToSpotifySeeds(analysis: MoodAnalysis) {
  return {
    seed_genres: analysis.genres.slice(0, 5), // 최대 5개
    target_energy: analysis.target_energy,
    target_valence: analysis.target_valence,
    target_tempo: analysis.target_tempo,
    target_danceability: analysis.target_danceability,
    limit: 20, // 추천 트랙 수
  };
}
