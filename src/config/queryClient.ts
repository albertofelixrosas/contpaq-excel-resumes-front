import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configuraciones por defecto para queries
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
      retry: (failureCount, error: any) => {
        // No retry en errores 4xx
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Configuraciones por defecto para mutations
      retry: false,
    },
  },
});