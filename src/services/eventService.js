import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'event';

/**
 * Fetch list of events directly from Cloud Firestore ordered by tanggal asc
 */
export async function getEvents() {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('tanggal', 'asc'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
  } catch (error) {
    console.error('Error fetching events from Firestore:', error);
    throw new Error(`Gagal memuat event dari Firestore: ${error.message}`);
  }
}

/**
 * Create a new event directly in Cloud Firestore
 */
export async function createEvent({ nama, tanggal, lokasi, harga, kuota }) {
  if (!nama || !nama.trim()) {
    throw new Error('Nama event wajib diisi.');
  }
  if (!tanggal) {
    throw new Error('Tanggal event wajib diisi.');
  }
  if (!lokasi || !lokasi.trim()) {
    throw new Error('Lokasi event wajib diisi.');
  }

  const numHarga = Number(harga);
  if (isNaN(numHarga) || numHarga < 0) {
    throw new Error('Harga tiket tidak boleh bernilai negatif.');
  }

  const numKuota = Number(kuota);
  if (isNaN(numKuota) || numKuota <= 0 || !Number.isInteger(numKuota)) {
    throw new Error('Kuota event minimal harus bernilai 1 tiket.');
  }

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      nama: nama.trim(),
      tanggal,
      lokasi: lokasi.trim(),
      harga: numHarga,
      kuota: numKuota,
      tiket_terjual: 0,
      dibuat_pada: serverTimestamp()
    });

    return {
      id: docRef.id,
      nama: nama.trim(),
      tanggal,
      lokasi: lokasi.trim(),
      harga: numHarga,
      kuota: numKuota,
      tiket_terjual: 0
    };
  } catch (error) {
    console.error('Error creating event in Firestore:', error);
    throw new Error(`Gagal menyimpan event ke Firestore: ${error.message}`);
  }
}

/**
 * Update existing event in Cloud Firestore
 */
export async function updateEvent(eventId, { nama, tanggal, lokasi, harga, kuota }) {
  if (!eventId) throw new Error('ID event tidak valid.');

  const numHarga = Number(harga);
  const numKuota = Number(kuota);

  if (isNaN(numHarga) || numHarga < 0) {
    throw new Error('Harga tiket tidak boleh bernilai negatif.');
  }
  if (isNaN(numKuota) || numKuota <= 0 || !Number.isInteger(numKuota)) {
    throw new Error('Kuota event minimal harus bernilai 1 tiket.');
  }

  const eventRef = doc(db, COLLECTION_NAME, eventId);
  const snap = await getDoc(eventRef);
  if (!snap.exists()) {
    throw new Error('Event tidak ditemukan di Firestore.');
  }

  const currentData = snap.data();
  if (numKuota < currentData.tiket_terjual) {
    throw new Error(
      `Kuota tidak boleh lebih kecil dari jumlah tiket yang sudah terjual (${currentData.tiket_terjual} tiket).`
    );
  }

  try {
    await updateDoc(eventRef, {
      nama: nama.trim(),
      tanggal,
      lokasi: lokasi.trim(),
      harga: numHarga,
      kuota: numKuota
    });
    return { id: eventId, ...currentData, nama, tanggal, lokasi, harga: numHarga, kuota: numKuota };
  } catch (error) {
    console.error('Error updating event in Firestore:', error);
    throw new Error(`Gagal memperbarui data event di Firestore: ${error.message}`);
  }
}

/**
 * Delete event directly from Cloud Firestore with Relational Integrity Protection
 */
export async function deleteEvent(eventId) {
  if (!eventId) throw new Error('ID event tidak valid.');

  const eventRef = doc(db, COLLECTION_NAME, eventId);
  const snap = await getDoc(eventRef);
  if (!snap.exists()) {
    throw new Error('Event tidak ditemukan di Firestore.');
  }

  const data = snap.data();
  if (data.tiket_terjual > 0) {
    throw new Error(
      `Event "${data.nama}" tidak dapat dihapus karena sudah memiliki ${data.tiket_terjual} tiket terjual.`
    );
  }

  try {
    await deleteDoc(eventRef);
    return true;
  } catch (error) {
    console.error('Error deleting event in Firestore:', error);
    throw new Error(`Gagal menghapus event di Firestore: ${error.message}`);
  }
}
