import { useEffect, useState } from 'react';
import { Mail, Phone, Calendar, UserCircle, Edit2, Save, X } from 'lucide-react';
import { patientService } from '../../../services/patient.service';
import type { PatientProfile } from '../../../types';

const ProfileSection = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PatientProfile>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await patientService.getProfile();
        if (response.success) {
          setProfile(response.data);
          setFormData(response.data);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      setError('');
      const response = await patientService.updateProfile(formData);
      if (response.success) {
        setProfile(response.data);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData(profile);
    }
    setIsEditing(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !profile) {
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
        <div className="bg-primary/10 p-8 flex flex-col items-center relative">
          <div className="absolute top-4 right-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-primary"
                title="Edit Profile"
              >
                <Edit2 size={20} />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-red-500"
                  title="Cancel"
                  disabled={saving}
                >
                  <X size={20} />
                </button>
                <button
                  onClick={handleSubmit}
                  className="p-2 bg-primary text-white rounded-full shadow-sm hover:shadow-md transition-all"
                  title="Save"
                  disabled={saving}
                >
                  {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Save size={20} />}
                </button>
              </div>
            )}
          </div>

          <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md mb-4">
            <img 
              src={profile.profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`} 
              alt={profile.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          
          {isEditing ? (
            <h2 className="text-2xl font-bold text-text-main">{profile.name}</h2>
          ) : (
            <h2 className="text-2xl font-bold text-text-main">{profile.name}</h2>
          )}
          <p className="text-text-muted">Patient</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 text-center border-b border-red-100">
            {error}
          </div>
        )}

        <div className="p-8">
          <h3 className="text-lg font-semibold text-text-main mb-6">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                <Mail size={16} />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                />
              ) : (
                <p className="text-text-main font-medium text-slate-500">{profile.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                <Phone size={16} />
                Phone Number
              </label>
              {isEditing ? (
                <p className="text-text-main font-medium">{profile.phone}</p>
              ) : (
                <p className="text-text-main font-medium">{profile.phone}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                <UserCircle size={16} />
                Gender
              </label>
              {isEditing ? (
                <p className="text-text-main font-medium capitalize">{profile.gender}</p>
              ) : (
                <p className="text-text-main font-medium capitalize">{profile.gender}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-muted flex items-center gap-2">
                <Calendar size={16} />
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                />
              ) : (
                <p className="text-text-main font-medium">
                  {new Date(profile.dob).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
