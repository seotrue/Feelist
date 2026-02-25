"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Music, ArrowLeft, ExternalLink } from "lucide-react";
import { useSharedPlaylist } from "@/hooks/usePlaylist";

interface PlaylistData {
  id: string;
  spotifyUrl: string;
  embedUrl: string;
}

type ViewState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: PlaylistData };

function resolveViewState(params: {
  isLoading: boolean;
  error: Error | null;
  data: PlaylistData | undefined;
}): ViewState {
  if (params.isLoading) return { status: "loading" };
  if (params.error) return { status: "error", message: params.error.message };
  if (params.data) return { status: "success", data: params.data };
  return { status: "loading" };
}

function PlaylistPageSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 px-6 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-96 rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
}

function PlaylistPageError({ message }: { message: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-6 px-6 py-12">
      <Card className="w-full max-w-2xl">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-destructive text-center">{message}</p>
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4" />
            홈으로 돌아가기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PlaylistPageSuccess({ data }: { data: PlaylistData }) {
  const router = useRouter();

  const handleOpenSpotify = () => {
    window.open(data.spotifyUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col items-center gap-6 px-6 py-12">
      <Button
        variant="ghost"
        onClick={() => router.push("/")}
        className="self-start mb-2"
      >
        <ArrowLeft className="h-4 w-4" />
        홈으로
      </Button>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted shrink-0">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Feelist 플레이리스트</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenSpotify}
            >
              <ExternalLink className="h-4 w-4" />
              Spotify에서 열기
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <iframe
            src={data.embedUrl}
            width="100%"
            height="380"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-lg"
            title="Spotify 플레이리스트"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function PlaylistPage() {
  const params = useParams();
  const playlistId = params.id as string;

  const { data, isLoading, error } = useSharedPlaylist(playlistId);

  const viewState = resolveViewState({ isLoading, error, data });

  if (viewState.status === "loading") return <PlaylistPageSkeleton />;
  if (viewState.status === "error") return <PlaylistPageError message={viewState.message} />;
  return <PlaylistPageSuccess data={viewState.data} />;
}
