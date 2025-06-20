import apiClient from '@repo/api-client';

export const api = apiClient(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api`);