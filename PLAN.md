# Feelist - AI 플레이리스트 큐레이터 구현 계획

## Context

사용자가 "비 오는 날 카페에서 코딩할 때" 같은 자연어를 입력하면, AI가 분위기를 분석하여 Spotify API로 실제 플레이리스트를 생성하는 서비스.
기존 장르/아티스트 기반 추천과 달리 **상황/감정 기반** 추천이 핵심 차별점.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) + TypeScript |
| 스타일링 | Tailwind CSS v4 |
| 디자인 시스템 | shadcn/ui 기반 커스텀 + Storybook |
| 디자인 무드 | 다크 모던 (Spotify 스타일 다크 배경 + 네온/그라데이션 포인트) |
| 상태관리 | Zustand (전역) + TanStack Query (서버 상태) |
| AI | OpenAI API (GPT-4o-mini) - 자연어 → 음악 특성 매핑 |
| 음악 | Spotify Web API (OAuth 2.0 PKCE) |
| 패키지 매니저 | pnpm |
| 배포 | Vercel |

---

## 프로젝트 구조

```
feelist/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 루트 레이아웃 (폰트, 메타데이터, 다크테마)
│   │   ├── page.tsx                # 메인 페이지 (입력 + 결과)
│   │   ├── globals.css             # Tailwind + 다크 테마 CSS 변수
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── spotify/
│   │   │   │       └── route.ts    # Spotify OAuth 콜백 처리
│   │   │   ├── analyze/
│   │   │   │   └── route.ts        # OpenAI 자연어 분석 API
│   │   │   └── playlist/
│   │   │       └── route.ts        # Spotify 플레이리스트 생성 API
│   │   ├── callback/
│   │   │   └── page.tsx            # Spotify OAuth 리다이렉트 페이지
│   │   └── playlist/
│   │       └── [id]/
│   │           └── page.tsx        # 플레이리스트 상세/공유 페이지
│   ├── components/
│   │   ├── ui/                     # shadcn/ui 기반 디자인 시스템
│   │   │   ├── button.tsx          # + gradient variant
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx            # + glass variant
│   │   │   ├── badge.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── sonner.tsx
│   │   │   └── avatar.tsx
│   │   ├── MoodInput.tsx           # 자연어 입력 컴포넌트
│   │   ├── TrackList.tsx           # 추천 트랙 목록
│   │   ├── TrackItem.tsx           # 개별 트랙 아이템
│   │   ├── PlaylistCard.tsx        # 플레이리스트 카드 (시각화)
│   │   ├── MoodTags.tsx            # 분석된 무드 태그 표시
│   │   ├── SpotifyLoginButton.tsx  # Spotify 로그인 버튼
│   │   ├── ShareButton.tsx         # 공유 버튼
│   │   └── Header.tsx              # 헤더 (로고 + 로그인 상태)
│   ├── lib/
│   │   ├── openai.ts               # OpenAI API 클라이언트
│   │   ├── spotify.ts              # Spotify API 유틸리티
│   │   ├── prompts.ts              # AI 프롬프트 템플릿
│   │   └── utils.ts                # shadcn/ui cn() 유틸리티
│   ├── stores/
│   │   └── usePlayerStore.ts       # Zustand: 인증/플레이리스트 상태
│   ├── hooks/
│   │   ├── useAnalyze.ts           # TanStack Query: 분석 요청
│   │   └── usePlaylist.ts          # TanStack Query: 플레이리스트 생성
│   └── types/
│       └── index.ts                # 타입 정의
├── .storybook/
│   ├── main.ts                     # Storybook 설정
│   └── preview.ts                  # Storybook 프리뷰 (다크 테마 적용)
├── src/**/*.stories.tsx            # Storybook 스토리 파일들
├── .env.example                    # 환경 변수 템플릿
├── components.json                 # shadcn/ui 설정
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 디자인 시스템

### 디자인 토큰 (oklch 기반)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--background` | `oklch(0.12 0.01 260)` | 깊은 남색 배경 |
| `--foreground` | `oklch(0.96 0 0)` | 밝은 텍스트 |
| `--card` | `oklch(0.16 0.01 260)` | 카드 배경 |
| `--primary` | `oklch(0.65 0.28 285)` | 네온 퍼플 포인트 |
| `--secondary` | `oklch(0.78 0.15 195)` | 시안 서브 포인트 |
| `--accent` | `oklch(0.65 0.25 340)` | 네온 핑크 악센트 |
| `--muted` | `oklch(0.22 0.01 260)` | 음소거 배경 |
| `--border` | `oklch(0.28 0.01 260)` | 테두리 |

### 커스텀 유틸리티 클래스

| 클래스 | 효과 |
|--------|------|
| `glow-primary` | 퍼플 글로우 박스 셰도우 |
| `glow-accent` | 핑크 글로우 박스 셰도우 |
| `glass` | 글래스모피즘 (블러 + 반투명) |
| `gradient-primary` | 퍼플→핑크 그라데이션 배경 |
| `gradient-text` | 퍼플→시안 그라데이션 텍스트 |

### shadcn/ui 컴포넌트

| 컴포넌트 | 커스텀 | 용도 |
|----------|--------|------|
| Button | `gradient` variant 추가 | CTA 버튼 |
| Input | 글로우 포커스 효과 | 무드 텍스트 입력 |
| Card | `glass` variant 추가 | 플레이리스트/트랙 카드 |
| Badge | 네온 컬러 적용 | 무드/장르 태그 |
| Skeleton | 기본 | 로딩 상태 |
| Dialog | 기본 | 공유 모달 |
| Sonner | 기본 | 토스트 알림 |
| Avatar | 기본 | 앨범아트/프로필 |

