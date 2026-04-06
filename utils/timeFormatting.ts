/**
 * Formats seconds into swim time display: mm:ss.cc
 * e.g. 65.42 → "1:05.42", 30.5 → "30.50"
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const secsStr = secs.toFixed(2).padStart(5, "0");
  return mins > 0 ? `${mins}:${secsStr}` : secsStr;
}

/**
 * Abbreviated time for chart Y-axis labels: mm:ss
 * e.g. 65.42 → "1:05", 30.5 → "0:30"
 */
export function formatTimeShort(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

/**
 * Formats an ISO date string into short display: M/D
 * e.g. "2025-03-15T..." → "3/15"
 */
export function formatDateShort(isoString: string): string {
  const d = new Date(isoString);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
