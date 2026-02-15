/**
 * 🎯 스토리북 연습 파일
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "./button";
import { expect, userEvent, within } from "storybook/test";

// ① Meta 설정
const meta: Meta<typeof Button> = {
    
    title:"Practice/Button",
    component:Button,
    parameters:{
        layout:"fullscreen",
    },
    tags:["autodocs"],
};

// ② export default meta
export default meta;
// ③ type Story
type Story = StoryObj<typeof Button>;

// ④ args 방식 스토리
export const ArgsStory: Story = {
    args:{
        children:"Button",
    },
};

// ④ args 방식 스토리

// ⑤ render 방식 스토리 (버튼 여러 개)
// const RenderStory: Story = {
//     render:()=>(
//         <div className="flex flex-wrap gap-3">
//             <Button>Button</Button>
//             <Button>Button</Button>
//             </div>
//         )
//     },
// };

// ⑥ useState 활용 — 좋아요 토글 버튼
// 1. 컴포넌트 함수를 따로 선언 (useState 쓰려면 함수로 빼야 함)
function LikeButtonStory() {
    const [liked, setLiked] = useState(false);
  
    return (
      <Button onClick={() => setLiked(!liked)}>
        {liked ? "좋아요 취소" : "좋아요"}
      </Button>
    );
  }
  
  // 2. 스토리에서 render로 연결
  export const LikeButton: Story = {
    render: () => <LikeButtonStory />,
  };

// ⑦ play 함수 — 카운터 버튼
//    CounterButtonStory: 클릭할 때마다 숫자가 올라가는 버튼
//    play: 렌더링 확인 → 클릭 → "클릭 횟수: 1" 텍스트 확인
function CounterButtonStory() {
    const [count, setCount] = useState(0);
    return (
        <Button onClick={() => setCount(count + 1)}>
            {count}
        </Button>
    );
}
export const CounterButton: Story = {
    render: () => <CounterButtonStory />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(canvas.getByRole("button"));
        await expect(canvas.getByText("1")).toBeInTheDocument();
    },
};

function CounterButtonStory2() {
    const [count, setCount] = useState(0);
    return (
      <Button onClick={() => setCount((c) => c + 1)}>
        클릭 횟수: {count}
      </Button>
    );
  }
  
  export const Counter: Story = {
    render: () => <CounterButtonStory2 />,
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
  
      // 1. 렌더링 확인
      const btn = canvas.getByRole("button", { name: /클릭 횟수: 0/ });
      await expect(btn).toBeVisible();
  
      // 2. 인터랙션
      await userEvent.click(btn);
  
      // 3. 결과 확인
      await expect(
        canvas.getByRole("button", { name: /클릭 횟수: 1/ })
      ).toBeVisible();
    },
  };