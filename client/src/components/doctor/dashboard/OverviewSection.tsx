import React from 'react';
import { Calendar, Clock, Users, Video } from 'lucide-react';

const OverviewSection = () => (
  <div className="space-y-6">
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

export default OverviewSection;
