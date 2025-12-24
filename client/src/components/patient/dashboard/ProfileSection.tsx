import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Calendar, UserCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { patientService } from '../../../services/patient.service';
import type { PatientProfile } from '../../../types';

const ProfileSection = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await patientService.getProfile();
        if (response.success) {
          setProfile(response.data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
        {error}
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-primary/10 p-8 flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md mb-4">
            <img 
              src={profile.profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`} 
              alt={profile.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-text-main">{profile.name}</h2>
          <p className="text-text-muted">Patient</p>
        </div>

        <div className="p-8">
          <h3 className="text-lg font-semibold text-text-main mb-6">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                <Mail size={16} />
                Email Address
              </label>
              <p className="text-text-main font-medium">{profile.email}</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                <Phone size={16} />
                Phone Number
              </label>
              <p className="text-text-main font-medium">{profile.phone}</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                <UserCircle size={16} />
                Gender
              </label>
              <p className="text-text-main font-medium capitalize">{profile.gender}</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                <Calendar size={16} />
                Date of Birth
              </label>
              <p className="text-text-main font-medium">
                {new Date(profile.dob).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
