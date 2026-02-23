import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header } from "./Header";
import type { SpotifyUser } from "@/types";

const mockUser: SpotifyUser = {
  id: "user1",
  display_name: "John Doe",
  email: "john@example.com",
  images: [{ url: "https://via.placeholder.com/100", height: 100, width: 100 }],
};

const meta = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    onLogin: () => console.log("로그인 클릭"),
    onLogout: () => console.log("로그아웃 클릭"),
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

// 비로그인 상태
export const Unauthenticated: Story = {
  args: {
    user: null,
  },
};

// 로그인 상태
export const Authenticated: Story = {
  args: {
    user: mockUser,
  },
};
