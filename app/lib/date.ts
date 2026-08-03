// Build "YYYY-MM-DD" from a Date's LOCAL fields. We deliberately avoid
// date.toISOString() here — it converts to UTC first, which can silently
// roll the date back or forward a day depending on your timezone.
export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// The reverse of toDateKey: turn "YYYY-MM-DD" back into a Date at LOCAL
// midnight. We deliberately avoid `new Date("YYYY-MM-DD")` — the built-in
// parser treats that format as UTC midnight, which can silently shift the
// date back a day once you read it back with local fields (like toDateKey
// does), depending on your timezone.
export function fromDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}
