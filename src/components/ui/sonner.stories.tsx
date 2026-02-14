import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast, Toaster as SonnerToaster } from "sonner";
import { Button } from "./button";

const meta: Meta = {
  title: "UI/Sonner",
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <>
        <SonnerToaster
          theme="dark"
          position="bottom-right"
          style={
            {
              "--normal-bg": "oklch(0.16 0.01 260)",
              "--normal-text": "oklch(0.92 0.01 260)",
              "--normal-border": "oklch(0.28 0.01 260)",
            } as React.CSSProperties
          }
        />
        <Story />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj;

// --- Default ---

export const Default: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => toast("새로운 알림이 도착했습니다.")}
    >
      토스트 띄우기
    </Button>
  ),
};

// --- Types ---

export const Types: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={() => toast.success("성공적으로 저장되었습니다.")}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error("오류가 발생했습니다.")}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("저장 공간이 부족합니다.")}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info("업데이트가 준비되었습니다.")}
      >
        Info
      </Button>
    </div>
  ),
};

// --- With Description ---

export const WithDescription: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast.message("분석 완료", {
          description: "감정 분석 결과를 바탕으로 플레이리스트를 준비 중입니다.",
        })
      }
    >
      제목 + 설명 토스트
    </Button>
  ),
};

// --- Feelist 맥락 ---

export const PlaylistCreated: Story = {
  render: () => (
    <Button
      variant="gradient"
      onClick={() =>
        toast.success("플레이리스트가 생성되었습니다!", {
          description: "Spotify에서 지금 바로 확인해보세요.",
          duration: 4000,
        })
      }
    >
      플레이리스트 생성
    </Button>
  ),
};
