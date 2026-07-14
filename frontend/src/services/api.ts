import axios from 'axios';
import { Transcoder, AbrTemplate, Job, TranscoderLog } from '../types';

const configuredBaseUrl = import.meta.env.VITE_API_URL as string | undefined;
const API_BASE = configuredBaseUrl ? `${configuredBaseUrl}/api` : '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const transcoderApi = {
  getAll: () => api.get<Transcoder[]>('/transcoders').then((response) => response.data),
  getById: (id: string) => api.get<Transcoder>(`/transcoders/${id}`).then((response) => response.data),
  create: (data: Partial<Transcoder>) => api.post<Transcoder>('/transcoders', data).then((response) => response.data),
  update: (id: string, data: Partial<Transcoder>) =>
    api.put<Transcoder>(`/transcoders/${id}`, data).then((response) => response.data),
  delete: (id: string) => api.delete(`/transcoders/${id}`),
  start: (id: string) => api.post(`/transcoders/${id}/start`).then((response) => response.data),
  stop: (id: string) => api.post(`/transcoders/${id}/stop`).then((response) => response.data),
};

export const abrTemplateApi = {
  getAll: () => api.get<AbrTemplate[]>('/abr-templates').then((response) => response.data),
  getById: (id: string) =>
    api.get<AbrTemplate>(`/abr-templates/${id}`).then((response) => response.data),
  create: (data: Partial<AbrTemplate>) =>
    api.post<AbrTemplate>('/abr-templates', data).then((response) => response.data),
  update: (id: string, data: Partial<AbrTemplate>) =>
    api.put<AbrTemplate>(`/abr-templates/${id}`, data).then((response) => response.data),
  delete: (id: string) => api.delete(`/abr-templates/${id}`),
};

export const jobApi = {
  getAll: (transcoderId?: string) => {
    const params = transcoderId ? { transcoderId } : undefined;
    return api.get<Job[]>('/jobs', { params }).then((response) => response.data);
  },
  getById: (id: string) => api.get<Job>(`/jobs/${id}`).then((response) => response.data),
  getLogs: (transcoderId: string) =>
    api.get<TranscoderLog[]>(`/jobs/transcoder/${transcoderId}/logs`).then((response) => response.data),
};
