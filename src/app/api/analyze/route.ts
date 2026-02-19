import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequest, AnalyzeResponse } from "@/types";
import { analyzeMood } from "@/lib/gemini";

/**
 * POST /api/analyze
 * 사용자의 자연어 입력을 Gemini AI로 분석하여 음악 특성을 반환
 */
export async function POST(request: NextRequest) {
  try{
    // 1. 요청 바디에서 prompt 추출(바디 파싱)
    const body: AnalyzeRequest = await request.json();
    const { prompt } = body;
    
    // 2. 입력 검증
    if (!prompt || prompt.trim() === "") {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }
    // 3. Gemini API 호출
    const analysis = await analyzeMood(prompt);

    // 4. 응답 반환(응답 생성)
    const response: AnalyzeResponse = { analysis };
    return NextResponse.json(response);

  } catch (error) { 
    return  NextResponse.json({ error: error instanceof Error ? error.message : "Failed to analyze" }, { status: 500 });
  }
}
