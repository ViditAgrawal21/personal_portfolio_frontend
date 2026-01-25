import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/config/api';
import { StatsResponse } from '@/types/api';

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await apiClient.get<StatsResponse>(
        API_ROUTES.ADMIN.STATS
      );
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
