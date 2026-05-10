
export function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-IE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDay(iso) {
  return new Date(iso).toLocaleDateString('en-IE', { weekday: 'long' });
}

export function formatLongDate(iso) {
  return new Date(iso).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatTimeRange(startIso, endIso) {
  const fmt = { hour: '2-digit', minute: '2-digit', hour12: false };
  const start = new Date(startIso).toLocaleTimeString('en-IE', fmt);
  if (!endIso) return start;
  const end = new Date(endIso).toLocaleTimeString('en-IE', fmt);
  return `${start} – ${end}`;
}
export function formatForInput(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const pad = (n) => n.toString().padStart(2, '0');
  
  // Returns YYYY-MM-DDTHH:mm
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}