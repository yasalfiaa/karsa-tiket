import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { normalizeWhatsApp, isValidEmail } from '../utils/formatter';
import { isFirebaseConfigured, localDB } from './storageEngine';

const COLLECTION_NAME = 'pembeli';

/**
 * Fetch list of buyers ordered by name (up to 20)
 */
export async function getPembeliList() {
  if (!isFirebaseConfigured) {
    const list = localDB.getPembeli();
    return list.sort((a, b) => (a.nama || '').localeCompare(b.nama || ''));
  }

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('nama', 'asc'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
  } catch (error) {
    console.error('Error fetching pembeli from Firestore, using local fallback:', error);
    return localDB.getPembeli();
  }
}

/**
 * Register a new buyer using normalized WhatsApp number as Document ID
 */
export async function createPembeli({ nama, noWhatsapp, email }) {
  if (!nama || nama.trim().length < 2) {
    throw new Error('Nama pembeli minimal 2 karakter.');
  }

  const normalizedWA = normalizeWhatsApp(noWhatsapp);
  if (!normalizedWA || normalizedWA.length < 10) {
    throw new Error('Nomor WhatsApp tidak valid (minimal 10 digit).');
  }

  if (!email || !isValidEmail(email)) {
    throw new Error('Format email tidak valid (harus menyertakan tanda @).');
  }

  const buyerData = {
    id: normalizedWA,
    nama: nama.trim(),
    noWhatsapp: normalizedWA,
    email: email.trim().toLowerCase(),
    dibuat_pada: { seconds: Math.floor(Date.now() / 1000) }
  };

  if (!isFirebaseConfigured) {
    const list = localDB.getPembeli();
    if (list.some((p) => p.noWhatsapp === normalizedWA)) {
      throw new Error('Nomor WhatsApp sudah terdaftar.');
    }
    list.push(buyerData);
    localDB.savePembeli(list);
    return buyerData;
  }

  const pembeliRef = doc(db, COLLECTION_NAME, normalizedWA);
  const snap = await getDoc(pembeliRef);

  if (snap.exists()) {
    throw new Error('Nomor WhatsApp sudah terdaftar.');
  }

  try {
    await setDoc(pembeliRef, {
      ...buyerData,
      dibuat_pada: serverTimestamp()
    });
    return buyerData;
  } catch (error) {
    console.error('Error creating pembeli in Firestore, saving locally:', error);
    const list = localDB.getPembeli();
    list.push(buyerData);
    localDB.savePembeli(list);
    return buyerData;
  }
}

/**
 * Update existing buyer (Nama & Email only, WhatsApp number is immutable Document ID)
 */
export async function updatePembeli(noWhatsapp, { nama, email }) {
  if (!noWhatsapp) throw new Error('Nomor WhatsApp tidak valid.');

  if (!nama || nama.trim().length < 2) {
    throw new Error('Nama pembeli minimal 2 karakter.');
  }
  if (!email || !isValidEmail(email)) {
    throw new Error('Format email tidak valid (harus menyertakan tanda @).');
  }

  if (!isFirebaseConfigured) {
    const list = localDB.getPembeli();
    const idx = list.findIndex((p) => p.noWhatsapp === noWhatsapp);
    if (idx === -1) throw new Error('Data pembeli tidak ditemukan.');

    list[idx] = {
      ...list[idx],
      nama: nama.trim(),
      email: email.trim().toLowerCase()
    };
    localDB.savePembeli(list);
    return list[idx];
  }

  const pembeliRef = doc(db, COLLECTION_NAME, noWhatsapp);
  const snap = await getDoc(pembeliRef);
  if (!snap.exists()) {
    throw new Error('Data pembeli tidak ditemukan.');
  }

  try {
    await updateDoc(pembeliRef, {
      nama: nama.trim(),
      email: email.trim().toLowerCase()
    });
    return { id: noWhatsapp, ...snap.data(), nama: nama.trim(), email: email.trim().toLowerCase() };
  } catch (error) {
    console.error('Error updating pembeli:', error);
    throw new Error('Gagal memperbarui data pembeli.');
  }
}

/**
 * Delete buyer with relational integrity check (Prevent Delete if active tickets exist)
 */
export async function deletePembeli(noWhatsapp) {
  if (!noWhatsapp) throw new Error('Nomor WhatsApp tidak valid.');

  if (!isFirebaseConfigured) {
    const tickets = localDB.getTiket();
    const active = tickets.filter(
      (t) => t.pembeli_id === noWhatsapp && (t.status === 'menunggu_bayar' || t.status === 'lunas' || t.status === 'hadir')
    );
    if (active.length > 0) {
      throw new Error(`Pembeli tidak dapat dihapus karena masih memiliki ${active.length} tiket aktif.`);
    }

    const list = localDB.getPembeli().filter((p) => p.noWhatsapp !== noWhatsapp);
    localDB.savePembeli(list);
    return true;
  }

  const tiketQuery = query(
    collection(db, 'tiket'),
    where('pembeli_id', '==', noWhatsapp)
  );
  const tiketSnap = await getDocs(tiketQuery);

  const activeTickets = tiketSnap.docs.filter((d) => {
    const status = d.data().status;
    return status === 'menunggu_bayar' || status === 'lunas' || status === 'hadir';
  });

  if (activeTickets.length > 0) {
    throw new Error(
      `Pembeli tidak dapat dihapus karena masih memiliki ${activeTickets.length} tiket aktif.`
    );
  }

  try {
    await deleteDoc(doc(db, COLLECTION_NAME, noWhatsapp));
    return true;
  } catch (error) {
    console.error('Error deleting pembeli:', error);
    throw new Error('Gagal menghapus data pembeli.');
  }
}
