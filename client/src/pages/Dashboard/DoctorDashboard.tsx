import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Home, 
  LogOut, 
  Stethoscope,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProfileSection from '../../components/doctor/dashboard/ProfileSection';
import OverviewSection from '../../components/doctor/dashboard/OverviewSection';
import ConsultationsSection from '../../components/doctor/dashboard/ConsultationsSection';

const DoctorDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewSection />;
      case 'consultations':
        return <ConsultationsSection />;
      case 'profile':
        return <ProfileSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold text-text-main tracking-tight">
            Remedi<span className="text-primary">X</span>
          </span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-text-main">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col h-full transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-text-main tracking-tight">
              Remedi<span className="text-primary">X</span>
            </span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-text-muted hover:text-text-main">
            <X size={24} />
          </button>
        </div>
        
        <p className="px-6 text-xs text-text-muted mt-2 font-medium md:block hidden">Doctor Portal</p>
        
        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem 
            icon={<Home size={20} />} 
            label="Overview" 
            active={activeTab === 'overview'} 
            onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }} 
          />
          <SidebarItem 
            icon={<Calendar size={20} />} 
            label="Consultations" 
            active={activeTab === 'consultations'} 
            onClick={() => { setActiveTab('consultations'); setIsMobileMenuOpen(false); }} 
          />
          <SidebarItem 
            icon={<User size={20} />} 
            label="My Profile" 
            active={activeTab === 'profile'} 
            onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false); }} 
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

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 w-full">
        <header className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-text-main capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-sm md:text-base text-text-muted">Welcome back, Doctor</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm md:text-base">
              D
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

export default DoctorDashboard;