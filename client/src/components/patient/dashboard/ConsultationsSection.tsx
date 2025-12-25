import React, { useEffect, useState } from 'react';
import { Calendar, Video, Clock } from 'lucide-react';
import { consultationService } from '../../../services/consultation.service';
import type { Consultation } from '../../../types';

const ConsultationsSection = () => {
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
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg h-fit">
                    <Video size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-main">
                      {consultation.doctor.name}
                    </h3>
                    <p className="text-text-muted text-sm mb-2">
                      {consultation.doctor.specialty}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-text-muted">
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
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    consultation.status === 'completed' ? 'bg-green-100 text-green-700' :
                    consultation.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                  </span>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
                    <Video size={16} />
                    Join Call
                  </button>
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
