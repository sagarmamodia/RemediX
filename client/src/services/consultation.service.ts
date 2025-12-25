import api from './api';
import type { 
  BookConsultationPayload, 
  BookConsultationResponse, 
  Consultation, 
  ConsultationListResponse 
} from '../types';

export const consultationService = {
  bookConsultation: async (payload: BookConsultationPayload) => {
    const response = await api.post<BookConsultationResponse>('/consultation/book', payload);
    return response.data;
  },

  getConsultations: async (): Promise<Consultation[]> => {
    const response = await api.get<ConsultationListResponse>('/consultation/get');
    const list = response.data.data.list || [];
    
    return list.map(item => ({
      _id: item.consultationId,
      doctor: {
        _id: '', 
        name: item.doctorName || 'Unknown Doctor',
        specialization: item.doctorSpecialty || 'General Physician',
        image: item.doctorProfileUrl || ''
      },
      patient: item.patientName ? {
        name: item.patientName,
        image: item.patientProfileUrl || ''
      } : undefined,
      date: item.startTime,
      timeSlot: new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: item.status as any,
      amount: 0
    }));
  }
};
