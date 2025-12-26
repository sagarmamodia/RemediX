import api from './api';
import type { DoctorProfile, DoctorListResponse } from '../types';

export const doctorService = {
  getDoctors: async (filters?: { name?: string; specialty?: string; available?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.specialty) params.append('specialty', filters.specialty);
    if (filters?.available !== undefined) params.append('available', String(filters.available));
    
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
  },

  updateAvailability: async (available: boolean) => {
    const response = await api.post<{ success: boolean }>('/doctor/availability/update', {
      available: String(available)
    });
    return response.data;
  },

  getInstantDoctors: async (specialty: string, slot: [string, string]) => {
    const response = await api.post<DoctorListResponse>('/doctor/instant', {
      specialty,
      slot
    });
    return response.data;
  },

  updateProfile: async (data: Partial<DoctorProfile>) => {
    const response = await api.patch<{ success: boolean; data: DoctorProfile }>('/doctor/update', data);
    return response.data;
  }
};
