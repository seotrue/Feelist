import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShareButton } from "./ShareButton";

const meta = {
  title: "Components/ShareButton",
  component: ShareButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ShareButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    playlistId: "example-playlist-id",
  },
};
