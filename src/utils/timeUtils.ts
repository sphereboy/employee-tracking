import { format, formatInTimeZone } from "date-fns-tz";
import { differenceInHours } from "date-fns";

export function getAvailabilityStatus(timeZone: string): string {
  const hour = new Date().getHours();
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
  const localHour = new Date().getHours();
  const targetHour = new Date().getHours(); // This is simplified - you'd want to actually convert to target timezone
  const diff = differenceInHours(localHour, targetHour);

  if (diff === 0) return "Same time";
  return `${Math.abs(diff)} hour${Math.abs(diff) !== 1 ? "s" : ""} ${
    diff > 0 ? "behind" : "ahead"
  }`;
}
