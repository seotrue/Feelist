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
      artists: [{ name: "The Weeknd" }],
      album: {
        images: [
          {
            url: "https://i.scdn.co/image/ab67616d0000b2734f3c7f2f6f9f9f9f9f9f9f9f",
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
      artists: [{ name: "BTS" }, { name: "Halsey" }],
      album: {
        images: [
          {
            url: "https://i.scdn.co/image/ab67616d0000b273d642d3c85f5f9f9f9f9f9f9f",
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
      artists: [{ name: "Artist With A Very Long Name That Should Also Truncate" }],
      album: {
        images: [
          {
            url: "https://i.scdn.co/image/ab67616d0000b273e9f9f9f9f9f9f9f9f9f9f9f9",
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
      artists: [{ name: "Unknown Artist" }],
      album: {
        images: [
          {
            url: "https://via.placeholder.com/150/1a1a2e/eee?text=No+Image",
          },
        ],
      },
      preview_url: undefined,
    },
  },
};
