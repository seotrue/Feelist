import { SpotifyTrack, MoodAnalysis, Playlist } from "@/types";

// ============================================================================
// Mock Spotify Tracks
// ============================================================================

export const MOCK_TRACKS: SpotifyTrack[] = [
  {
    id: "1",
    name: "Rainy Day Coffee",
    artists: [{ id: "a1", name: "Lo-Fi Beats" }],
    album: {
      id: "alb1",
      name: "Cozy Vibes",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902b",
          width: 640,
          height: 640,
        },
      ],
    },
    duration_ms: 180000,
    preview_url: "https://p.scdn.co/mp3-preview/example1",
    external_urls: {
      spotify: "https://open.spotify.com/track/1",
    },
    uri: "spotify:track:1",
  },
  {
    id: "2",
    name: "코딩할 때 듣는 재즈",
    artists: [{ id: "a2", name: "Smooth Jazz Collective" }],
    album: {
      id: "alb2",
      name: "Focus & Flow",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a",
          width: 640,
          height: 640,
        },
      ],
    },
    duration_ms: 240000,
    preview_url: "https://p.scdn.co/mp3-preview/example2",
    external_urls: {
      spotify: "https://open.spotify.com/track/2",
    },
    uri: "spotify:track:2",
  },
  {
    id: "3",
    name: "Midnight Drive",
    artists: [{ id: "a3", name: "Synthwave Dreams" }],
    album: {
      id: "alb3",
      name: "Neon Nights",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273c8b066f70c206551210d902b",
          width: 640,
          height: 640,
        },
      ],
    },
    duration_ms: 210000,
    preview_url: null,
    external_urls: {
      spotify: "https://open.spotify.com/track/3",
    },
    uri: "spotify:track:3",
  },
  {
    id: "4",
    name: "Chill Acoustic Vibes",
    artists: [
      { id: "a4", name: "Indie Folk Band" },
      { id: "a5", name: "Acoustic Studio" },
    ],
    album: {
      id: "alb4",
      name: "Unplugged Sessions",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273f8b066f70c206551210d902b",
          width: 640,
          height: 640,
        },
      ],
    },
    duration_ms: 195000,
    preview_url: "https://p.scdn.co/mp3-preview/example4",
    external_urls: {
      spotify: "https://open.spotify.com/track/4",
    },
    uri: "spotify:track:4",
  },
  {
    id: "5",
    name: "Focus Flow",
    artists: [{ id: "a6", name: "Study Music Project" }],
    album: {
      id: "alb5",
      name: "Deep Concentration",
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273d8b066f70c206551210d902b",
          width: 640,
          height: 640,
        },
      ],
    },
    duration_ms: 220000,
    preview_url: "https://p.scdn.co/mp3-preview/example5",
    external_urls: {
      spotify: "https://open.spotify.com/track/5",
    },
    uri: "spotify:track:5",
  },
];

// ============================================================================
// Mock Mood Analysis
// ============================================================================

export const MOCK_ANALYSIS: MoodAnalysis = {
  mood: "calm",
  genres: ["lo-fi", "jazz", "acoustic"],
  target_energy: 0.3,
  target_valence: 0.6,
  target_tempo: 85,
  target_danceability: 0.4,
  keywords: ["rain", "cafe", "coding"],
  playlist_name: "비 오는 날 카페 코딩",
  description: "비 오는 날 카페에서 코딩할 때 듣기 좋은 잔잔한 플레이리스트",
};

export const MOCK_ANALYSIS_ENERGETIC: MoodAnalysis = {
  mood: "energetic",
  genres: ["pop", "dance", "electronic"],
  target_energy: 0.8,
  target_valence: 0.9,
  target_tempo: 128,
  target_danceability: 0.85,
  keywords: ["workout", "party", "energy"],
  playlist_name: "에너지 폭발 워크아웃",
  description: "운동할 때 텐션을 최고로 올려주는 신나는 플레이리스트",
};

export const MOCK_ANALYSIS_MELANCHOLY: MoodAnalysis = {
  mood: "melancholy",
  genres: ["indie", "folk", "alternative"],
  target_energy: 0.25,
  target_valence: 0.2,
  target_tempo: 70,
  target_danceability: 0.3,
  keywords: ["rain", "alone", "heartbreak"],
  playlist_name: "감성 충만 비 오는 밤",
  description: "이별 후 감상에 젖을 때 듣는 슬픈 노래 모음",
};

// ============================================================================
// Mock Playlists
// ============================================================================

export const MOCK_PLAYLIST: Playlist = {
  id: "mock-playlist-1",
  name: MOCK_ANALYSIS.playlist_name,
  description: MOCK_ANALYSIS.description,
  tracks: MOCK_TRACKS,
  analysis: MOCK_ANALYSIS,
  createdAt: new Date("2024-01-15T10:30:00Z"),
  spotifyUrl: "https://open.spotify.com/playlist/mock-playlist-1",
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * API 호출을 시뮬레이션하는 딜레이 함수
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock API: 자연어 분석
 */
export async function mockAnalyzeMood(
  prompt: string
): Promise<MoodAnalysis> {
  await delay(1500); // API 호출 시뮬레이션

  // 간단한 키워드 매칭으로 분석 결과 선택
  const lowerPrompt = prompt.toLowerCase();

  if (
    lowerPrompt.includes("운동") ||
    lowerPrompt.includes("workout") ||
    lowerPrompt.includes("텐션")
  ) {
    return MOCK_ANALYSIS_ENERGETIC;
  }

  if (
    lowerPrompt.includes("이별") ||
    lowerPrompt.includes("슬픈") ||
    lowerPrompt.includes("heartbreak")
  ) {
    return MOCK_ANALYSIS_MELANCHOLY;
  }

  // 기본값
  return MOCK_ANALYSIS;
}

/**
 * Mock API: 트랙 추천
 */
export async function mockGetRecommendations(
  analysis: MoodAnalysis
): Promise<SpotifyTrack[]> {
  await delay(1200);
  return MOCK_TRACKS;
}

/**
 * Mock API: 플레이리스트 생성
 */
export async function mockCreatePlaylist(
  analysis: MoodAnalysis,
  tracks: SpotifyTrack[]
): Promise<Playlist> {
  await delay(800);

  return {
    id: `mock-${Date.now()}`,
    name: analysis.playlist_name,
    description: analysis.description,
    tracks,
    analysis,
    createdAt: new Date(),
    spotifyUrl: `https://open.spotify.com/playlist/mock-${Date.now()}`,
  };
}
