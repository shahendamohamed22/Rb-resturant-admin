import { useQuery } from '@tanstack/react-query';
import api from '../../shared/api/axiosClient';
import { ENDPOINTS } from '../../shared/api/endpoints';

export function useDriversQuery() {
  return useQuery({
    queryKey: ['admin', 'drivers'],
    queryFn: async () => {
      const response = await api.get(`${ENDPOINTS.drivers}?page=1&pageSize=100`);
      return response.data.items;
    },
  });
}