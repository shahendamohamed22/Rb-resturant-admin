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
      const itemsResponse = await api.get(ENDPOINTS.menuItems);
      const adminItems = itemsResponse.data ?? []; // MenuItemAdminResponse[] — includes isAvailable

      const branchesResponse = await api.get(ENDPOINTS.branches);
      const firstBranchId = branchesResponse.data[0]?.id;

      let categories = [];
      let labelByKey = {};
      if (firstBranchId) {
        const menuResponse = await api.get(ENDPOINTS.menu(firstBranchId));
        categories = menuResponse.data.map((cat) => ({
          categoryKey: cat.categoryKey,
          labelAr: cat.labelAr,
          labelEn: cat.labelEn,
        }));
        labelByKey = Object.fromEntries(categories.map((c) => [c.categoryKey, c.labelEn]));
      }

      const items = adminItems.map((item) => ({
        ...item,
        categoryLabel: labelByKey[item.categoryKey] || item.categoryKey,
      }));

      return { items, categories, branchId: firstBranchId };
    },
  });
}

// ===== Categories (locally remembered, since there's no GET endpoint) =====
export function useCategoriesQuery() {
  const { data: menuData } = useMenuForAdminQuery(); // same query key, shares the cached request — no extra network call
  return useQuery({
    queryKey: ['adminCategories', menuData?.categories],
    queryFn: () => {
      const fromApi = menuData?.categories ?? [];
      const local = loadLocalCategories();
      const merged = [...fromApi];
      local.forEach((lc) => {
        if (!merged.some((c) => c.categoryKey === lc.categoryKey)) merged.push(lc);
      });
      return merged;
    },
    enabled: !!menuData,
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