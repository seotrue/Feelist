# CLAUDE.md - Feelist 프로젝트 가이드

## 프로젝트 개요

Feelist는 AI 기반 플레이리스트 큐레이터 서비스입니다.
사용자가 자연어로 상황/감정을 입력하면, OpenAI가 분위기를 분석하고 Spotify API로 실제 플레이리스트를 생성합니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router) + TypeScript (strict)
- **스타일링**: Tailwind CSS v4 (oklch 컬러 시스템)
- **디자인 시스템**: shadcn/ui (new-york 스타일) + Storybook 10
- **상태관리**: Zustand 5 (전역) + TanStack Query 5 (서버 상태)
- **AI**: OpenAI API (GPT-4o-mini)
- **음악**: Spotify Web API (OAuth 2.0 PKCE)
- **패키지 매니저**: pnpm
- **아이콘**: lucide-react

## 주요 명령어

```bash
pnpm dev              # 개발 서버 (http://localhost:3000)
pnpm build            # 프로덕션 빌드
pnpm lint             # ESLint 실행
pnpm storybook        # Storybook (http://localhost:6006)
pnpm build-storybook  # Storybook 정적 빌드
```

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router 페이지 & API 라우트
│   ├── api/          # 서버 API (analyze, playlist, auth)
│   ├── callback/     # Spotify OAuth 콜백
│   └── playlist/     # 플레이리스트 공유 페이지
├── components/
│   ├── ui/           # shadcn/ui 기반 디자인 시스템 컴포넌트
│   └── *.tsx         # 비즈니스 컴포넌트 (MoodInput, TrackList 등)
├── lib/              # 유틸리티 (openai, spotify, prompts, utils)
├── stores/           # Zustand 스토어
├── hooks/            # TanStack Query 커스텀 훅
└── types/            # TypeScript 타입 정의
```

## 코딩 컨벤션

### 일반
- 언어: TypeScript strict 모드
- 경로 별칭: `@/*` → `./src/*`
- React Server Components 기본, 클라이언트 필요 시 `"use client"` 명시
- 함수 컴포넌트는 `function` 선언 사용 (shadcn/ui 패턴 준수)

### 스타일링
- Tailwind CSS v4 유틸리티 클래스 사용
- 다크 테마 전용 (항상 `dark` 클래스 적용)
- 컬러는 CSS 변수 기반 (`--primary`, `--secondary`, `--accent` 등)
- 커스텀 유틸리티: `glass`, `glow-primary`, `glow-accent`, `gradient-primary`, `gradient-text`

### 컴포넌트
- shadcn/ui 컴포넌트 위치: `src/components/ui/`
- 비즈니스 컴포넌트 위치: `src/components/`
- `cn()` 유틸리티로 클래스명 병합 (`@/lib/utils`)
- shadcn/ui 추가: `pnpm dlx shadcn@latest add <component>`

### 상태 관리
- 전역 상태 (인증, 플레이리스트): Zustand (`src/stores/`)
- 서버 상태 (API 호출): TanStack Query (`src/hooks/`)

### API 라우트
- Next.js Route Handlers 사용 (`app/api/*/route.ts`)
- 환경 변수는 `.env.local`에 저장 (`.env.example` 참고)

## 디자인 시스템

### 테마
- 다크 모던: 깊은 남색 배경 + 네온 퍼플/시안/핑크 포인트
- oklch 컬러 스페이스 사용

### 커스텀 컴포넌트 변형
- `Button` variant `"gradient"`: 퍼플→핑크 그라데이션 + 글로우
- `Card` variant `"glass"`: 글래스모피즘 (블러 + 반투명)

### Storybook
- 스토리 파일: `src/**/*.stories.tsx`
- 다크 테마 기본 적용
- `globals.css` import로 디자인 토큰 공유

## 환경 변수

```bash
SPOTIFY_CLIENT_ID=          # Spotify 앱 Client ID
SPOTIFY_CLIENT_SECRET=      # Spotify 앱 Client Secret
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=  # 클라이언트 사이드 Spotify ID
NEXT_PUBLIC_REDIRECT_URI=   # OAuth 리다이렉트 URI
OPENAI_API_KEY=             # OpenAI API 키
```

## 참고
- 구현 계획 상세: [PLAN.md](./PLAN.md)
