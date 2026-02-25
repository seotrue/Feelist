import { MoodAnalysis } from "@/types";

/**
 * Spotify가 지원하는 유효한 장르 목록
 * @see https://developer.spotify.com/documentation/web-api/reference/get-recommendation-genres
 */
const SPOTIFY_VALID_GENRES = [
  "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime",
  "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "chill",
  "classical", "club", "country", "dance", "dancehall", "deep-house",
  "disco", "drum-and-bass", "dubstep", "edm", "electro", "electronic",
  "emo", "folk", "french", "funk", "garage", "gospel", "groove", "grunge",
  "guitar", "happy", "hard-rock", "hardcore", "heavy-metal", "hip-hop",
  "house", "idm", "indie", "indie-pop", "industrial", "j-pop", "jazz",
  "k-pop", "latin", "metal", "minimal-techno", "new-age", "opera", "party",
  "piano", "pop", "post-dubstep", "progressive-house", "psych-rock", "punk",
  "punk-rock", "r-n-b", "reggae", "reggaeton", "rock", "rockabilly", "sad",
  "salsa", "samba", "show-tunes", "singer-songwriter", "ska", "sleep",
  "soul", "soundtracks", "study", "summer", "synth-pop", "techno", "trance",
  "trip-hop", "work-out", "world-music",
] as const;

/**
 * Gemini AI에게 전달할 시스템 프롬프트
 * 사용자의 자연어 입력을 음악 특성으로 변환하는 구조화된 JSON을 생성
 */
export function createAnalysisPrompt(userInput: string): string {
  return `You are a music mood analyzer. Analyze the following user input and convert it into structured music characteristics.

User Input: "${userInput}"

Generate a JSON response with the following structure:
{
  "mood": "calm | energetic | melancholy | happy | romantic | focused | relaxed | intense",
  "genres": ["genre1", "genre2"],
  "target_energy": 0.0-1.0,
  "target_valence": 0.0-1.0,
  "target_tempo": 60-180,
  "target_danceability": 0.0-1.0,
  "keywords": ["keyword1", "keyword2"],
  "playlist_name": "Creative playlist name",
  "description": "Playlist description in Korean"
}

Guidelines:
- **mood**: Overall emotional tone (choose one that best fits)
- **genres**: Select 1-3 genres from this EXACT list (use ONLY these genre names):
  acoustic, afrobeat, alt-rock, alternative, ambient, anime, bluegrass, blues,
  bossanova, brazil, breakbeat, chill, classical, club, country, dance, dancehall,
  deep-house, disco, drum-and-bass, dubstep, edm, electro, electronic, emo, folk,
  french, funk, garage, gospel, groove, grunge, guitar, happy, hard-rock, hardcore,
  heavy-metal, hip-hop, house, idm, indie, indie-pop, industrial, j-pop, jazz,
  k-pop, latin, metal, minimal-techno, new-age, opera, party, piano, pop,
  post-dubstep, progressive-house, psych-rock, punk, punk-rock, r-n-b, reggae,
  reggaeton, rock, rockabilly, sad, salsa, samba, show-tunes, singer-songwriter,
  ska, sleep, soul, soundtracks, study, summer, synth-pop, techno, trance,
  trip-hop, work-out, world-music

  IMPORTANT: Use ONLY genres from above. For "traditional" music → use "folk" or "world-music"
- **target_energy**: 0.0 (calm/relaxed) to 1.0 (energetic/intense)
- **target_valence**: 0.0 (sad/melancholic) to 1.0 (happy/cheerful)
- **target_tempo**: Beats per minute (60=slow, 120=moderate, 180=fast)
- **target_danceability**: 0.0 (not danceable) to 1.0 (very danceable)
- **keywords**: Extract 2-5 key concepts from user input
- **playlist_name**: Creative, memorable name reflecting the mood (in Korean or English)
- **description**: Short description of when/where to listen (in Korean)

Return ONLY the JSON object, without markdown code blocks or additional text.`;
}

/**
 * 분석 결과를 검증하고 기본값을 적용
 */
export function validateAnalysis(data: unknown): MoodAnalysis {
  const DEFAULT_ANALYSIS: MoodAnalysis = {
    mood: "calm",
    genres: ["pop", "indie"],
    target_energy: 0.5,
    target_valence: 0.5,
    target_tempo: 100,
    target_danceability: 0.5,
    keywords: [],
    playlist_name: "나만의 플레이리스트",
    description: "당신을 위한 특별한 플레이리스트",
  };

  if (typeof data !== "object" || data === null) {
    return DEFAULT_ANALYSIS;
  }

  const analysis = data as Partial<MoodAnalysis>;

  // 장르 필터링: Spotify가 지원하는 장르만 사용
  const validGenres = Array.isArray(analysis.genres)
    ? analysis.genres
        .filter((genre) => SPOTIFY_VALID_GENRES.includes(genre as any))
        .slice(0, 5) // Spotify recommendations API는 최대 5개
    : [];

  return {
    mood: analysis.mood ?? DEFAULT_ANALYSIS.mood,
    genres: validGenres.length > 0 ? validGenres : DEFAULT_ANALYSIS.genres,
    target_energy: typeof analysis.target_energy === "number"
      ? Math.max(0, Math.min(1, analysis.target_energy))
      : DEFAULT_ANALYSIS.target_energy,
    target_valence: typeof analysis.target_valence === "number"
      ? Math.max(0, Math.min(1, analysis.target_valence))
      : DEFAULT_ANALYSIS.target_valence,
    target_tempo: typeof analysis.target_tempo === "number"
      ? Math.max(60, Math.min(180, analysis.target_tempo))
      : DEFAULT_ANALYSIS.target_tempo,
    target_danceability: typeof analysis.target_danceability === "number"
      ? Math.max(0, Math.min(1, analysis.target_danceability))
      : DEFAULT_ANALYSIS.target_danceability,
    keywords: Array.isArray(analysis.keywords) ? analysis.keywords : DEFAULT_ANALYSIS.keywords,
    playlist_name: analysis.playlist_name ?? DEFAULT_ANALYSIS.playlist_name,
    description: analysis.description ?? DEFAULT_ANALYSIS.description,
  };
}

/**
 * 예시 프리셋 프롬프트들
 */
export const PRESET_PROMPTS = [
  "비 오는 날 카페에서 코딩할 때",
  "새벽 드라이브하면서 듣고 싶은 음악",
  "운동할 때 텐션 올려주는 노래",
  "잠들기 전 차분하게 듣는 음악",
  "친구들이랑 홈파티할 때",
  "집중해서 공부할 때",
  "이별 후 감상에 젖을 때",
  "주말 오후 여유롭게 청소할 때",
] as const;
