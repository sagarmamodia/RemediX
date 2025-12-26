export const getNextValidInstantSlot = (): [Date, Date] | null => {
  const now = new Date();
  // Start looking from 5 minutes in the future
  const start = new Date(now.getTime() + 5 * 60000);
  const minutes = start.getHours() * 60 + start.getMinutes();

  // Shifts: 9:00-13:00 (540-780) and 14:00-18:00 (840-1080)
  
  // Check Morning Shift
  // Start >= 9:00 (540) AND End (Start+30) <= 13:00 (780)
  if (minutes >= 540 && minutes + 30 <= 780) {
    const end = new Date(start.getTime() + 30 * 60000);
    return [start, end];
  }

  // Check Evening Shift
  // Start >= 14:00 (840) AND End (Start+30) <= 18:00 (1080)
  if (minutes >= 840 && minutes + 30 <= 1080) {
    const end = new Date(start.getTime() + 30 * 60000);
    return [start, end];
  }

  // If not in any valid shift, return null (Unavailable)
  return null;
};