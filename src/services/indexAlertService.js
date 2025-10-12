// Service to collect and manage Firestore index alerts (localStorage-backed)

const STORAGE_KEY = 'firestoreIndexAlerts';

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('indexAlertService: failed to read from localStorage', e);
    return [];
  }
}

function write(alerts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  } catch (e) {
    console.warn('indexAlertService: failed to write to localStorage', e);
  }
}

export function recordIndexAlert({ source = 'unknown', message = 'Query requires an index', indexLink = '', path = '', details = {} }) {
  const alerts = read();
  const key = `${source}|${indexLink}`;
  const now = new Date().toISOString();
  const existing = alerts.find(a => a.key === key);
  if (existing) {
    existing.count = (existing.count || 1) + 1;
    existing.lastSeen = now;
    write(alerts);
    return existing;
  }
  const alert = {
    key,
    source,
    message,
    indexLink,
    path,
    count: 1,
    firstSeen: now,
    lastSeen: now,
    details
  };
  alerts.push(alert);
  write(alerts);
  return alert;
}

export function getIndexAlerts() {
  const alerts = read();
  return alerts.sort((a, b) => (b.lastSeen || '').localeCompare(a.lastSeen || ''));
}

export function dismissIndexAlert(key) {
  const alerts = read();
  const next = alerts.filter(a => a.key !== key);
  write(next);
  return next;
}

export function clearIndexAlerts() {
  write([]);
  return [];
}
