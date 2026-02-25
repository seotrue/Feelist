import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Music, Play, Heart, MoreHorizontal, Clock } from "lucide-react";
import { Button } from "./button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "./card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "glass"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// --- Variants ---

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>오늘의 추천 플레이리스트</CardTitle>
        <CardDescription>당신의 기분에 맞게 큐레이션된 트랙 모음</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Gemini가 분석한 감정 데이터를 기반으로 Spotify에서 최적의 트랙을 선별했습니다.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="gradient" size="sm">
          <Play />
          재생 시작
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Glass: Story = {
  render: () => (
    <div className="bg-background p-10 rounded-xl">
      <Card variant="glass" className="w-80">
        <CardHeader>
          <CardTitle>글래스 카드</CardTitle>
          <CardDescription>글래스모피즘 스타일의 카드 variant입니다</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            블러 효과와 반투명 배경으로 레이어드된 UI를 표현합니다.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">더 보기</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>심야 드라이브</CardTitle>
        <CardDescription>늦은 밤 혼자 운전할 때 듣기 좋은 음악</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">24개의 트랙 · 1시간 32분</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="gradient" size="sm">
          <Play />
          재생
        </Button>
        <Button variant="ghost" size="icon-sm">
          <Heart />
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent>
        <p className="text-sm text-muted-foreground">
          지금 기분을 자연어로 입력하면 Feelist가 어울리는 플레이리스트를 추천해드립니다.
        </p>
      </CardContent>
    </Card>
  ),
};

export const PlaylistCard: Story = {
  render: () => (
    <Card className="w-72">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted">
            <Music className="text-primary h-6 w-6" />
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-base">새벽 감성 모음</CardTitle>
            <CardDescription>AI 큐레이션 · 18트랙</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {[
          { title: "Falling", artist: "Harry Styles", duration: "4:00" },
          { title: "Someone Like You", artist: "Adele", duration: "4:45" },
          { title: "The Night We Met", artist: "Lord Huron", duration: "3:28" },
        ].map((track) => (
          <div
            key={track.title}
            className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">{track.title}</span>
              <span className="text-xs text-muted-foreground">{track.artist}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {track.duration}
            </div>
          </div>
        ))}
        <p className="text-xs text-muted-foreground pt-1">+ 15개 트랙 더 보기</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="gradient" size="sm" className="flex-1">
          <Play />
          Spotify에서 재생
        </Button>
        <Button variant="ghost" size="icon-sm">
          <Heart />
        </Button>
      </CardFooter>
    </Card>
  ),
};

// --- All Variants Overview ---

export const AllVariants: Story = {
  render: () => (
    <div className="bg-background flex flex-wrap items-start gap-6 p-10 rounded-xl">
      <Card className="w-64">
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>기본 카드 스타일</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">bg-card + border 기반의 기본 카드입니다.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">확인</Button>
        </CardFooter>
      </Card>

      <Card variant="glass" className="w-64">
        <CardHeader>
          <CardTitle>Glass</CardTitle>
          <CardDescription>글래스모피즘 카드 스타일</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">블러 + 반투명 배경의 glass variant입니다.</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">확인</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};
