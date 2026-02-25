import {
  SpotifyAuthTokens,
  SpotifyTrack,
  SpotifyPlaylist,
  SpotifyUser,
  MoodAnalysis,
  AudioFeatures,
} from "@/types";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const SPOTIFY_ACCOUNTS_BASE = "https://accounts.spotify.com";

// ============================================================================
// OAuth PKCE Flow Helpers
// ============================================================================

/**
 * Spotify API 호출 래퍼 (에러 처리 통합)
 */
async function spotifyApiRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const endpoint = url.replace(SPOTIFY_API_BASE, "");
    throw new Error(
      `Spotify API Error (${options.method || "GET"} ${endpoint}): ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`,
    );
  }

  return response.json();
}

/**
 * PKCE Code Verifier 생성 (43-128자의 랜덤 문자열)
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

/**
 * Code Verifier를 SHA-256으로 해싱하여 Code Challenge 생성
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Spotify 인증 URL 생성
 */
export function getAuthorizationUrl(
  clientId: string,
  redirectUri: string,
  codeChallenge: string,
): string {
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    scope: [
      "user-read-private",
      "user-read-email",
      "playlist-modify-public",
      "playlist-modify-private",
    ].join(" "),
    prompt: "consent",
  });

  return `${SPOTIFY_ACCOUNTS_BASE}/authorize?${params.toString()}`;
}

/**
 * Authorization Code를 Access Token으로 교환
 */
export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  clientId: string,
  redirectUri: string,
): Promise<SpotifyAuthTokens> {
  const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE}/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for tokens");
  }

  return response.json();
}

/**
 * Refresh Token으로 새로운 Access Token 발급
 */
