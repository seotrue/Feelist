import { Badge } from "./ui/badge";

interface MoodTagsProps {
  analysis?: {
    mood: string;
    genres: string[];
    keywords: string[];
  };
}

export function MoodTags({ analysis }: MoodTagsProps) {
  if (!analysis) return null;
  const { mood, genres, keywords } = analysis;

  const tags = [
    ...genres.map((g) => ({ text: g, variant: "secondary" as const })),
    ...keywords.map((k) => ({ text: k, variant: "outline" as const })),
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-muted-foreground">
        분석된 무드
      </h3>
      <div className="flex flex-wrap gap-2">
        <Badge variant="default" className="glow-primary font-semibold">
          {mood}
        </Badge>
        {tags.map(({ text, variant }) => (
          <Badge variant={variant} key={text}>
            {text}
          </Badge>
        ))}
      </div>
    </div>
  );
}
