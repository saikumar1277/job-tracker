// Build "YYYY-MM-DD" from a Date's LOCAL fields. We deliberately avoid
// date.toISOString() here — it converts to UTC first, which can silently
// roll the date back or forward a day depending on your timezone.
export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
