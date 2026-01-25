import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/config/api';
import { HireRequest, PaginatedResponse, UpdateStatusPayload } from '@/types/api';

export const useHireRequests = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['hire-requests', page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({ 
        page: String(page), 
        limit: String(limit) 
      });

      const response = await apiClient.get<PaginatedResponse<HireRequest>>(
        `${API_ROUTES.ADMIN.HIRE_REQUESTS}?${params}`
      );
      return response.data;
    },
  });
};

export const useHireRequest = (id: string) => {
  return useQuery({
    queryKey: ['hire-request', id],
    queryFn: async () => {
      const response = await apiClient.get<HireRequest>(
        API_ROUTES.ADMIN.HIRE_REQUESTS_BY_ID(id)
      );
      return response.data;
    },
    enabled: !!id,
  });
};

export const useUpdateHireStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateStatusPayload }) => {
      const response = await apiClient.patch(
        API_ROUTES.ADMIN.UPDATE_HIRE_STATUS(id),
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hire-requests'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};
