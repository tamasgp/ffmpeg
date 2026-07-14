import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { abrTemplateApi } from '../services/api';
import { AbrTemplate } from '../types';

export function useAbrTemplates() {
  return useQuery({
    queryKey: ['abr-templates'],
    queryFn: abrTemplateApi.getAll,
  });
}

export function useAbrTemplate(id: string) {
  return useQuery({
    queryKey: ['abr-templates', id],
    queryFn: () => abrTemplateApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateAbrTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AbrTemplate>) => abrTemplateApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['abr-templates'] }),
  });
}

export function useUpdateAbrTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AbrTemplate> }) =>
      abrTemplateApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['abr-templates'] }),
  });
}

export function useDeleteAbrTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => abrTemplateApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['abr-templates'] }),
  });
}
