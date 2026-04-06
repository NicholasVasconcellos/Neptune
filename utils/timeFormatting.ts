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
 * Parses a time string (MM:SS.ms or plain seconds) into total seconds.
 * e.g. "1:30.22" → 90.22, "90" → 90, "" → null
 */
export function parseTimeToSeconds(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed.includes(":")) {
    const parts = trimmed.split(":");
    if (parts.length !== 2) return null;
    const minutes = parseInt(parts[0], 10);
    const seconds = parseFloat(parts[1]);
    if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || seconds < 0)
      return null;
    return minutes * 60 + seconds;
  }
  const val = parseFloat(trimmed);
  if (isNaN(val) || val <= 0) return null;
  return val;
}

/**
 * Cleans and auto-formats time input: strips non-numeric chars
 * except `:` and `.`, auto-inserts colon after 2 digits.
 */
export function cleanTimeInput(text: string): string {
  let cleaned = text.replace(/[^0-9:.]/g, "");
  const hasColon = cleaned.includes(":");
  const hasDot = cleaned.includes(".");
  if (!hasColon && !hasDot) {
    const digits = cleaned.replace(/[^0-9]/g, "");
    if (digits.length > 2) {
      cleaned = digits.slice(0, 2) + ":" + digits.slice(2);
    }
  }
  return cleaned;
}

/**
 * Formats an ISO date string into short display: M/D
 * e.g. "2025-03-15T..." → "3/15"
 */
export function formatDateShort(isoString: string): string {
  const d = new Date(isoString);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
