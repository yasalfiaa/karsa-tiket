/**
 * LocalStorage-backed Instant Storage Engine
 * Used automatically when Firebase API key is not configured to eliminate network timeouts.
 */

const STORAGE_KEYS = {
  EVENT: 'karsa_tiket_events',
  PEMBELI: 'karsa_tiket_pembeli',
  TIKET: 'karsa_tiket_tickets'
};

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  !import.meta.env.VITE_FIREBASE_API_KEY.includes('Mock')
);

function getItem(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

export const localDB = {
  getEvents() {
    return getItem(STORAGE_KEYS.EVENT);
  },
  saveEvents(data) {
    setItem(STORAGE_KEYS.EVENT, data);
  },
  getPembeli() {
    return getItem(STORAGE_KEYS.PEMBELI);
  },
  savePembeli(data) {
    setItem(STORAGE_KEYS.PEMBELI, data);
  },
  getTiket() {
    return getItem(STORAGE_KEYS.TIKET);
  },
  saveTiket(data) {
    setItem(STORAGE_KEYS.TIKET, data);
  },
  clearData() {
    localStorage.removeItem(STORAGE_KEYS.EVENT);
    localStorage.removeItem(STORAGE_KEYS.PEMBELI);
    localStorage.removeItem(STORAGE_KEYS.TIKET);
  }
};
