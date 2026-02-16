import {
  SpotifyAuthTokens,
  SpotifyTrack,
  SpotifyPlaylist,
  SpotifyUser,
  MoodAnalysis,
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
 url:string,
 options:RequestInit ={
 }
): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const endpoint = url.replace(SPOTIFY_API_BASE, "");
        throw new Error(`Spotify API Error (${options.method || 'GET'} ${endpoint}): ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`)
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
    ""
  );
}

/**
 * Code Verifier를 SHA-256으로 해싱하여 Code Challenge 생성
 */
export async function generateCodeChallenge(
  verifier: string
): Promise<string> {
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
  codeChallenge: string
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
  redirectUri: string
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
  clientId: string
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
  accessToken: string
): Promise<SpotifyUser> {
  return spotifyApiRequest<SpotifyUser>(
    `${SPOTIFY_API_BASE}/me`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

/**
 * Spotify Recommendations API로 트랙 추천받기
 */
export async function getRecommendations(
  accessToken: string,
  analysis: MoodAnalysis
): Promise<SpotifyTrack[]> {
  const params = new URLSearchParams({
    seed_genres: analysis.genres.slice(0, 5).join(","),
    target_energy: analysis.target_energy.toString(),
    target_valence: analysis.target_valence.toString(),
    target_tempo: analysis.target_tempo.toString(),
    target_danceability: analysis.target_danceability.toString(),
    limit: "20",
  });

  const data = await spotifyApiRequest<{tracks:SpotifyTrack[]}>(
    `${SPOTIFY_API_BASE}/recommendations?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return data.tracks;
}

/**
 * 사용자 Spotify 계정에 플레이리스트 생성
 */
export async function createPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  description: string,
  trackUris: string[]
): Promise<SpotifyPlaylist> {
  // 1. 플레이리스트 생성
  const playlist = await spotifyApiRequest<SpotifyPlaylist>(`${SPOTIFY_API_BASE}/users/${userId}/playlists`,
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
    })

  // 2. 트랙 추가
  if (trackUris.length > 0) {
    await spotifyApiRequest<void>(`${SPOTIFY_API_BASE}/playlists/${playlist.id}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: trackUris,
      }),
    })
    
  }

  return playlist;
}

/**
 * 플레이리스트 상세 정보 가져오기
 */
export async function getPlaylist(
  accessToken: string,
  playlistId: string
): Promise<SpotifyPlaylist> {

  return spotifyApiRequest<SpotifyPlaylist>(`${SPOTIFY_API_BASE}/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
}
