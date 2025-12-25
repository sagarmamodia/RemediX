import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { ArrowLeft, ShieldCheck, Stethoscope, IndianRupee } from 'lucide-react';
import { doctorService } from '../services/doctor.service';
import { consultationService } from '../services/consultation.service';
import type { DoctorProfile } from '../types';

const BookingPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;
      try {
        const response = await doctorService.getDoctorDetails(doctorId);
        if (response.success) {
          setDoctor(response.data);
        }
      } catch (err) {
        setError('Failed to load doctor details');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error || !doctor) return <div className="text-center p-8 text-red-600">{error || 'Doctor not found'}</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-text-muted hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Doctor Details Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
            <h2 className="text-xl font-bold text-text-main mb-6">Consultation Summary</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full overflow-hidden">
                <img 
                  src={doctor.profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random`} 
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-text-main">{doctor.name}</h3>
                <p className="text-primary text-sm">{doctor.speciality}</p>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Consultation Fee</span>
                <span className="font-bold text-text-main flex items-center">
                  <IndianRupee size={14} />
                  {doctor.fee}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Platform Fee</span>
                <span className="font-bold text-text-main flex items-center">
                  <IndianRupee size={14} />
                  0
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="font-bold text-lg text-text-main">Total to Pay</span>
                <span className="font-bold text-xl text-primary flex items-center">
                  <IndianRupee size={18} />
                  {doctor.fee}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="text-green-600" />
              <h2 className="text-xl font-bold text-text-main">Secure Payment</h2>
            </div>

            <PaymentForm
              applicationId={import.meta.env.VITE_SQUARE_APP_ID}
              locationId={import.meta.env.VITE_SQUARE_LOCATION_ID}
              cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
                console.log('App ID used:', import.meta.env.VITE_SQUARE_APP_ID);
                if (token.status !== 'OK' || !token.token) {
                  console.error('Tokenization failed:', token.errors);
                  alert('Payment failed: ' + (token.errors?.[0]?.message || 'Unknown error'));
                  return;
                }

                try {
                  setProcessing(true);
                  const response = await consultationService.bookConsultation({
                    doctorId: doctor.id,
                    sourceId: token.token
                  });
                  
                  if (response.success) {
                    // Redirect to success/dashboard
                    navigate('/dashboard', { state: { bookingSuccess: true } });
                  }
                } catch (err) {
                  console.error('Booking failed:', err);
                  alert('Payment processed but booking failed. Please contact support.');
                } finally {
                  setProcessing(false);
                }
              }}
            >
              <CreditCard />
            </PaymentForm>
            
            <p className="text-xs text-text-muted mt-4 text-center">
              Payments are processed securely by Square. We do not store your card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
