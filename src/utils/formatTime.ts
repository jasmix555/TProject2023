import { Duration } from "date-fns";

export const formatRemainingTime = (remainingTime: Duration) => {
  const hours = String(remainingTime.hours).padStart(2, "0");
  const minutes = String(remainingTime.minutes).padStart(2, "0");
  const seconds = String(remainingTime.seconds).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};
