import { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { consultationService } from '../../../services/consultation.service';
import { generateDaySlots } from '../../../utils/slotGenerator';
import type { Consultation } from '../../../types';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultation: Consultation;
  onSuccess: (newDate: string, newTimeSlot: string) => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ isOpen, onClose, consultation, onSuccess }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [isSlotAvailable, setIsSlotAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);

  if (!isOpen) return null;

  const slots = generateDaySlots(selectedDate);

  const handleSlotSelection = async (slotJson: string) => {
    setSelectedSlot(slotJson);
    setIsSlotAvailable(null);
    
    if (!slotJson) return;

    setCheckingAvailability(true);
    try {
      const slot = JSON.parse(slotJson);
      const response = await consultationService.checkSlotAvailability(consultation.doctor._id, slot);
      setIsSlotAvailable(response.data.available);
    } catch (err) {
      console.error('Failed to check availability', err);
      setIsSlotAvailable(false);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!selectedSlot || !isSlotAvailable) return;

    setRescheduling(true);
    try {
      const slot = JSON.parse(selectedSlot);
      await consultationService.rescheduleConsultation(consultation._id, slot);
      
      const newTimeSlot = new Date(slot[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      onSuccess(slot[0], newTimeSlot);
      onClose();
    } catch (err) {
      console.error('Failed to reschedule', err);
      alert('Failed to reschedule consultation. Please try again.');
    } finally {
      setRescheduling(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-text-main">Reschedule Consultation</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-text-muted" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Select Date</label>
            <input 
              type="date" 
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedSlot('');
                setIsSlotAvailable(null);
              }}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Select New Time Slot</label>
            <select 
              value={selectedSlot}
              onChange={(e) => handleSlotSelection(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            >
              <option value="">Select a time slot</option>
              {slots.map((slot, idx) => (
                <option key={idx} value={slot.value}>{slot.label}</option>
              ))}
            </select>
          </div>

          {/* Availability Status */}
          {selectedSlot && (
            <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
              checkingAvailability ? 'bg-blue-50 text-blue-700' :
              isSlotAvailable ? 'bg-green-50 text-green-700' :
              'bg-red-50 text-red-700'
            }`}>
              {checkingAvailability ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Checking availability...
                </>
              ) : isSlotAvailable ? (
                <>
                  <Check size={16} />
                  Slot is available
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  Slot is not available
                </>
              )}
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold text-text-muted hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirmReschedule}
              disabled={!isSlotAvailable || rescheduling || checkingAvailability}
              className="flex-1 py-3 rounded-xl font-semibold bg-primary text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {rescheduling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                'Confirm Reschedule'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
