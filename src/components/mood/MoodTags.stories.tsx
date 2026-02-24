import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MoodTags } from "./MoodTags";

const meta = {
  title: "Components/MoodTags",
  component: MoodTags,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MoodTags>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    analysis: {
      mood: "calm",
      genres: ["lo-fi", "jazz", "ambient"],
      keywords: ["rain", "cafe", "coding"],
    },
  },
};

export const Energetic: Story = {
  args: {
    analysis: {
      mood: "energetic",
      genres: ["pop", "edm", "hip-hop"],
      keywords: ["workout", "motivation", "hype"],
    },
  },
};

export const ManyTags: Story = {
  args: {
    analysis: {
      mood: "melancholy",
      genres: ["indie", "alternative", "shoegaze", "dream pop", "post-rock"],
      keywords: ["night", "alone", "nostalgia", "quiet", "reflection"],
    },
  },
};

export const NoData: Story = {
  args: {
    analysis: undefined,
  },
};
