import { useQuery } from '@tanstack/react-query';
import { jobApi } from '../services/api';

export function useJobs(transcoderId?: string) {
  return useQuery({
    queryKey: ['jobs', transcoderId],
    queryFn: () => jobApi.getAll(transcoderId),
    refetchInterval: 3000,
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => jobApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useTranscoderLogs(transcoderId: string) {
  return useQuery({
    queryKey: ['logs', transcoderId],
    queryFn: () => jobApi.getLogs(transcoderId),
    refetchInterval: 5000,
    enabled: Boolean(transcoderId),
  });
}
