import { useQuery } from '@tanstack/react-query';
import api from '../../shared/api/axiosClient';
import { ENDPOINTS } from '../../shared/api/endpoints';

export function useCustomersQuery() {
  return useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: async () => {
      const response = await api.get(`${ENDPOINTS.customers}?page=1&pageSize=100`);
      return response.data.items;
    },
  });
}