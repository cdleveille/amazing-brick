import { useMutation, useQuery } from "@tanstack/react-query";
import { httpClient } from "@/client/helpers/network";

export const usePostScore = ({
  onSuccess,
}: {
  onSuccess: (res: { highScore: number; existingHighScore: number }) => void;
}) => {
  return useMutation({
    mutationFn: async (body: { player_id: string; score: string; game_mode_name: string }) => {
      const res = await httpClient.post("/api/score", { body });
      const data = await res.json();
      return data;
    },
    onSuccess: res => onSuccess(res),
  });
};

export const useGetLeaderboard = (player_id: string) => {
  return useQuery({
    queryKey: ["leaderboard", player_id],
    queryFn: async () => {
      const res = await httpClient.get(`/api/leaderboard?player_id=${player_id}`, {});
      const data = await res.json();
      return data;
    },
  });
};

export const usePostRating = () => {
  return useMutation({
    mutationFn: async (body: { player_id: string; is_thumbs_up: boolean; comments: string }) => {
      const res = await httpClient.post("/api/rating", { body });
      const data = await res.json();
      return data;
    },
  });
};

export const useGetAnalytics = () => {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await httpClient.get("/api/analytics", {});
      const data = await res.json();
      return data;
    },
  });
};
