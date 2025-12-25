import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Star, IndianRupee } from 'lucide-react';
import { doctorService } from '../../../services/doctor.service';
import type { DoctorProfile } from '../../../types';

const SPECIALITIES = [
  'All',
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Neurologist',
  'Orthopedist',
  'Psychiatrist',
  'Dentist'
];

const FindDoctorsSection = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(false);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const filters: { name?: string; specialty?: string; available?: boolean } = {};
      
      if (searchQuery) filters.name = searchQuery;
      if (selectedSpeciality !== 'All') filters.specialty = selectedSpeciality;
      if (availableOnly) filters.available = true;

      const response = await doctorService.getDoctors(filters);
      if (response.success) {
        setDoctors(response.data.list);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors list.');
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedSpeciality, availableOnly]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted h-5 w-5" />
          <input
            type="text"
            placeholder="Search doctors by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
        
        <div className="relative min-w-[200px] w-full md:w-auto">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted h-5 w-5" />
          <select
            value={selectedSpeciality}
            onChange={(e) => setSelectedSpeciality(e.target.value)}
            className="w-full pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none bg-white cursor-pointer"
          >
            {SPECIALITIES.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="h-4 w-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none whitespace-nowrap">
          <input 
            type="checkbox" 
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
          />
          <span className="text-sm font-medium text-text-main">Available Only</span>
        </label>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-text-muted text-lg">No doctors found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 flex flex-col items-center text-center border-b border-slate-100">
                <div className="w-24 h-24 bg-slate-100 rounded-full mb-4 overflow-hidden relative">
                  <img 
                    src={doctor.profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random`} 
                    alt={doctor.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${doctor.available ? 'bg-green-500' : 'bg-slate-400'}`} title={doctor.available ? 'Available' : 'Unavailable'}></div>
                </div>
                <h3 className="text-lg font-bold text-text-main">{doctor.name}</h3>
                <p className="text-primary font-medium text-sm">{doctor.specialty}</p>
                
                <div className="flex items-center gap-1 mt-2 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-medium text-text-main">4.8</span>
                  <span className="text-xs text-text-muted">(120+ reviews)</span>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-text-muted">Consultation Fee</span>
                  <span className="font-bold text-text-main flex items-center">
                    <IndianRupee size={14} />
                    {doctor.fee}
                  </span>
                </div>
                <button 
                  onClick={() => navigate(`/booking/${doctor.id}`)}
                  disabled={!doctor.available}
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    doctor.available 
                      ? 'bg-primary text-white hover:bg-primary-dark' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {doctor.available ? 'Book Consultation' : 'Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindDoctorsSection;
