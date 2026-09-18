import { useQuery } from '@tanstack/react-query';
import api from '../../shared/api/axiosClient';
import { ENDPOINTS } from '../../shared/api/endpoints';

export function useOrdersQuery() {
  return useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const response = await api.get(`${ENDPOINTS.orders}?page=1&pageSize=100`);
      return response.data.items;
    },
  });
}