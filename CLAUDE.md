# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Feelist는 AI 기반 플레이리스트 큐레이터 서비스입니다.
사용자가 자연어로 상황/감정을 입력하면, Google Gemini가 분위기를 분석하고 Spotify API로 실제 플레이리스트를 생성합니다.

## 주요 명령어

```bash
pnpm dev              # 개발 서버 (http://localhost:3000)
pnpm build            # 프로덕션 빌드
pnpm lint             # ESLint 실행 (flat config, ESLint 9)
pnpm storybook        # Storybook (http://localhost:6006)
pnpm build-storybook  # Storybook 정적 빌드
```

## 기술 스택

- **Framework**: Next.js 16 (App Router) + TypeScript (strict) + React 19
- **스타일링**: Tailwind CSS v4 (oklch 컬러 시스템, `@theme inline` in globals.css)
- **디자인 시스템**: shadcn/ui (new-york 스타일) + Storybook 10 (@storybook/nextjs-vite)
- **상태관리**: Zustand 5 (전역) + TanStack Query 5 (서버 상태)
- **AI**: Google Gemini API (gemini-2.0-flash, 무료 tier)
- **음악**: Spotify Web API (OAuth 2.0 PKCE)
- **테스트**: Vitest + Playwright (브라우저 테스트)
- **패키지 매니저**: pnpm
- **아이콘**: lucide-react

## 아키텍처

### 프로젝트 구조
```
src/
├── app/              # Next.js App Router 페이지 & API 라우트
│   ├── api/          # 서버 API (analyze, playlist, auth)
│   ├── callback/     # Spotify OAuth 콜백
│   └── playlist/     # 플레이리스트 공유 페이지
├── components/
│   ├── ui/           # shadcn/ui 기반 디자인 시스템 컴포넌트
│   └── *.tsx         # 비즈니스 컴포넌트 (MoodInput, TrackList 등)
├── lib/              # 유틸리티 (gemini, spotify, prompts, utils)
├── stores/           # Zustand 스토어
├── hooks/            # TanStack Query 커스텀 훅
└── types/            # TypeScript 타입 정의
```

### 핵심 데이터 흐름
자연어 입력 → Gemini API (감정/음악 특성 분석) → Spotify Recommendations API (트랙 검색) → 플레이리스트 생성

### Tailwind v4 설정
- `tailwind.config.ts` 파일 없음 — `src/app/globals.css`에서 `@theme inline`으로 디자인 토큰 정의
- PostCSS 플러그인으로 동작 (`postcss.config.mjs`)

### 상태 관리 패턴
- 전역 상태 (인증, 플레이리스트): Zustand (`src/stores/`)
- 서버 상태 (API 호출): TanStack Query (`src/hooks/`)

## 코딩 컨벤션

- TypeScript strict 모드, 경로 별칭 `@/*` → `./src/*`
- React Server Components 기본, 클라이언트 필요 시 `"use client"` 명시
- 함수 컴포넌트는 `function` 선언 사용 (shadcn/ui 패턴 준수)
- `cn()` 유틸리티로 클래스명 병합 (`@/lib/utils` — clsx + tailwind-merge)
- shadcn/ui 추가: `pnpm dlx shadcn@latest add <component>`
- API 라우트: Next.js Route Handlers (`app/api/*/route.ts`)

## 디자인 시스템

### 테마
- 다크 테마 전용 (루트 레이아웃에서 `dark` 클래스 강제 적용)
- oklch 컬러 스페이스: 깊은 남색 배경 + 네온 퍼플/시안/핑크 포인트

### 커스텀 컴포넌트 변형
- `Button` variant `"gradient"`: 퍼플→핑크 그라데이션 + 글로우
- `Card` variant `"glass"`: 글래스모피즘 (블러 + 반투명)

### 커스텀 유틸리티 클래스
- `glass`: 글래스모피즘 효과
- `glow-primary` / `glow-accent`: 퍼플/핑크 글로우 박스 셰도우
- `gradient-primary`: 퍼플→핑크 그라데이션 배경
- `gradient-text`: 퍼플→시안 그라데이션 텍스트

### Storybook
- 스토리 파일: `src/**/*.stories.tsx`
- 다크 테마 기본 적용, `globals.css` import로 디자인 토큰 공유

## 환경 변수

`.env.local`에 저장 (`.env.example` 참고):
```bash
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/callback
GEMINI_API_KEY=
```

## 작업 모드

### 프론트엔드 모드
- 코드 작성은 사용자가 주도한다. **Claude는 코드를 대신 작성하지 않는다.**
- Claude의 역할: 작성된 코드에 대한 리뷰, 피드백, 개선 방향 제시
- **예외**: 사용자가 "직접 짜줘"라고 명시한 경우에만 코드 작성
- 조사/분석 요청 시 서브에이전트나 스킬 적극 활용
- Claude Code의 서브에이전트, 커스텀 커맨드, 스킬 등 기능이 더 효율적인 상황이면 즉시 제안하고 사용한다

## 참고
- 구현 계획 상세: [PLAN.md](./PLAN.md)
