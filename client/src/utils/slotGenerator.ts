export const getNextValidInstantSlot = (): [Date, Date] | null => {
  const now = new Date();
  // Start looking from 5 minutes in the future
  const start = new Date(now.getTime() + 5 * 60000);
  // const minutes = start.getHours() * 60 + start.getMinutes();

  // Shifts: 9:00-13:00 (540-780) and 14:00-18:00 (840-1080)
  
  // Check Morning Shift
  // Start >= 9:00 (540) AND End (Start+30) <= 13:00 (780)
  // if (minutes >= 540 && minutes + 30 <= 780) {
    const end = new Date(start.getTime() + 30 * 60000);
    return [start, end];
  // }

  // Check Evening Shift
  // Start >= 14:00 (840) AND End (Start+30) <= 18:00 (1080)
  // if (minutes >= 840 && minutes + 30 <= 1080) {
  //   const end = new Date(start.getTime() + 30 * 60000);
  //   return [start, end];
  // }

  // If not in any valid shift, return null (Unavailable)
  // return null;
};

export const generateDaySlots = (selectedDate: string | Date) => {
  const slots: { value: string; label: string }[] = [];
  const date = new Date(selectedDate);
  
  // Helper to create slot
  const addSlots = (startHour: number, endHour: number) => {
    for (let hour = startHour; hour < endHour; hour++) {
      // Explicitly skip 1 PM (13:00) to ensure 1-2 PM break
      if (hour === 13) continue;

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