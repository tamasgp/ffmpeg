import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transcoderApi } from '../services/api';
import { Transcoder } from '../types';

export function useTranscoders() {
  return useQuery({
    queryKey: ['transcoders'],
    queryFn: transcoderApi.getAll,
    refetchInterval: 5000,
  });
}

export function useTranscoder(id: string) {
  return useQuery({
    queryKey: ['transcoders', id],
    queryFn: () => transcoderApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateTranscoder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Transcoder>) => transcoderApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transcoders'] }),
  });
}

export function useUpdateTranscoder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transcoder> }) =>
      transcoderApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transcoders'] }),
  });
}

export function useDeleteTranscoder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transcoderApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transcoders'] }),
  });
}

export function useStartTranscoder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transcoderApi.start(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transcoders'] }),
  });
}

export function useStopTranscoder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transcoderApi.stop(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transcoders'] }),
  });
}
