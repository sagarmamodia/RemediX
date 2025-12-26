import { useEffect, useState } from 'react';
import { Calendar, Video, Clock, FileText, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { consultationService } from '../../../services/consultation.service';
import type { Consultation } from '../../../types';
import RescheduleModal from './RescheduleModal';

const ConsultationsSection = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Reschedule State
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const data = await consultationService.getConsultations();
        setConsultations(data);
      } catch (err) {
        setError('Failed to load consultations');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const handleRescheduleClick = (consultation: Consultation) => {
    const consultationTime = new Date(consultation.date).getTime();
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (consultationTime - now < oneHour) {
      alert('Consultations starting in less than 1 hour cannot be rescheduled.');
      return;
    }

    setSelectedConsultation(consultation);
    setRescheduleModalOpen(true);
  };

  const handleRescheduleSuccess = (newDate: string, newTimeSlot: string) => {
    if (!selectedConsultation) return;
    
    setConsultations(prev => prev.map(c => {
      if (c._id === selectedConsultation._id) {
        return {
          ...c,
          date: newDate,
          timeSlot: newTimeSlot
        };
      }
      return c;
    }));
    
    alert('Consultation rescheduled successfully!');
  };

  if (loading) return <div className="p-8 text-center">Loading consultations...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const filteredConsultations = consultations.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-text-main">My Consultations</h2>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredConsultations.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
          <Calendar className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-main">No {filter !== 'all' ? filter : ''} Consultations Found</h3>
          <p className="text-text-muted">
            {filter === 'all' 
              ? "Book your first consultation to get started." 
              : `You have no ${filter} consultations.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredConsultations.map((consultation) => (
            <div key={consultation._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex gap-4 w-full">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg h-fit shrink-0">
                    <Video size={24} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-text-main truncate">
                      {consultation.doctor.name}
                    </h3>
                    <p className="text-text-muted text-sm mb-2 truncate">
                      {consultation.doctor.specialty}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(consultation.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {consultation.timeSlot}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium self-start md:self-end ${
                    consultation.status === 'completed' ? 'bg-green-100 text-green-700' :
                    consultation.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                  </span>
                  {consultation.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <button 
                        onClick={() => navigate(`/room/${consultation._id}`)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full sm:w-auto"
                      >
                        <Video size={16} />
                        Join Call
                      </button>
                      <button 
                        onClick={() => handleRescheduleClick(consultation)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-text-main rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium w-full sm:w-auto"
                      >
                        <RefreshCw size={16} />
                        Reschedule
                      </button>
                    </div>
                  )}
                  {consultation.prescriptionUrl && (
                    <a 
                      href={consultation.prescriptionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium w-full sm:w-auto"
                    >
                      <FileText size={16} />
                      View Prescription
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalOpen && selectedConsultation && (
        <RescheduleModal
          isOpen={rescheduleModalOpen}
          onClose={() => setRescheduleModalOpen(false)}
          consultation={selectedConsultation}
          onSuccess={handleRescheduleSuccess}
        />
      )}
    </div>
  );
};

export default ConsultationsSection;
