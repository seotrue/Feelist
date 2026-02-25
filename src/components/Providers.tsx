"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * TanStack Query Provider
 * 클라이언트 컴포넌트로 분리하여 layout.tsx에서 사용
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // useState로 QueryClient 생성 (리렌더링 시 재생성 방지)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            refetchOnWindowFocus: false, // 윈도우 포커스 시 리페칭 비활성화
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
