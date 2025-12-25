import api from './api';
import type { ProviderProfile } from '../types';

interface ProviderListResponse {
  success: boolean;
  data: {
    list: ProviderProfile[];
  };
}

export const providerService = {
  getProviders: async (filters?: { name?: string; speciality?: string }) => {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.speciality) params.append('speciality', filters.speciality);
    
    const response = await api.get<ProviderListResponse>(`/provider/list?${params.toString()}`);
    return response.data;
  },

  getProviderDetails: async (id: string) => {
    const response = await api.get<{ success: boolean; data: ProviderProfile }>(`/provider/details/id/${id}`);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<{ success: boolean; data: ProviderProfile }>('/profile');
    return response.data;
  }
};
