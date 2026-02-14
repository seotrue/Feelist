import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Link2, Music } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./dialog";
import { Button } from "./button";

const meta: Meta<typeof DialogContent> = {
  title: "UI/Dialog",
  component: DialogContent,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    showCloseButton: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DialogContent>;

// --- Default ---

export const Default: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">다이얼로그 열기</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>플레이리스트 저장</DialogTitle>
          <DialogDescription>
            현재 생성된 플레이리스트를 내 Spotify 계정에 저장합니다. 이 작업은
            되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button variant="gradient">저장하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// --- Without Close Button ---

export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">닫기 버튼 없음</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>처리 중입니다</DialogTitle>
          <DialogDescription>
            Gemini가 분위기를 분석하고 있습니다. 잠시만 기다려 주세요.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">취소</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// --- WithForm ---

function WithFormStory() {
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">폼 다이얼로그 열기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>플레이리스트 이름 설정</DialogTitle>
          <DialogDescription>
            Spotify에 저장될 플레이리스트의 이름과 설명을 입력하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="playlist-name"
              className="text-sm font-medium text-foreground"
            >
              플레이리스트 이름
            </label>
            <input
              id="playlist-name"
              type="text"
              placeholder="나만의 플레이리스트"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-muted px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="playlist-desc"
              className="text-sm font-medium text-foreground"
            >
              설명 (선택)
            </label>
            <textarea
              id="playlist-desc"
              placeholder="이 플레이리스트에 대해 설명해주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>
        <DialogFooter showCloseButton>
          <Button variant="gradient" disabled={!playlistName.trim()}>
            <Music />
            Spotify에 저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const WithForm: Story = {
  render: () => <WithFormStory />,
};

// --- SharePlaylist ---

function SharePlaylistStory() {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://feelist.app/playlist/abc123xyz";

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="gradient">
          <Link2 />
          플레이리스트 공유
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>플레이리스트 공유</DialogTitle>
          <DialogDescription>
            아래 링크를 복사하여 친구들과 이 플레이리스트를 공유하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2">
            <Link2 className="size-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate text-sm text-foreground">
              {shareUrl}
            </span>
          </div>
          <Button
            variant={copied ? "secondary" : "gradient"}
            className="w-full"
            onClick={handleCopy}
          >
            {copied ? "복사됨!" : "링크 복사"}
          </Button>
        </div>
        <DialogFooter>
          <p className="text-xs text-muted-foreground">
            링크를 통해 접속한 사용자는 플레이리스트를 미리보기할 수 있습니다.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const SharePlaylist: Story = {
  render: () => <SharePlaylistStory />,
};
