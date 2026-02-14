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
  tracks: {
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
