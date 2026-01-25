import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/config/api';
import { useAdminStore } from '@/store/admin-store';
import { AdminUser } from '@/types/api';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAdminAuth = () => {
  const { login: loginStore, logout: logoutStore } = useAdminStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiClient.post<AdminUser>(
        API_ROUTES.ADMIN.LOGIN,
        credentials
      );
      return response.data;
    },
    onSuccess: (data) => {
      loginStore(data.email, data.role, data.token);
    },
  });

  const logout = () => {
    logoutStore();
  };

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    isSuccess: loginMutation.isSuccess,
  };
};
