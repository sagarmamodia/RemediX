import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { ArrowLeft, ShieldCheck, Stethoscope, IndianRupee, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { doctorService } from '../services/doctor.service';
import { consultationService } from '../services/consultation.service';
import type { DoctorProfile } from '../types';

const BookingPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  // Booking State
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Instant Booking Context
  const instantBooking = location.state?.instantBooking;
  const instantSlot = location.state?.instantSlot; // [startISO, endISO]

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

  // Initialize instant slot if applicable
  useEffect(() => {
    if (instantBooking && instantSlot) {
      const startTime = new Date(instantSlot[0]);
      const endTime = new Date(instantSlot[1]);
      
      // Update selectedDate to match the instant slot date
      setSelectedDate(startTime.toISOString().split('T')[0]);
      
      // Format for display/value: "HH:mm-HH:mm"
      const slotString = `${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      // We might need to store the actual ISO strings for the backend
      // Let's store the value as a JSON string of the array to be safe and easy to parse back
      setSelectedSlot(JSON.stringify(instantSlot));
    }
  }, [instantBooking, instantSlot]);

  const generateSlots = () => {
    if (instantBooking && instantSlot) {
       const startTime = new Date(instantSlot[0]);
       const endTime = new Date(instantSlot[1]);
       const label = `Instant: ${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
       return [{ value: JSON.stringify(instantSlot), label }];
    }

    const slots = [];
    const date = new Date(selectedDate);
    
    // Helper to create slot
    const addSlots = (startHour: number, endHour: number) => {
      for (let hour = startHour; hour < endHour; hour++) {
        // Slot 1: hour:00 - hour:30
        const start1 = new Date(date); start1.setHours(hour, 0, 0, 0);
        const end1 = new Date(date); end1.setHours(hour, 30, 0, 0);
        
        // Slot 2: hour:30 - (hour+1):00
        const start2 = new Date(date); start2.setHours(hour, 30, 0, 0);
        const end2 = new Date(date); end2.setHours(hour + 1, 0, 0, 0);

        // Filter past slots if today
        const now = new Date();
        if (date.toDateString() !== now.toDateString() || start1 > now) {
           slots.push({
             value: JSON.stringify([start1.toISOString(), end1.toISOString()]),
             label: `${start1.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${end1.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
           });
        }
        if (date.toDateString() !== now.toDateString() || start2 > now) {
           slots.push({
             value: JSON.stringify([start2.toISOString(), end2.toISOString()]),
             label: `${start2.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${end2.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
           });
        }
      }
    };

    // 9:00 AM to 1:00 PM
    addSlots(9, 13);
    // 2:00 PM to 6:00 PM
    addSlots(14, 18);

    return slots;
  };

  const handleCheckAvailability = async () => {
    if (!selectedSlot || !doctor) return;
    
    try {
      setCheckingAvailability(true);
      setIsAvailable(null);
      const slotArray = JSON.parse(selectedSlot);
      
      // If instant booking, we might assume it's available since we just filtered for it?
      // But good to double check or just use the standard check endpoint.
      // The standard check endpoint checks doctor shifts and existing bookings.
      // For instant booking, the doctor might not have a "shift" defined for "now" if it's outside 9-6?
      // The prompt says "if doctor is available then the payment component is enabled".
      // Let's use the checkSlot endpoint.
      
      const response = await consultationService.checkSlotAvailability(doctor.id, slotArray);
      if (response.success) {
        setIsAvailable(response.data.available);
      } else {
        setIsAvailable(false);
      }
    } catch (err) {
      console.error('Availability check failed', err);
      setIsAvailable(false);
    } finally {
      setCheckingAvailability(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error || !doctor) return <div className="text-center p-8 text-red-600">{error || 'Doctor not found'}</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-text-muted hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Doctor & Slot Selection */}
          <div className="space-y-6">
            {/* Doctor Details Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-text-main mb-6">Consultation Details</h2>
              
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
                  <p className="text-primary text-sm">{doctor.specialty}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Select Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted h-5 w-5" />
                    <input 
                      type="date" 
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedSlot('');
                        setIsAvailable(null);
                      }}
                      disabled={!!instantBooking}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:bg-slate-100"
                    />
                  </div>
                </div>

                {/* Slot Selection */}
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Select Time Slot</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted h-5 w-5" />
                    {instantBooking ? (
                      <div className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-text-main">
                        {generateSlots()[0]?.label || 'Unavailable'}
                      </div>
                    ) : (
                      <select 
                        value={selectedSlot}
                        onChange={(e) => {
                          setSelectedSlot(e.target.value);
                          setIsAvailable(null);
                        }}
                        className="w-full pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none bg-white cursor-pointer"
                      >
                        <option value="">Select a slot</option>
                        {generateSlots().map((slot, idx) => (
                          <option key={idx} value={slot.value}>{slot.label}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Check Availability Button */}
                <button
                  onClick={handleCheckAvailability}
                  disabled={!selectedSlot || checkingAvailability}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    !selectedSlot 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                  }`}
                >
                  {checkingAvailability ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Check Availability
                    </>
                  )}
                </button>

                {/* Availability Status */}
                {isAvailable !== null && (
                  <div className={`p-4 rounded-xl flex items-center gap-3 ${
                    isAvailable ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {isAvailable ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span className="font-medium">
                      {isAvailable ? 'Doctor is available for this slot!' : 'Slot is not available. Please choose another.'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Payment */}
          <div className="space-y-6">
            <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all ${!isAvailable ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="text-green-600" />
                <h2 className="text-xl font-bold text-text-main">Secure Payment</h2>
              </div>

              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-muted">Consultation Fee</span>
                  <span className="font-bold text-text-main flex items-center">
                    <IndianRupee size={14} />
                    {doctor.fee}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="font-bold text-lg text-text-main">Total to Pay</span>
                  <span className="font-bold text-xl text-primary flex items-center">
                    <IndianRupee size={18} />
                    {doctor.fee}
                  </span>
                </div>
              </div>

              <PaymentForm
                applicationId={import.meta.env.VITE_SQUARE_APP_ID}
                locationId={import.meta.env.VITE_SQUARE_LOCATION_ID}
                cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
                  if (token.status !== 'OK' || !token.token) {
                    alert('Payment failed: ' + (token.errors?.[0]?.message || 'Unknown error'));
                    return;
                  }

                  try {
                    setProcessing(true);
                    const slotArray = JSON.parse(selectedSlot);
                    const response = await consultationService.bookConsultation({
                      doctorId: doctor.id,
                      slot: slotArray,
                      sourceId: token.token
                    });
                    
                    if (response.success) {
                      navigate('/dashboard', { state: { bookingSuccess: true } });
                    }
                  } catch (err: any) {
                    console.error('Booking failed:', err);
                    const errorMessage = err.response?.data?.data?.error || err.message || 'Booking failed';
                    alert(`Booking failed: ${errorMessage}`);
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
    </div>
  );
};

export default BookingPage;
