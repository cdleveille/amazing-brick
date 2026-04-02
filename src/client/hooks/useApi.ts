import { useMutation, useQuery } from "@tanstack/react-query";
import { hc } from "hono/client";

import type { TApi } from "@/server/index";

const apiClient = hc<TApi>("/").api;

export const usePostScore = ({
  onSuccess,
}: {
  onSuccess: (res: { highScore: number; existingHighScore: number }) => void;
}) => {
  return useMutation({
    mutationFn: async (json: { player_id: string; score: string; game_mode_name: string }) => {
      const res = await apiClient.score.$post({ json });
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
      const res = await apiClient.leaderboard.$get({ query: { player_id } });
      const data = await res.json();
      return data;
    },
  });
};

export const usePostRating = () => {
  return useMutation({
    mutationFn: async (json: { player_id: string; is_thumbs_up: boolean; comments: string }) => {
      const res = await apiClient.rating.$post({ json });
      const data = await res.json();
      return data;
    },
  });
};

export const useGetAnalytics = () => {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await apiClient.analytics.$get();
      const data = await res.json();
      return data;
    },
  });
};
