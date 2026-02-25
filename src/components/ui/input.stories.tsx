import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Music2, Search } from "lucide-react";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "file"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// --- Basic States ---

export const Default: Story = {
  args: {
    type: "text",
  },
};

export const WithPlaceholder: Story = {
  args: {
    type: "text",
    placeholder: "비 오는 날 카페에서 코딩할 때...",
  },
};

export const Disabled: Story = {
  args: {
    type: "text",
    placeholder: "비활성화된 입력",
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    type: "text",
    defaultValue: "늦은 밤 드라이브, 창문 열고 바람 맞으며",
  },
};

export const FileInput: Story = {
  args: {
    type: "file",
  },
};

// --- Validation States ---

export const Invalid: Story = {
  args: {
    type: "text",
    placeholder: "무드를 입력하세요",
    "aria-invalid": true,
  },
};

// --- Feelist Context ---

export const MoodInput: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">무드 입력 (아이콘 조합)</p>
      <div className="relative">
        <Music2 className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="지금 기분이나 상황을 자유롭게 입력하세요..."
          className="pl-9"
        />
      </div>
      <div className="relative">
        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          type="search"
          placeholder="트랙 또는 아티스트 검색"
          className="pl-9"
        />
      </div>
    </div>
  ),
};

// --- All States Overview ---

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Input type="text" placeholder="기본 입력" />
      <Input type="text" defaultValue="값이 입력된 상태" />
      <Input type="text" placeholder="비활성화" disabled />
      <Input type="text" placeholder="유효하지 않음" aria-invalid />
      <Input type="file" />
    </div>
  ),
};
