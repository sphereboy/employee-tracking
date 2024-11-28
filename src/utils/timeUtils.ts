import { formatInTimeZone } from "date-fns-tz";

export function getAvailabilityStatus(timeZone: string): string {
  const now = new Date();
  const localTime = formatInTimeZone(now, timeZone, "H"); // Get hour in 24h format
  const hour = parseInt(localTime, 10);

  // Simple availability check - available between 9 AM and 5 PM in their timezone
  if (hour >= 9 && hour < 17) {
    return "Available";
  }
  return "Unavailable";
}

export function formatTimeForTimeZone(timeZone: string): string {
  return formatInTimeZone(new Date(), timeZone, "h:mm a");
}

export function getTimeDifference(timeZone: string): string {
  const now = new Date();
  const localTime = formatInTimeZone(now, "UTC", "H");
  const targetTime = formatInTimeZone(now, timeZone, "H");

  const diff = parseInt(targetTime, 10) - parseInt(localTime, 10);

  if (diff === 0) return "Same time";
  return `${Math.abs(diff)} hour${Math.abs(diff) !== 1 ? "s" : ""} ${
    diff > 0 ? "ahead" : "behind"
  }`;
}
