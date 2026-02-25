// ============================================================================
// Spotify API Types
// ============================================================================

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  uri: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  external_urls: {
    spotify: string;
  };
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  // 2026년 2월 API 변경: tracks → items
  items?: {
    total: number;
    items: Array<{
      item: SpotifyTrack;
    }>;
  };
  // 하위 호환성을 위해 tracks도 유지 (deprecated)
  tracks?: {
    total: number;
    items: Array<{
      track: SpotifyTrack;
    }>;
  };
  owner: {
    id: string;
    display_name: string;
  };
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
}

export interface SpotifyAuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

/**
 * Spotify Audio Features
 * 트랙의 음악적 특성 분석 데이터
 * @see https://developer.spotify.com/documentation/web-api/reference/get-audio-features
 */
export interface AudioFeatures {
  id: string;
  energy: number;
  valence: number;
  tempo: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
  loudness: number;
  mode: number;
  key: number;
  time_signature: number;
  duration_ms: number;
}

/**
 * Spotify Audio Features
 * 트랙의 음악적 특성 분석 데이터
 * @see https://developer.spotify.com/documentation/web-api/reference/get-audio-features
 */
export interface AudioFeatures {
  id: string; // 트랙 ID
  energy: number; // 0.0 ~ 1.0 (에너지, 격렬함)
  valence: number; // 0.0 ~ 1.0 (긍정성, 밝기)
  tempo: number; // BPM (템포)
  danceability: number; // 0.0 ~ 1.0 (춤추기 적합도)
  acousticness: number; // 0.0 ~ 1.0 (어쿠스틱 정도)
  instrumentalness: number; // 0.0 ~ 1.0 (보컬 없는 정도)
  liveness: number; // 0.0 ~ 1.0 (라이브 녹음 가능성)
  speechiness: number; // 0.0 ~ 1.0 (말하기/랩 정도)
  loudness: number; // dB (음량)
  mode: number; // 0 (minor) or 1 (major)
  key: number; // 0~11 (음계)
  time_signature: number; // 박자 (e.g., 4)
  duration_ms: number; // 길이 (밀리초)
}

// ============================================================================
// Gemini AI Analysis Types
// ============================================================================

export interface MoodAnalysis {
  mood: string; // e.g., "calm", "energetic", "melancholy"
  genres: string[]; // e.g., ["lo-fi", "jazz"]
  target_energy: number; // 0.0 ~ 1.0
  target_valence: number; // 0.0 ~ 1.0 (negativity to positivity)
  target_tempo: number; // BPM
  target_danceability: number; // 0.0 ~ 1.0
  keywords: string[]; // e.g., ["rain", "cafe", "coding"]
  playlist_name: string;
  description: string;
}

// ============================================================================
// Application State Types
// ============================================================================

export interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: SpotifyTrack[];
  analysis: MoodAnalysis;
  createdAt: Date;
  spotifyUrl?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: SpotifyUser | null;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface AnalyzeRequest {
  prompt: string; // 자연어 입력 (e.g., "비 오는 날 카페에서 코딩할 때")
}

export interface AnalyzeResponse {
  analysis: MoodAnalysis;
}

export interface CreatePlaylistRequest {
  analysis: MoodAnalysis;
  accessToken: string;
}

export interface CreatePlaylistResponse {
  playlist: Playlist;
  spotifyPlaylistId: string;
}

// ============================================================================
// UI Component Props Types
// ============================================================================

export interface TrackItemProps {
  track: SpotifyTrack;
  index?: number;
  showPreview?: boolean;
}

export interface MoodTag {
  label: string;
  value: string | number;
  type: "mood" | "genre" | "metric";
}
