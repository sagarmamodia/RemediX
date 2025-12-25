import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Stethoscope, Mail, Phone, Lock, Calendar, IndianRupee, Award, UserCircle } from 'lucide-react';
import type { Role, RegisterFormData } from '../types';
import api from '../services/api';

import { seedUsers } from '../utils/seedData';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('Patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    gender: '',
    dob: '',
    fee: '',
    speciality: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const defaultProfileUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`;
      
      const payload = {
        ...formData,
        // will later user can edit profile imaage from prodile update section 
        profileUrl: defaultProfileUrl,
        // Convert fee to number for doctor
        ...(role === 'Doctor' && { fee: Number(formData.fee) })
      };

      const endpoint = role === 'Patient' ? '/auth/patient/register' : '/auth/doctor/register';
      
      const response = await api.post(endpoint, payload);

      if (response.data.success) {
        navigate('/login?role=' + role);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl w-full border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-text-main">Create Account</h2>
          <p className="mt-2 text-text-muted">Join RemediX as a {role}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Role Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-8 max-w-md mx-auto">
           {/* to register as patient */}
          <button
            type="button"
            onClick={() => setRole('Patient')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              role === 'Patient' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <User size={18} />
            Patient
          </button>
             {/* to register as doctor */}
          <button
            type="button"
            onClick={() => setRole('Doctor')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              role === 'Doctor' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <Stethoscope size={18} />
            Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircle className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 focus:bg-white"
                  placeholder="Ritik Dangi"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 focus:bg-white"
                  placeholder="ritik@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 focus:bg-white"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Gender</label>
              <select
                name="gender"
                required
                className="block w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 focus:bg-white"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* DOB */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-main">Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type="date"
                  name="dob"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 focus:bg-white"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Provider Specific Fields */}
          {role === 'Provider' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 animate-fade-in">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-main">Speciality</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Award className="h-5 w-5 text-text-muted" />
                  </div>
                  <input
                    type="text"
                    name="speciality"
                    required={role === 'Provider'}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 focus:bg-white"
                    placeholder="e.g. Cardiologist"
                    value={formData.speciality}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-main">Consultation Fee (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee className="h-5 w-5 text-text-muted" />
                  </div>
                  <input
                    type="number"
                    name="fee"
                    required={role === 'Provider'}
                    min="0"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50 focus:bg-white"
                    placeholder="0.00"
                    value={formData.fee}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-soft hover:shadow-lg hover:-translate-y-0.5"
            >
              Create Account
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-text-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary-hover transition-colors">
                Sign in here
              </Link>
            </p>
            {/* Dev Tool: Seed Data */}
            <button 
              type="button"
              onClick={seedUsers}
              className="mt-4 text-xs text-slate-400 hover:text-slate-600 underline"
            >
              (Dev) Seed Test Users
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;