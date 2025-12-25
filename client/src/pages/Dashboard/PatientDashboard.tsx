import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Search, 
  Home, 
  LogOut, 
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProfileSection from '../../components/patient/dashboard/ProfileSection';
import FindDoctorsSection from '../../components/patient/dashboard/FindDoctorsSection';
import OverviewSection from '../../components/patient/dashboard/OverviewSection';
import ConsultationsSection from '../../components/patient/dashboard/ConsultationsSection';

const PatientDashboard = () => {
  const { logout, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewSection />;
      case 'find-doctors':
        return <FindDoctorsSection />;
      case 'consultations':
        return <ConsultationsSection />;
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
            label="Consultations" 
            active={activeTab === 'consultations'} 
            onClick={() => setActiveTab('consultations')} 
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



export default PatientDashboard;
