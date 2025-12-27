export const getISTDetails = (date: Date) => {
  // 1. Define the formatter with 'Asia/Kolkata' timezone
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "numeric", // Returns number (e.g., 12)
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false, // Use 24-hour clock (0-23)
    weekday: "short",
  });

  // 2. Break the date into parts
  const parts = formatter.formatToParts(date);

  // 3. Helper function to find specific parts
  const getPart = (type: Intl.DateTimeFormatPartTypes) => {
    return parts.find((p) => p.type === type)?.value;
  };

  return {
    // The standard UTC ISO string (always Z)
    originalISO: date.toISOString(),

    // A clean human-readable IST string
    fullIST: formatter.format(date),

    // day of week
    weekday: getPart("weekday"),

    // Individual Numeric Components (in IST)
    day: Number(getPart("day")),
    month: Number(getPart("month")),
    year: Number(getPart("year")),
    hour: Number(getPart("hour")),
    minute: Number(getPart("minute")),
    second: Number(getPart("second")),
  };
};
