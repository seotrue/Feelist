import { apiRequest } from "@/lib/api/httpClient";
import { CreatePlaylistResponse, MoodAnalysis } from "@/types";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";

interface SharedPlaylistData {
  id: string;
  spotifyUrl: string;
  embedUrl: string;
}

const createPlaylist = async (analysis: MoodAnalysis) => {
  const response = await apiRequest<CreatePlaylistResponse>({
    url: "/api/playlist",
    method: "POST",
    body: { analysis },
  });
  return response;
};

const fetchSharedPlaylist = async (playlistId: string): Promise<SharedPlaylistData> => {
  const response = await apiRequest<{ playlist: SharedPlaylistData }>({
    url: `/api/playlist/${playlistId}`,
    method: "GET",
  });
  return response.playlist;
};

export const useCreatePlaylist = () => {
  const { mutate, isPending, isError, error, data:playlistData } = useMutation({
    mutationFn: (analysis: MoodAnalysis) => createPlaylist(analysis),
    onSuccess: (data) => {
      console.log("플레이리스트 생성 성공:", data);
    },
    onError: (error) => {
      console.error("플레이리스트 생성 실패:", error);
    },
  });

  return { mutate, isPending, isError, error , playlistData};
};

export const useSharedPlaylist = (playlistId: string): UseQueryResult<SharedPlaylistData, Error> => {
  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: () => fetchSharedPlaylist(playlistId),
    enabled: !!playlistId,
    staleTime: 1000 * 60 * 5,
  });
};