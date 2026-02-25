import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// --- Variants ---

export const Default: Story = {
  args: { children: "기본" },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "삭제됨",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

// --- Feelist 서비스 맥락 ---

export const MoodTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">잔잔한</Badge>
      <Badge variant="secondary">카페</Badge>
      <Badge variant="secondary">lo-fi</Badge>
      <Badge variant="secondary">재즈</Badge>
      <Badge variant="secondary">집중</Badge>
      <Badge variant="secondary">새벽</Badge>
      <Badge variant="outline">드라이브</Badge>
      <Badge variant="outline">팝</Badge>
      <Badge variant="outline">R&B</Badge>
      <Badge variant="outline">어쿠스틱</Badge>
    </div>
  ),
};

// --- All Variants Overview ---

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
};
