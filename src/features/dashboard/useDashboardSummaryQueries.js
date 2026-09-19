import { useQuery } from '@tanstack/react-query';
import api from '../../shared/api/axiosClient';
import { ENDPOINTS } from '../../shared/api/endpoints';

export function useBranchesCountQuery() {
    return useQuery({
        queryKey: ['adminBranchesSummary'],
        queryFn: async () => {
            const response = await api.get(ENDPOINTS.branches);
            return response.data.length;
        },
    });
}

export function useDriversCountQuery() {
    return useQuery({
        queryKey: ['adminDriversSummary'],
        queryFn: async () => {
            const response = await api.get(ENDPOINTS.drivers);
            const items = response.data.items ?? response.data;
            return {
                total: response.data.totalCount ?? items.length,
                active: items.filter((d) => d.isActive).length,
            };
        },
    });
}

export function useMenuItemsCountQuery() {
    return useQuery({
        queryKey: ['adminMenuItemsSummary'],
        queryFn: async () => {
            try {
                const branchesResponse = await api.get(ENDPOINTS.branches);
                const firstBranchId = branchesResponse.data[0]?.id;
                if (!firstBranchId) return 0;
                const response = await api.get(ENDPOINTS.menu(firstBranchId));
                const categories = response.data;
                return categories.reduce((sum, cat) => sum + (cat.items?.length ?? 0), 0);
            } catch (err) {
                console.error('MENU ITEMS COUNT ERROR:', err);
                throw err;
            }
        },
    });
}

export function useReviewsSummaryQuery() {
    return useQuery({
        queryKey: ['adminReviewsSummary'],
        queryFn: async () => {
            const response = await api.get(ENDPOINTS.reviews);
            const items = response.data.items ?? response.data;
            return items.length
                ? (items.reduce((s, r) => s + r.rating, 0) / items.length).toFixed(1)
                : '—';
        },
    });
}