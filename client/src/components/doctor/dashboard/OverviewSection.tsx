import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Video, Power } from 'lucide-react';
import { doctorService } from '../../../services/doctor.service';

const OverviewSection = () => {
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await doctorService.getProfile();
        if (response.success) {
          setAvailable(response.data.available);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const toggleAvailability = async () => {
    try {
      const newStatus = !available;
      await doctorService.updateAvailability(newStatus);
      setAvailable(newStatus);
    } catch (err) {
      console.error('Failed to update availability', err);
      alert('Failed to update availability. You may have pending consultations.');
    }
  };

  return (
  <div className="space-y-6">
    {/* Availability Toggle Header */}
    <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div>
        <h2 className="text-xl font-bold text-text-main">Overview</h2>
        <p className="text-text-muted text-sm">Welcome back, Doctor</p>
      </div>
      <button
        onClick={toggleAvailability}
        disabled={loading}
        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${
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
            <p className="text-sm text-text-muted">Today's Appointments</p>
            <h3 className="text-2xl font-bold text-text-main">4</h3>
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
            <h3 className="text-2xl font-bold text-text-main">128</h3>
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
            <h3 className="text-2xl font-bold text-text-main">1</h3>
          </div>
        </div>
      </div>
    </div>

    {/* Ongoing Appointment Card (Conditional) */}
    <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-primary/20">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-blue-100">Happening Now</span>
          </div>
          <h3 className="text-xl font-bold mb-1">Consultation with Sagar</h3>
          <p className="text-blue-100 text-sm">Follow-up • Video Call</p>
        </div>
        <button className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
          <Video size={18} />
          Join Room
        </button>
      </div>
    </div>
  </div>
);
};

export default OverviewSection;
