import { apiRequest } from "@/lib/api/httpClient";
import { CreatePlaylistResponse, MoodAnalysis } from "@/types";
import { useMutation } from "@tanstack/react-query";


const createPlaylist = async (analysis: MoodAnalysis) => {
  // 공통 api 함수 사용 (accessToken은 httpClient에서 자동으로 처리)
  const response = await apiRequest<CreatePlaylistResponse>({
    url: "/api/playlist",
    method: "POST",
    body: { analysis },
  });
  return response;
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