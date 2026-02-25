import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TrackItem } from "./TrackItem";

const meta = {
  title: "Components/TrackItem",
  component: TrackItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TrackItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    track: {
      id: "1",
      name: "Blinding Lights",
      artists: [{ id: "artist1", name: "The Weeknd" }],
      album: {
        id: "album1",
        name: "After Hours",
        images: [
          {
            url: "https://i.scdn.co/image/ab67616d0000b2734f3c7f2f6f9f9f9f9f9f9f9f",
            height: 640,
            width: 640,
          },
        ],
      },
      preview_url: "https://p.scdn.co/mp3-preview/...",
    },
  },
};

export const MultipleArtists: Story = {
  args: {
    track: {
      id: "2",
      name: "Boy With Luv (feat. Halsey)",
      artists: [{ id: "artist2", name: "BTS" }, { id: "artist3", name: "Halsey" }],
      album: {
        id: "album2",
        name: "Map of the Soul: Persona",
        images: [
          {
            url: "https://i.scdn.co/image/ab67616d0000b273d642d3c85f5f9f9f9f9f9f9f",
            height: 640,
            width: 640,
          },
        ],
      },
      preview_url: "https://p.scdn.co/mp3-preview/...",
    },
  },
};

export const LongTitle: Story = {
  args: {
    track: {
      id: "3",
      name: "This Is A Very Long Song Title That Should Be Truncated With Ellipsis",
      artists: [{ id: "artist4", name: "Artist With A Very Long Name That Should Also Truncate" }],
      album: {
        id: "album3",
        name: "Long Album Name",
        images: [
          {
            url: "https://i.scdn.co/image/ab67616d0000b273e9f9f9f9f9f9f9f9f9f9f9f9",
            height: 640,
            width: 640,
          },
        ],
      },
    },
  },
};

export const NoPreview: Story = {
  args: {
    track: {
      id: "4",
      name: "Song Without Preview",
      artists: [{ id: "artist5", name: "Unknown Artist" }],
      album: {
        id: "album4",
        name: "Unknown Album",
        images: [
          {
            url: "https://via.placeholder.com/150/1a1a2e/eee?text=No+Image",
            height: 640,
            width: 640,
          },
        ],
      },
      preview_url: undefined,
    },
  },
};
