import api from './api';
import type { PatientProfile } from '../types';

export const patientService = {
  getProfile: async () => {
    const response = await api.get<{ success: boolean; data: PatientProfile }>('/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<PatientProfile>) => {
    const response = await api.patch<{ success: boolean; data: PatientProfile }>('/patient/update', data);
    return response.data;
  }
};
