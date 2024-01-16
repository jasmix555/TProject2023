export const formatRemainingTime = (remainingTime: Duration | null) => {
  if (!remainingTime) {
    return "00:00:00";
  }

  const hours = String(remainingTime.hours).padStart(2, "0");
  const minutes = String(remainingTime.minutes).padStart(2, "0");
  const seconds = String(remainingTime.seconds).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};
