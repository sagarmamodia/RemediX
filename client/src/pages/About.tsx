import React from 'react';
import { Shield, Heart, Clock, Users, Award, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-6">
            Revolutionizing Healthcare Access
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            RemediX is bridging the gap between patients and healthcare providers through secure, instant, and reliable digital consultations.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-text-main mb-6">Our Mission</h2>
            <p className="text-text-muted text-lg leading-relaxed mb-6">
              At RemediX, we believe that quality healthcare should be accessible to everyone. We are building a future where medical expertise is just a click away.
            </p>
            <p className="text-text-muted text-lg leading-relaxed">
              Our platform empowers doctors to reach more patients and helps patients find the right care at the right time.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-primary" size={24} />
              </div>
              <h3 className="font-bold text-text-main mb-2">Secure & Private</h3>
              <p className="text-sm text-text-muted">HIPAA compliant data protection.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-green-600" size={24} />
              </div>
              <h3 className="font-bold text-text-main mb-2">24/7 Availability</h3>
              <p className="text-sm text-text-muted">Access to medical care anytime.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-purple-600" size={24} />
              </div>
              <h3 className="font-bold text-text-main mb-2">Expert Doctors</h3>
              <p className="text-sm text-text-muted">Verified specialists available.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="bg-orange-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Heart className="text-orange-600" size={24} />
              </div>
              <h3 className="font-bold text-text-main mb-2">Patient First</h3>
              <p className="text-sm text-text-muted">Designed for your comfort.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
