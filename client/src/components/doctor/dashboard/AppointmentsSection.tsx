import React from 'react';
import { Calendar } from 'lucide-react';

const AppointmentsSection = () => (
  <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
    <Calendar className="w-12 h-12 text-text-muted mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-text-main">My Appointments</h3>
    <p className="text-text-muted">Manage your upcoming and past appointments here.</p>
  </div>
);

export default AppointmentsSection;
