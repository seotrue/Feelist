import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// --- Basic ---

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JS</AvatarFallback>
    </Avatar>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <AvatarFallback>SC</AvatarFallback>
    </Avatar>
  ),
};

// --- Sizes ---

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
    </div>
  ),
};

// --- With Badge ---

export const WithBadge: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Avatar size="sm">
        <AvatarFallback>JS</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <Avatar size="default">
        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
        <AvatarFallback>SC</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>FL</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    </div>
  ),
};

// --- Group ---

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>FL</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};

// --- Group With Count ---

export const GroupWithCount: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>FL</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+9</AvatarGroupCount>
    </AvatarGroup>
  ),
};
