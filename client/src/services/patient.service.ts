import api from './api';
import type { PatientProfile } from '../types';

export const patientService = {
  getProfile: async () => {
    const response = await api.get<{ success: boolean; data: PatientProfile }>('/profile');
    return response.data;
  },
  
  // Add other patient-related API calls here
};
