import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChessApiService } from '../services/chessApi';

export const queryKeys = {
  grandmasters: ['grandmasters'] as const,
  player: (username: string) => ['player', username] as const,
};

export const useGrandmasters = () => {
  return useQuery({
    queryKey: queryKeys.grandmasters,
    queryFn: ChessApiService.getGrandmasters,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const usePlayerProfile = (username: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.player(username!),
    queryFn: () => ChessApiService.getPlayerProfile(username!),
    enabled: !!username,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const usePrefetchPlayerProfile = () => {
  const queryClient = useQueryClient();

  return (username: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.player(username),
      queryFn: () => ChessApiService.getPlayerProfile(username),
      staleTime: 2 * 60 * 1000,
    });
  };
};

export const useInvalidatePlayerData = () => {
  const queryClient = useQueryClient();

  return {
    invalidateGrandmasters: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.grandmasters });
    },
    invalidatePlayer: (username: string) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.player(username) });
    },
  };
};