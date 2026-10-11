/**
 * LocalStorage-backed Instant Storage Engine for Fast Development & Evaluation
 * Used automatically when Firebase API key is not configured or in dev mode.
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
  // Event
  getEvents() {
    return getItem(STORAGE_KEYS.EVENT);
  },
  saveEvents(data) {
    setItem(STORAGE_KEYS.EVENT, data);
  },

  // Pembeli
  getPembeli() {
    return getItem(STORAGE_KEYS.PEMBELI);
  },
  savePembeli(data) {
    setItem(STORAGE_KEYS.PEMBELI, data);
  },

  // Tiket
  getTiket() {
    return getItem(STORAGE_KEYS.TIKET);
  },
  saveTiket(data) {
    setItem(STORAGE_KEYS.TIKET, data);
  },

  // Seed sample data for 1-click evaluation
  seedData() {
    const sampleEvents = [
      {
        id: 'evt-senja-indie',
        nama: 'Konser Musik Senja Indie Vol. 3',
        tanggal: '2026-10-25',
        lokasi: 'Amfiteater Taman Budaya, Bandung',
        harga: 75000,
        kuota: 30,
        tiket_terjual: 7,
        dibuat_pada: { seconds: Math.floor(Date.now() / 1000) - 3600 }
      },
      {
        id: 'evt-workshop-sablon',
        nama: 'Workshop Cetak Sablon Cukil Kayu',
        tanggal: '2026-11-05',
        lokasi: 'Studio Seni Kolektif, Jakarta',
        harga: 120000,
        kuota: 15,
        tiket_terjual: 3,
        dibuat_pada: { seconds: Math.floor(Date.now() / 1000) - 7200 }
      }
    ];

    const samplePembeli = [
      {
        id: '6281234567890',
        nama: 'Budi Santoso',
        noWhatsapp: '6281234567890',
        email: 'budi.santoso@gmail.com',
        dibuat_pada: { seconds: Math.floor(Date.now() / 1000) - 5000 }
      },
      {
        id: '6285711223344',
        nama: 'Siti Rahma',
        noWhatsapp: '6285711223344',
        email: 'siti.rahma@kreatif.id',
        dibuat_pada: { seconds: Math.floor(Date.now() / 1000) - 4000 }
      },
      {
        id: '6281987654321',
        nama: 'Andi Pratama',
        noWhatsapp: '6281987654321',
        email: 'andi.pratama@gmail.com',
        dibuat_pada: { seconds: Math.floor(Date.now() / 1000) - 3000 }
      }
    ];

    const sampleTiket = [
      {
        id: 'tkt-001',
        event_id: 'evt-senja-indie',
        event_nama: 'Konser Musik Senja Indie Vol. 3',
        pembeli_id: '6281234567890',
        pembeli_nama: 'Budi Santoso',
        jumlah: 2,
        harga_satuan: 75000,
        total_harga: 150000,
        status: 'hadir',
        dibuat_pada: { seconds: Math.floor(Date.now() / 1000) - 2000 }
      },
      {
        id: 'tkt-002',
        event_id: 'evt-senja-indie',
        event_nama: 'Konser Musik Senja Indie Vol. 3',
        pembeli_id: '6285711223344',
        pembeli_nama: 'Siti Rahma',
        jumlah: 3,
        harga_satuan: 75000,
        total_harga: 225000,
        status: 'lunas',
        dibuat_pada: { seconds: Math.floor(Date.now() / 1000) - 1500 }
      },
      {
        id: 'tkt-003',
        event_id: 'evt-senja-indie',
        event_nama: 'Konser Musik Senja Indie Vol. 3',
        pembeli_id: '6281987654321',
        pembeli_nama: 'Andi Pratama',
        jumlah: 2,
        harga_satuan: 75000,
        total_harga: 150000,
        status: 'menunggu_bayar',
        dibuat_pada: { seconds: Math.floor(Date.now() / 1000) - 1000 }
      },
      {
        id: 'tkt-004',
        event_id: 'evt-workshop-sablon',
        event_nama: 'Workshop Cetak Sablon Cukil Kayu',
        pembeli_id: '6285711223344',
        pembeli_nama: 'Siti Rahma',
        jumlah: 3,
        harga_satuan: 120000,
        total_harga: 360000,
        status: 'lunas',
        dibuat_pada: { seconds: Math.floor(Date.now() / 1000) - 500 }
      }
    ];

    setItem(STORAGE_KEYS.EVENT, sampleEvents);
    setItem(STORAGE_KEYS.PEMBELI, samplePembeli);
    setItem(STORAGE_KEYS.TIKET, sampleTiket);

    return { events: sampleEvents, pembeli: samplePembeli, tiket: sampleTiket };
  },

  clearData() {
    localStorage.removeItem(STORAGE_KEYS.EVENT);
    localStorage.removeItem(STORAGE_KEYS.PEMBELI);
    localStorage.removeItem(STORAGE_KEYS.TIKET);
  }
};
