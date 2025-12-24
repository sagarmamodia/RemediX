import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Role } from '../types';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<Role>('patient');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'patient' || roleParam === 'provider') {
      setRole(roleParam);
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-text-main">
          Login as <span className="text-primary capitalize">{role}</span>
        </h2>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-blue-800">
          <p>This is a placeholder login page.</p>
          <p className="mt-1 font-medium">Selected Role: {role}</p>
        </div>

        <div className="space-y-4">
          {/* Role Toggle for demonstration */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setRole('patient')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                role === 'patient' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => setRole('provider')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                role === 'provider' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
