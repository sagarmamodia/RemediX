import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Search, 
  Home, 
  LogOut, 
  Clock, 
  Video,
  Settings,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PatientDashboard = () => {
  const { logout, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewSection />;
      case 'find-doctors':
        return <FindDoctorsSection />;
      case 'appointments':
        return <AppointmentsSection />;
      case 'profile':
        return <ProfileSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-text-main tracking-tight">
              Remedi<span className="text-primary">X</span>
            </span>
          </div>
          <p className="text-xs text-text-muted mt-2 font-medium">Patient Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem 
            icon={<Home size={20} />} 
            label="Overview" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
          />
          <SidebarItem 
            icon={<Search size={20} />} 
            label="Find Doctors" 
            active={activeTab === 'find-doctors'} 
            onClick={() => setActiveTab('find-doctors')} 
          />
          <SidebarItem 
            icon={<Calendar size={20} />} 
            label="Appointments" 
            active={activeTab === 'appointments'} 
            onClick={() => setActiveTab('appointments')} 
          />
          <SidebarItem 
            icon={<User size={20} />} 
            label="My Profile" 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-main capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-text-muted">Welcome back, Patient</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
              P
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-primary text-white shadow-md shadow-primary/20' 
        : 'text-text-muted hover:bg-slate-50 hover:text-text-main'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

// --- Placeholder Sections ---

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
            <p className="text-sm text-text-muted">Upcoming</p>
            <h3 className="text-2xl font-bold text-text-main">1</h3>
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
            <h3 className="text-2xl font-bold text-text-main">12</h3>
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
          <h3 className="text-xl font-bold mb-1">Consultation with Dr. Ritik Dangi</h3>
          <p className="text-blue-100 text-sm">General Physician • Video Call</p>
        </div>
        <button className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
          <Video size={18} />
          Join Room
        </button>
      </div>
    </div>
  </div>
);

const FindDoctorsSection = () => (
  <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
    <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-text-main">Find Doctors</h3>
    <p className="text-text-muted">Search and filter functionality will be implemented here.</p>
  </div>
);

const AppointmentsSection = () => (
  <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
    <Calendar className="w-12 h-12 text-text-muted mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-text-main">Appointment History</h3>
    <p className="text-text-muted">List of past and upcoming appointments will appear here.</p>
  </div>
);

const ProfileSection = () => (
  <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
    <User className="w-12 h-12 text-text-muted mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-text-main">My Profile</h3>
    <p className="text-text-muted">View and edit your personal details here.</p>
  </div>
);

export default PatientDashboard;
