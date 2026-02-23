import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MoodInput } from "./MoodInput";

const meta = {
  title: "Components/MoodInput",
  component: MoodInput,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onAnalyze: (prompt: string) => console.log("분석 요청:", prompt),
  },
} satisfies Meta<typeof MoodInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