---

## 구현 단계

### 1단계: 프로젝트 초기 설정 ✅
- [x] `pnpm create next-app` (App Router, TypeScript, Tailwind, ESLint)
- [x] shadcn/ui 초기화 + 컴포넌트 추가
- [x] Storybook 설치
- [x] 추가 의존성: `zustand`, `@tanstack/react-query`, `openai`, `sonner`
- [x] `.env.example` 생성

### 2단계: 디자인 시스템 구축 ✅
- [x] `globals.css`: 다크 모던 oklch CSS 변수 + 커스텀 유틸리티
- [x] Button `gradient` variant / Card `glass` variant 추가
- [x] Storybook 다크 테마 프리뷰 설정
- [x] `pnpm build` 성공 확인

### 3단계: 디자인 시스템 스토리 작성
- [ ] 각 ui 컴포넌트별 `.stories.tsx` 작성
- [ ] Variants, sizes, states 문서화
- [ ] 다크 배경에서의 렌더링 확인

### 4단계: 타입 정의 & 공통 모듈
- [ ] `src/types/index.ts`: MoodAnalysis, SpotifyTrack, Playlist 등 타입
- [ ] `src/lib/openai.ts`: OpenAI 클라이언트 초기화
- [ ] `src/lib/spotify.ts`: Spotify API 헬퍼 함수들
- [ ] `src/lib/prompts.ts`: 자연어 → 음악 특성 변환 프롬프트

### 5단계: Spotify OAuth 인증
- [ ] `src/app/api/auth/spotify/route.ts`: 토큰 교환 API 라우트
- [ ] `src/app/callback/page.tsx`: OAuth 리다이렉트 처리
- [ ] `src/stores/usePlayerStore.ts`: 인증 토큰 상태 관리 (Zustand)
- [ ] `src/components/SpotifyLoginButton.tsx`: PKCE 플로우

### 6단계: AI 분석 API
- [ ] `src/app/api/analyze/route.ts`: 자연어 → OpenAI → 음악 특성 JSON
- [ ] Spotify recommendation seed 형태로 변환

### 7단계: 플레이리스트 생성 API
- [ ] `src/app/api/playlist/route.ts`: Spotify Recommendations API 호출
- [ ] 사용자 Spotify 계정에 실제 플레이리스트 생성

### 8단계: 프론트엔드 UI (디자인 시스템 활용)
- [ ] `MoodInput.tsx`: 텍스트 입력 + 예시 프리셋
- [ ] `MoodTags.tsx`: 분석된 무드/특성 태그 시각화
- [ ] `TrackItem.tsx`: 개별 트랙 (앨범아트, 미리듣기)
- [ ] `TrackList.tsx`: 추천 트랙 리스트 (Skeleton 로딩)
- [ ] `PlaylistCard.tsx`: 글래스모피즘 카드
- [ ] `Header.tsx`: 네비게이션 + Spotify 로그인 상태
- [ ] `page.tsx`: 메인 페이지 조합

### 9단계: React Query 훅 & 상태 통합
- [ ] `src/hooks/useAnalyze.ts`: 분석 API mutation 훅
- [ ] `src/hooks/usePlaylist.ts`: 플레이리스트 생성 mutation 훅
- [ ] TanStack Query Provider + Zustand 연동

### 10단계: 공유 기능
- [ ] `src/app/playlist/[id]/page.tsx`: 플레이리스트 공유 페이지
- [ ] `src/components/ShareButton.tsx`: 링크 복사 + SNS 공유
- [ ] OG 메타 태그 (동적 `generateMetadata`)

### 11단계: 비즈니스 컴포넌트 스토리 추가
- [ ] MoodInput, TrackItem, PlaylistCard 스토리 작성
- [ ] 인터랙션 시나리오 문서화

### 12단계: 빌드 & 검증
- [ ] `pnpm build` 프로덕션 빌드 확인
- [ ] `pnpm storybook` 스토리 확인

---

## 핵심 AI 프롬프트 설계

OpenAI에게 보낼 시스템 프롬프트 → 구조화된 JSON 응답:

```json
{
  "mood": "calm | energetic | melancholy | ...",
  "genres": ["lo-fi", "jazz"],
  "target_energy": 0.3,
  "target_valence": 0.6,
  "target_tempo": 85,
  "target_danceability": 0.4,
  "keywords": ["rain", "cafe", "coding"],
  "playlist_name": "Rainy Cafe Coding",
  "description": "비 오는 날 카페에서 코딩할 때 듣기 좋은 잔잔한 플레이리스트"
}
```

Spotify Audio Features와 직접 매핑되도록 설계하여 Recommendations API에 바로 사용 가능.

---

## 환경 변수

```bash
# .env.example
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/callback
OPENAI_API_KEY=
```

---

## 검증 방법

1. `pnpm dev` → 메인 페이지 다크 테마 렌더링 확인
2. `pnpm storybook` → 디자인 시스템 컴포넌트 문서 확인
3. Spotify OAuth 플로우 테스트 (로그인 → 콜백 → 토큰 저장)
4. 자연어 입력 → AI 분석 → 트랙 추천 E2E 확인
5. 플레이리스트 생성 및 공유 기능 확인
6. `pnpm build` 프로덕션 빌드 성공 확인
