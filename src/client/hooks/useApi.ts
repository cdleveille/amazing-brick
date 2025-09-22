import { useMutation, useQuery } from "@tanstack/react-query";
import type { Static } from "elysia";

import { apiClient } from "@/client/helpers/network";
import type { apiSchema } from "@/shared/schema";
import type { TOnSuccess } from "@/shared/types";

export const usePostScore = ({
  onSuccess,
}: {
  onSuccess: TOnSuccess<(typeof apiSchema.score.post.response)[200]>;
}) => {
  return useMutation({
    mutationFn: (body: Static<typeof apiSchema.score.post.body>) => {
      return apiClient.http.score.post(body);
    },
    onSuccess: ({ data }) => data && onSuccess(data),
  });
};

export const useGetLeaderboard = (player_id: string) => {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => apiClient.http.leaderboard.get({ query: { player_id } }),
  });
};

export const usePostRating = () => {
  return useMutation({
    mutationFn: (body: Static<typeof apiSchema.rating.post.body>) => {
      return apiClient.http.rating.post(body);
    },
  });
};
