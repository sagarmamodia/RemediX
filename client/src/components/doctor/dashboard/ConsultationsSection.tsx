import { useEffect, useState } from 'react';
import { Calendar, Video, Clock, User, CheckCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { consultationService } from '../../../services/consultation.service';
import type { Consultation } from '../../../types';

const ConsultationsSection = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

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

  const handleJoinCall = (consultationId: string) => {
    navigate(`/room/${consultationId}`);
  };

  const handleMarkCompleted = async (consultationId: string) => {
    if (window.confirm('Are you sure you want to mark this consultation as completed?')) {
      try {
        await consultationService.markAsCompleted(consultationId);
        setConsultations(prev => prev.map(c => 
          c._id === consultationId ? { ...c, status: 'completed' } : c
        ));
      } catch (err) {
        console.error('Failed to mark as completed:', err);
        alert('Failed to update status');
      }
    }
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
              ? "You have no consultations yet." 
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
                    <User size={24} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-text-main truncate">
                      {consultation.patient?.name || 'Unknown Patient'}
                    </h3>
                    <p className="text-text-muted text-sm mb-2">
                      Patient
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
                    {consultation.symptoms && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 max-w-md">
                        <p className="text-xs font-semibold text-text-muted mb-1">Reported Symptoms:</p>
                        <p className="text-sm text-text-main line-clamp-2">{consultation.symptoms}</p>
                      </div>
                    )}
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
                  {consultation.prescriptionUrl && (
                    <a 
                      href={consultation.prescriptionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                    >
                      <FileText size={16} />
                      View Rx
                    </a>
                  )}
                  {consultation.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                     <button 
                        onClick={() => handleJoinCall(consultation._id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium w-full sm:w-auto"
                     >
                        <Video size={16} />
                        Join Call
                     </button>
                     <button 
                        onClick={() => handleMarkCompleted(consultation._id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium w-full sm:w-auto"
                     >
                        <CheckCircle size={16} />
                        Mark Completed
                     </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultationsSection;
