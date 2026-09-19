import { useQuery } from '@tanstack/react-query';
import api from '../../shared/api/axiosClient';
import { ENDPOINTS } from '../../shared/api/endpoints';

export function useReviewsQuery() {
  return useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: async () => {
      const response = await api.get(`${ENDPOINTS.reviews}?page=1&pageSize=100`);
      return response.data.items;
    },
  });
}