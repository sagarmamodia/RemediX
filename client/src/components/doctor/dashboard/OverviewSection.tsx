import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Video, Power, CheckCircle, Upload, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../../services/doctor.service';
import { consultationService } from '../../../services/consultation.service';
import type { Consultation } from '../../../types';

const OverviewSection = () => {
  const navigate = useNavigate();
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, consultationsData] = await Promise.all([
          doctorService.getProfile(),
          consultationService.getConsultations()
        ]);

        if (profileRes.success) {
          setAvailable(profileRes.data.available);
        }
        setConsultations(consultationsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleAvailability = async () => {
    try {
      const newStatus = !available;
      await doctorService.updateAvailability(newStatus);
      setAvailable(newStatus);
    } catch (err: any) {
      console.error('Failed to update availability', err);
      alert(err.response?.data?.data?.error || 'Failed to update availability. You may have pending consultations.');
    }
  };

  const handleMarkCompleted = async (consultationId: string) => {
    if (window.confirm('Are you sure you want to mark this consultation as completed?')) {
      try {
        await consultationService.markAsCompleted(consultationId);
        setConsultations(prev => prev.map(c => 
          c._id === consultationId ? { ...c, status: 'completed' } : c
        ));
      } catch (err: any) {
        console.error('Failed to mark as completed:', err);
        alert(err.response?.data?.data?.error || 'Failed to update status');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, consultationId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(consultationId);
    try {
      const response = await consultationService.uploadPrescription(consultationId, file);
      
      // Update local state to show the new prescription immediately
      setConsultations(prev => prev.map(c => {
        if (c._id === consultationId) {
          return { ...c, prescriptionUrl: response.data.url || response.url }; // Adjust based on actual API response structure
        }
        return c;
      }));
      
      // Re-fetch to be sure (optional, but good for consistency)
      const updatedConsultations = await consultationService.getConsultations();
      setConsultations(updatedConsultations);

    } catch (err) {
      console.error('Failed to upload prescription:', err);
      alert('Failed to upload prescription');
    } finally {
      setUploadingId(null);
    }
  };

  // Calculate Stats
  const today = new Date().toDateString();
  const todaysConsultations = consultations.filter(c => new Date(c.date).toDateString() === today).length;
  const pendingRequests = consultations.filter(c => c.status === 'pending').length;
  const uniquePatients = new Set(consultations.filter(c => c.patient).map(c => c.patient?.name)).size;

  // Find upcoming consultations
  const upcomingConsultations = consultations
    .filter(c => c.status === 'pending' || c.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
  <div className="space-y-6">
    {/* Availability Toggle Header */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div>
        <h2 className="text-xl font-bold text-text-main">Overview</h2>
        <p className="text-text-muted text-sm">Welcome back, Doctor</p>
      </div>
      <button
        onClick={toggleAvailability}
        disabled={loading}
        className={`w-full md:w-auto flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${
          available 
            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        <div className={`w-3 h-3 rounded-full ${available ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
        {loading ? 'Loading...' : available ? 'Available for Consultations' : 'Unavailable'}
        <Power size={18} />
      </button>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-text-muted">Today's Consultations</p>
            <h3 className="text-2xl font-bold text-text-main">{todaysConsultations}</h3>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-text-muted">Total Patients</p>
            <h3 className="text-2xl font-bold text-text-main">{uniquePatients}</h3>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-text-muted">Pending Requests</p>
            <h3 className="text-2xl font-bold text-text-main">{pendingRequests}</h3>
          </div>
        </div>
      </div>
    </div>

    {/* Upcoming Consultations List */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-main">Upcoming Consultations</h3>
      {upcomingConsultations.length > 0 ? (
        upcomingConsultations.map((consultation) => (
          <div key={consultation._id} className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="w-full md:w-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-blue-100">Upcoming</span>
                </div>
                <h3 className="text-xl font-bold mb-1 truncate max-w-[250px] md:max-w-none">Consultation with {consultation.patient?.name || 'Patient'}</h3>
                <p className="text-blue-100 text-sm">General Consultation • Video Call</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-blue-50 text-sm">
                   <span className="flex items-center gap-1"><Calendar size={16}/> {new Date(consultation.date).toLocaleDateString()}</span>
                   <span className="flex items-center gap-1"><Clock size={16}/> {consultation.timeSlot}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full md:w-auto min-w-[200px]">
                <button 
                  onClick={() => navigate(`/room/${consultation._id}`)}
                  className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 w-full justify-center"
                >
                  <Video size={18} />
                  Join Room
                </button>
                <button 
                  onClick={() => handleMarkCompleted(consultation._id)}
                  className="bg-white/20 text-white border border-white/40 px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center gap-2 w-full justify-center"
                >
                  <CheckCircle size={18} />
                  Mark Completed
                </button>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  {consultation.prescriptionUrl && (
                    <a 
                      href={consultation.prescriptionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 text-white border border-white/40 px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center gap-2 w-full sm:flex-1 justify-center"
                    >
                      <FileText size={18} />
                      View Rx
                    </a>
                  )}
                  <label className={`cursor-pointer bg-white/20 text-white border border-white/40 px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center gap-2 w-full ${consultation.prescriptionUrl ? 'sm:flex-1' : ''} justify-center`}>
                    {uploadingId === consultation._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Upload Rx
                      </>
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileUpload(e, consultation._id)}
                      disabled={uploadingId === consultation._id}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
            <p className="text-text-muted">No upcoming consultations.</p>
        </div>
      )}
    </div>
  </div>
);
};

export default OverviewSection;
