import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = (role: 'Patient' | 'Provider') => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
       
      <section className="relative bg-gradient-to-b from-primary-light/30 to-background pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
         <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-soft mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-text-muted">24/7 Online Consultation Available</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-text-main tracking-tight mb-6 leading-tight">
            Healthcare from the <br className="hidden md:block" />
            <span className="text-primary relative">
              Comfort of Home
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-xl text-text-muted leading-relaxed">
            Connect with top-tier medical professionals instantly. Secure, private, and convenient online consultations tailored to your needs.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleLoginRedirect('Patient')}
              className="group relative w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-semibold text-lg shadow-lg shadow-primary/30 hover:bg-primary-hover hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5" />
              <span>Login as Patient</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
            
            <button
              onClick={() => handleLoginRedirect('Provider')}
              className="group w-full sm:w-auto px-8 py-4 bg-white text-text-main border border-slate-200 rounded-xl font-semibold text-lg shadow-soft hover:border-primary/30 hover:bg-slate-50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Stethoscope className="w-5 h-5 text-primary" />
              <span>Login as Doctor</span>
            </button>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-blue-400/5 blur-3xl"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Stethoscope className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3">Expert Doctors</h3>
              <p className="text-text-muted leading-relaxed">
                Access a network of verified specialists across various medical fields ready to assist you.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Clock className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3">Instant Booking</h3>
              <p className="text-text-muted leading-relaxed">
                Schedule appointments in seconds. Choose a time that works for you without the wait.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <ShieldCheck className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3">Secure & Private</h3>
              <p className="text-text-muted leading-relaxed">
                Your health data is encrypted and protected with enterprise-grade security standards.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
