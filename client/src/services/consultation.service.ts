import api from './api';
import type { 
  BookConsultationPayload, 
  BookConsultationResponse, 
  Consultation, 
  ConsultationListResponse,
  JoinConsultationResponse
} from '../types';

export const consultationService = {
  bookConsultation: async (payload: BookConsultationPayload) => {
    const response = await api.post<BookConsultationResponse>('/consultation/book', payload);
    return response.data;
  },

  joinConsultation: async (consultationId: string) => {
    const response = await api.post<JoinConsultationResponse>(`/consultation/join/id/${consultationId}`);
    return response.data;
  },

  markAsCompleted: async (consultationId: string) => {
    const response = await api.post('/consultation/update/complete', { id: consultationId });
    return response.data;
  },

  checkSlotAvailability: async (doctorId: string, slot: [string, string]) => {
    const response = await api.post<{ success: boolean; data: { validSlot?: boolean } }>('/consultation/checkSlot', {
      doctorId,
      slot
    });
    
    // Backend returns { validSlot: true } but frontend expects { available: true }
    return {
      success: response.data.success,
      data: {
        available: response.data.data?.validSlot || false
      }
    };
  },

  getConsultations: async (): Promise<Consultation[]> => {
    const response = await api.get<ConsultationListResponse>('/consultation/get');
    const list = response.data.data.list || [];
    
    return list.map(item => ({
      _id: item.consultationId,
      doctor: {
        _id: item.doctorId || '', 
        name: item.doctorName || 'Unknown Doctor',
        specialty: item.doctorSpecialty || 'General Physician',
        image: item.doctorProfileUrl || ''
      },
      patient: item.patientName ? {
        name: item.patientName,
        image: item.patientProfileUrl || ''
      } : undefined,
      date: item.startTime,
      timeSlot: new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: item.status as any,
      amount: 0,
      prescriptionUrl: item.prescriptionUrl
    }));
  },

  uploadPrescription: async (consultationId: string, file: File) => {
    const formData = new FormData();
    formData.append('consultationId', consultationId);
    formData.append('image', file);

    const response = await api.patch('/consultation/prescription/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  rescheduleConsultation: async (consultationId: string, slot: [string, string]) => {
    const response = await api.patch('/consultation/reschedule', {
      consultationId,
      slot
    });
    return response.data;
  }
};
