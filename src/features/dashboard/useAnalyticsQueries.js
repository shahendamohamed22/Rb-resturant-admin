import { useQuery } from '@tanstack/react-query';
import api from '../../shared/api/axiosClient';
import { ENDPOINTS } from '../../shared/api/endpoints';

export function useAnalyticsOverviewQuery(range = '7d') {
  return useQuery({
    queryKey: ['analyticsOverview', range],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.analyticsOverview(range));
      return response.data;
    },
  });
}

export function useRevenueTrendQuery(days = 7) {
  return useQuery({
    queryKey: ['analyticsRevenueTrend', days],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.analyticsRevenueTrend(days));
      return response.data;
    },
  });
}

export function useOrdersByStatusQuery() {
  return useQuery({
    queryKey: ['analyticsOrdersByStatus'],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.analyticsOrdersByStatus);
      return response.data;
    },
  });
}

export function useOrdersByBranchQuery() {
  return useQuery({
    queryKey: ['analyticsOrdersByBranch'],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.analyticsOrdersByBranch);
      return response.data;
    },
  });
}

export function useTopItemsQuery(limit = 5) {
  return useQuery({
    queryKey: ['analyticsTopItems', limit],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.analyticsTopItems(limit));
      return response.data;
    },
  });
}

export function useDriverPerformanceQuery() {
  return useQuery({
    queryKey: ['analyticsDriverPerformance'],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.analyticsDriverPerformance);
      return response.data;
    },
  });
}

export function useRatingDistributionQuery() {
  return useQuery({
    queryKey: ['analyticsRatingDistribution'],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.analyticsRatingDistribution);
      return response.data;
    },
  });
}