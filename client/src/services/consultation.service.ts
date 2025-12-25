import api from './api';

interface BookConsultationPayload {
  doctorId: string;
  sourceId: string;
}

interface BookConsultationResponse {
  success: boolean;
  data: {
    id: string;
  };
}

export const consultationService = {
  bookConsultation: async (payload: BookConsultationPayload) => {
    const response = await api.post<BookConsultationResponse>('/consultation/book', payload);
    return response.data;
  }
};
