import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/config/api';
import { ServiceInquiry, PaginatedResponse, UpdateStatusPayload, InquiryStatus } from '@/types/api';

export const useInquiries = (page = 1, limit = 10, status?: InquiryStatus) => {
  return useQuery({
    queryKey: ['inquiries', page, limit, status],
    queryFn: async () => {
      const params = new URLSearchParams({ 
        page: String(page), 
        limit: String(limit) 
      });
      if (status) params.append('status', status);

      const response = await apiClient.get<PaginatedResponse<ServiceInquiry>>(
        `${API_ROUTES.ADMIN.INQUIRIES}?${params}`
      );
      return response.data;
    },
  });
};

export const useInquiry = (id: string) => {
  return useQuery({
    queryKey: ['inquiry', id],
    queryFn: async () => {
      const response = await apiClient.get<ServiceInquiry>(
        API_ROUTES.ADMIN.INQUIRIES_BY_ID(id)
      );
      return response.data;
    },
    enabled: !!id,
  });
};

export const useUpdateInquiryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateStatusPayload }) => {
      const response = await apiClient.patch(
        API_ROUTES.ADMIN.UPDATE_INQUIRY_STATUS(id),
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

export const useExportInquiries = () => {
  return useMutation({
    mutationFn: async (status?: InquiryStatus) => {
      const params = new URLSearchParams();
      if (status) params.append('status', status);

      const response = await apiClient.get(
        `${API_ROUTES.ADMIN.INQUIRIES_EXPORT}?${params}`,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inquiries-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
};
