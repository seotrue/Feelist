import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Music, Plus, Play, Loader2 } from "lucide-react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link", "gradient"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// --- Variants ---

export const Default: Story = {
  args: { children: "버튼" },
};

export const Gradient: Story = {
  args: {
    variant: "gradient",
    children: "플레이리스트 생성",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
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

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "삭제",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "링크 버튼",
  },
};

// --- Sizes ---

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="xs">XSmall</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// --- Icon Buttons ---

export const IconSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="icon-xs" variant="ghost"><Play /></Button>
      <Button size="icon-sm" variant="ghost"><Play /></Button>
      <Button size="icon" variant="ghost"><Play /></Button>
      <Button size="icon-lg" variant="ghost"><Play /></Button>
    </div>
  ),
};

// --- With Icon ---

export const WithIcon: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button variant="gradient"><Music />플레이리스트 생성</Button>
      <Button variant="outline"><Plus />추가</Button>
      <Button variant="secondary"><Play />재생</Button>
    </div>
  ),
};

// --- States ---

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button disabled>Default</Button>
      <Button variant="gradient" disabled>Gradient</Button>
      <Button variant="outline" disabled>Outline</Button>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button disabled>
        <Loader2 className="animate-spin" />
        분석 중...
      </Button>
      <Button variant="gradient" disabled>
        <Loader2 className="animate-spin" />
        생성 중...
      </Button>
    </div>
  ),
};

// --- All Variants Overview ---

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="default">Default</Button>
      <Button variant="gradient">Gradient</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};