import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlaylistCard } from "./PlaylistCard";
import type { Playlist, SpotifyTrack, MoodAnalysis } from "@/types";

// Mock 데이터
const mockTrack: SpotifyTrack = {
  id: "track1",
  name: "Blinding Lights",
  artists: [{ id: "a1", name: "The Weeknd" }],
  album: {
    id: "album1",
    name: "After Hours",
    images: [{ url: "https://via.placeholder.com/300", height: 300, width: 300 }],
  },
  duration_ms: 200040,
  preview_url: "https://p.scdn.co/mp3-preview/...",
  external_urls: { spotify: "https://open.spotify.com/track/1" },
  uri: "spotify:track:1",
};

const mockAnalysis: MoodAnalysis = {
  mood: "calm",
  genres: ["lo-fi", "jazz"],
  target_energy: 0.3,
  target_valence: 0.6,
  target_tempo: 85,
  target_danceability: 0.4,
  keywords: ["rain", "cafe", "coding"],
  playlist_name: "Rainy Cafe Coding",
  description: "비 오는 날 카페에서 코딩할 때 듣기 좋은 잔잔한 플레이리스트",
};

const mockPlaylist: Playlist = {
  id: "playlist1",
  name: "Rainy Cafe Coding",
  description: "비 오는 날 카페에서 코딩할 때 듣기 좋은 잔잔한 플레이리스트",
  tracks: Array.from({ length: 20 }, (_, i) => ({
    ...mockTrack,
    id: `track${i + 1}`,
    duration_ms: 180000 + i * 10000,
  })),
  analysis: mockAnalysis,
  createdAt: new Date(),
  spotifyUrl: "https://open.spotify.com/playlist/example",
};

const meta = {
  title: "Components/PlaylistCard",
  component: PlaylistCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onShare: () => console.log("공유 클릭"),
  },
} satisfies Meta<typeof PlaylistCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    playlist: mockPlaylist,
  },
};

export const WithoutSpotifyUrl: Story = {
  args: {
    playlist: {
      ...mockPlaylist,
      spotifyUrl: undefined,
    },
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    playlist: undefined,
  },
};
