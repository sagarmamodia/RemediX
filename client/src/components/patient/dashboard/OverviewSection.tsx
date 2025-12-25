import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { consultationService } from '../../../services/consultation.service';
import type { Consultation } from '../../../types';

const OverviewSection = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const data = await consultationService.getConsultations();
        setConsultations(data);
      } catch (err) {
        console.error('Failed to load consultations', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const upcomingConsultations = consultations.filter(c => c.status === 'scheduled' || c.status === 'pending');
  const completedConsultations = consultations.filter(c => c.status === 'completed');
  
  // Find the next upcoming consultation
  const nextConsultation = upcomingConsultations.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  })[0];

  if (loading) return <div>Loading overview...</div>;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-text-muted">Upcoming</p>
              <h3 className="text-2xl font-bold text-text-main">{upcomingConsultations.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-text-muted">Completed</p>
              <h3 className="text-2xl font-bold text-text-main">{completedConsultations.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Next Consultation Card */}
      {nextConsultation ? (
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-blue-100">Upcoming Consultation</span>
              </div>
              <h3 className="text-xl font-bold mb-1">Consultation with {nextConsultation.doctor.name}</h3>
            <p className="text-blue-100 text-sm">{nextConsultation.doctor.specialty} • Video Call</p>
              <div className="mt-4 flex items-center gap-4 text-blue-50 text-sm">
                 <span className="flex items-center gap-1"><Calendar size={16}/> {new Date(nextConsultation.date).toLocaleDateString()}</span>
                 <span className="flex items-center gap-1"><Clock size={16}/> {nextConsultation.timeSlot}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/room/${nextConsultation._id}`)}
              className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <Video size={18} />
              Join Call
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
            <p className="text-text-muted">No upcoming consultations.</p>
        </div>
      )}
    </div>
  );
};

export default OverviewSection;