export async function refreshAccessToken(
  refreshToken: string,
  clientId: string,
): Promise<SpotifyAuthTokens> {
  const response = await fetch(`${SPOTIFY_ACCOUNTS_BASE}/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  return response.json();
}

// ============================================================================
// Spotify API Calls
// ============================================================================

/**
 * 현재 사용자 프로필 가져오기
 */
export async function getCurrentUser(
  accessToken: string,
): Promise<SpotifyUser> {
  return spotifyApiRequest<SpotifyUser>(`${SPOTIFY_API_BASE}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

/**
 * Spotify Recommendations API로 트랙 추천받기
 */
export async function getRecommendations(
  accessToken: string,
  analysis: MoodAnalysis,
): Promise<SpotifyTrack[]> {
  const params = new URLSearchParams({
    seed_genres: analysis.genres.slice(0, 5).join(","),
    target_energy: analysis.target_energy.toString(),
    target_valence: analysis.target_valence.toString(),
    target_tempo: analysis.target_tempo.toString(),
    target_danceability: analysis.target_danceability.toString(),
    limit: "20",
  });

  const data = await spotifyApiRequest<{ tracks: SpotifyTrack[] }>(
    `${SPOTIFY_API_BASE}/recommendations?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return data.tracks;
}

/**
 * MoodAnalysis를 검색 쿼리로 변환
 * Gemini가 분석한 장르, 무드, 키워드를 조합하여 검색어 생성
 */
export function buildSearchQuery(analysis: MoodAnalysis): string {
  const terms: string[] = [];
  
  // 1. 장르 추가 (최대 3개)
  terms.push(...analysis.genres.slice(0, 3));
  
  // 2. 무드 추가
  if (analysis.mood) {
    terms.push(analysis.mood);
  }
  
  // 3. 키워드 추가 (최대 2개)
  if (analysis.keywords && analysis.keywords.length > 0) {
    terms.push(...analysis.keywords.slice(0, 2));
  }
  
  // 4. "music" 추가하여 음악 트랙 검색 강화
  terms.push("music");
  
  return terms.join(" ");
}

/**
 * Spotify Search API로 트랙 검색
 * 
 * ✅ Development Mode에서 사용 가능
 * Recommendations API의 대체 방법으로, 키워드 기반 검색 수행
 * 
 * @see https://developer.spotify.com/documentation/web-api/reference/search
 */
export async function searchTracks(
  accessToken: string,
  query: string,
  limit?: number,
): Promise<SpotifyTrack[]> {
  const params = new URLSearchParams({
    q: query,
    type: "track",
    market: "KR",
  });

  // Development Mode 제한: limit 최대 10
  // limit 없으면 Spotify 기본값(5개) 사용
  if (limit && limit <= 10) {
    params.append("limit", limit.toString());
  }

  const data = await spotifyApiRequest<{
    tracks: { items: SpotifyTrack[] };
  }>(`${SPOTIFY_API_BASE}/search?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data.tracks.items;
}

/**
 * 여러 트랙의 오디오 특성 가져오기
 * 
 * @see https://developer.spotify.com/documentation/web-api/reference/get-several-audio-features
 */
export async function getAudioFeatures(
  accessToken: string,
  trackIds: string[],
): Promise<AudioFeatures[]> {
  const ids = trackIds.slice(0, 100).join(",");
  
  const data = await spotifyApiRequest<{
    audio_features: AudioFeatures[];
  }>(`${SPOTIFY_API_BASE}/audio-features?ids=${ids}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data.audio_features.filter(f => f !== null);
}

/**
 * 트랙과 목표 특성값 간의 유사도 점수 계산
 */
function calculateSimilarityScore(
  features: AudioFeatures,
  target: MoodAnalysis,
): number {
  const weights = {
    energy: 0.3,
    valence: 0.3,
    tempo: 0.2,
    danceability: 0.2,
  };

  const energyDiff = Math.abs(features.energy - target.target_energy);
  const valenceDiff = Math.abs(features.valence - target.target_valence);
  const danceabilityDiff = Math.abs(features.danceability - target.target_danceability);
  
  const normalizedTempo = (features.tempo - 60) / 120;
  const normalizedTargetTempo = (target.target_tempo - 60) / 120;
  const tempoDiff = Math.abs(normalizedTempo - normalizedTargetTempo);

  const score =
    (1 - energyDiff) * weights.energy +
    (1 - valenceDiff) * weights.valence +
    (1 - tempoDiff) * weights.tempo +
    (1 - danceabilityDiff) * weights.danceability;

  return score;
}

/**
 * MoodAnalysis 기반 트랙 검색 (단순 버전)
 * 
 * Development Mode에서는 Audio Features API도 차단되므로
 * Search API만 사용하여 키워드로 검색한 결과를 바로 반환
 * 
 * Extended Quota Mode 승인 후 Audio Features 기반 정렬 추가 가능
 */
export async function searchTracksByMood(
  accessToken: string,
  analysis: MoodAnalysis,
): Promise<SpotifyTrack[]> {
  const query = buildSearchQuery(analysis);
  console.log("[DEBUG spotify.ts] Search query:", query);
  
  // Development Mode 제한: 최대 10개
  const searchResults = await searchTracks(accessToken, query, 10);
  
  if (searchResults.length === 0) {
    console.log("[DEBUG spotify.ts] No search results found");
    return [];
  }

  console.log("[DEBUG spotify.ts] Found", searchResults.length, "tracks from search");
  console.log("[DEBUG spotify.ts] Returning search results (Audio Features API blocked in Dev Mode)");

  return searchResults;
}

/**
 * 사용자 Spotify 계정에 플레이리스트 생성
 * 
 * 2026년 2월 변경: POST /users/{id}/playlists → POST /me/playlists
 * userId 파라미터는 하위 호환성을 위해 유지하지만 사용하지 않음
 */
export async function createPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  description: string,
  trackUris: string[],
): Promise<SpotifyPlaylist> {
  // 1. 플레이리스트 생성 (새 엔드포인트 사용)
  const playlist = await spotifyApiRequest<SpotifyPlaylist>(
    `${SPOTIFY_API_BASE}/me/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        public: true,
      }),
    },
  );

  // 2. 트랙 추가 (2026년 2월 변경: /tracks → /items)
  if (trackUris.length > 0) {
    await spotifyApiRequest<void>(
      `${SPOTIFY_API_BASE}/playlists/${playlist.id}/items`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: trackUris,
        }),
      },
    );
  }

  return getPlaylist(accessToken, playlist.id);
}

/**
 * 플레이리스트 상세 정보 가져오기
 */
export async function getPlaylist(
  accessToken: string,
  playlistId: string,
): Promise<SpotifyPlaylist> {
  return spotifyApiRequest<SpotifyPlaylist>(
    `${SPOTIFY_API_BASE}/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
}
