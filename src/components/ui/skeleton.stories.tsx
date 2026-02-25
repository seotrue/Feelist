import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Skeleton } from "./skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "UI/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

// --- Basic Shapes ---

export const Default: Story = {
  args: {
    className: "h-4 w-[250px]",
  },
};

export const Circle: Story = {
  args: {
    className: "size-12 rounded-full",
  },
};

// --- Feelist Composite Skeletons ---

export const TrackItemSkeleton: Story = {
  render: () => (
    <div className="flex items-center gap-3 w-[320px]">
      <Skeleton className="size-12 rounded-full shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-4 w-[160px]" />
        <Skeleton className="h-3 w-[110px]" />
      </div>
    </div>
  ),
};

export const PlaylistCardSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[240px]">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="flex flex-col gap-2 px-1">
        <Skeleton className="h-4 w-[180px]" />
        <Skeleton className="h-3 w-[120px]" />
        <Skeleton className="h-3 w-[90px]" />
      </div>
    </div>
  ),
};

// --- List Overview ---

export const TrackListSkeleton: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[320px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-12 rounded-full shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-[160px]" />
            <Skeleton className="h-3 w-[110px]" />
          </div>
        </div>
      ))}
    </div>
  ),
};
