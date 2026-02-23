import { Badge } from "./ui/badge";
import type { MoodAnalysis } from "@/types";

// MoodTags가 필요한 필드만 선택 (실제 API 연결 시 MoodAnalysis 전체 객체를 바로 넘길 수 있음)
type MoodTagsAnalysis = Pick<MoodAnalysis, "mood" | "genres" | "keywords">;

interface MoodTagsProps {
  analysis?: MoodTagsAnalysis;
}

type TagVariant = "secondary" | "outline";

interface Tag {
  text: string;
  variant: TagVariant;
}

// 헬퍼 함수: genres + keywords → Tag 배열로 변환
function buildTags(analysis: MoodTagsAnalysis): Tag[] {
  return [
    ...analysis.genres.map((g): Tag => ({ text: g, variant: "secondary" })),
    ...analysis.keywords.map((k): Tag => ({ text: k, variant: "outline" })),
  ];
}

export function MoodTags({ analysis }: MoodTagsProps) {
  if (!analysis) return null;

  const tags = buildTags(analysis);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-muted-foreground">분석된 무드</h3>
      <div className="flex flex-wrap gap-2">
        <Badge variant="default" className="glow-primary font-semibold">
          {analysis.mood}
        </Badge>
        {tags.map(({ text, variant }) => (
          <Badge key={text} variant={variant}>
            {text}
          </Badge>
        ))}
      </div>
    </div>
  );
}
