import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../shared/api/axiosClient';
import { ENDPOINTS } from '../../shared/api/endpoints';

const CATEGORIES_STORAGE_KEY = 'admin_menu_categories';

function loadLocalCategories() {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCategories(categories) {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
}

// ===== Menu items list (via public /menu, since no admin GET list exists) =====
export function useMenuForAdminQuery() {
  return useQuery({
    queryKey: ['adminMenuList'],
    queryFn: async () => {
      const branchesResponse = await api.get(ENDPOINTS.branches);
      const firstBranchId = branchesResponse.data[0]?.id;
      if (!firstBranchId) return { items: [], branchId: null };

      const response = await api.get(ENDPOINTS.menu(firstBranchId));
      const items = response.data.flatMap((cat) =>
        cat.items.map((item) => ({
          ...item,
          categoryKey: cat.categoryKey,
          categoryLabel: cat.labelEn,
        }))
      );
      return { items, branchId: firstBranchId };
    },
  });
}

// ===== Categories (locally remembered, since there's no GET endpoint) =====
export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['adminCategories'],
    queryFn: async () => loadLocalCategories(),
    initialData: loadLocalCategories(),
  });
}

export function useAddCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ categoryKey, labelAr, labelEn }) => {
      const response = await api.post(ENDPOINTS.menuCategories, { categoryKey, labelAr, labelEn });
      return response.data;
    },
    onSuccess: (data, variables) => {
      const current = loadLocalCategories();
      const updated = [...current, { categoryKey: variables.categoryKey, labelEn: variables.labelEn }];
      saveLocalCategories(updated);
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
    },
  });
}

// ===== Menu item CRUD =====
export function useAddMenuItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post(ENDPOINTS.menuItems, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminMenuList'] }),
  });
}

export function useUpdateMenuItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(ENDPOINTS.menuItemById(id), { id, ...data });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminMenuList'] }),
  });
}

export function useToggleMenuItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.patch(ENDPOINTS.menuItemToggleAvailability(id));
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminMenuList'] }),
  });
}

export function useDeleteMenuItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(ENDPOINTS.menuItemById(id));
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminMenuList'] }),
  });
}

// ===== Image upload / delete =====
export function useUploadMenuItemImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, file }) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post(ENDPOINTS.menuItemImage(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Idempotency-Key': crypto.randomUUID(),
        },
      });
      return { id, ...response.data }; // { id, imageUrl, imageUploadedAt }
    },
    onSuccess: ({ id, imageUrl }) => {
      queryClient.setQueryData(['adminMenuList'], (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item) =>
            item.id === id ? { ...item, imageUrl } : item
          ),
        };
      });
    },
  });
}

export function useDeleteMenuItemImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(ENDPOINTS.menuItemImage(id));
      return { id, ...response.data }; // { id, imageUrl: null }
    },
    onSuccess: ({ id }) => {
      queryClient.setQueryData(['adminMenuList'], (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((item) =>
            item.id === id ? { ...item, imageUrl: null } : item
          ),
        };
      });
    },
  });
}