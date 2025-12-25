import api from './api';
import type { DoctorProfile, DoctorListResponse } from '../types';

export const doctorService = {
  getDoctors: async (filters?: { name?: string; specialty?: string }) => {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.specialty) params.append('specialty', filters.specialty);
    
    const response = await api.get<DoctorListResponse>(`/doctor/list?${params.toString()}`);
    return response.data;
  },

  getDoctorDetails: async (id: string) => {
    const response = await api.get<{ success: boolean; data: DoctorProfile }>(`/doctor/details/id/${id}`);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<{ success: boolean; data: DoctorProfile }>('/profile');
    return response.data;
  }
};
