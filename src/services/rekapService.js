import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Fetch event summary, financial metrics, and ticket breakdown directly from Cloud Firestore
 */
export async function getRekapEvent(eventId) {
  if (!eventId) throw new Error('ID event tidak valid.');

  try {
    // 1. Fetch Event Document
    const eventRef = doc(db, 'event', eventId);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) {
      throw new Error('Event tidak ditemukan di Firestore.');
    }
    const eventData = { id: eventSnap.id, ...eventSnap.data() };

    // 2. Fetch Tickets Document Query
    const tiketQuery = query(
      collection(db, 'tiket'),
      where('event_id', '==', eventId)
    );
    const tiketSnap = await getDocs(tiketQuery);
    const tiketList = tiketSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Sort by timestamp desc
    tiketList.sort((a, b) => {
      const timeA = a.dibuat_pada?.seconds || 0;
      const timeB = b.dibuat_pada?.seconds || 0;
      return timeB - timeA;
    });

    // 3. Compute Metrics
    let totalPendapatan = 0;
    let totalHadir = 0;

    const breakdown = {
      menunggu_bayar: { count: 0, lembar: 0, nominal: 0 },
      lunas: { count: 0, lembar: 0, nominal: 0 },
      hadir: { count: 0, lembar: 0, nominal: 0 },
      dibatalkan: { count: 0, lembar: 0, nominal: 0 }
    };

    tiketList.forEach((t) => {
      const st = t.status || 'menunggu_bayar';
      if (breakdown[st]) {
        breakdown[st].count += 1;
        breakdown[st].lembar += t.jumlah || 0;
        breakdown[st].nominal += t.total_harga || 0;
      }

      // Acceptance Criteria 2: Pendapatan hanya dihitung dari status 'lunas' dan 'hadir'
      if (st === 'lunas' || st === 'hadir') {
        totalPendapatan += t.total_harga || 0;
      }

      if (st === 'hadir') {
        totalHadir += t.jumlah || 0;
      }
    });

    const sisaKuota = Math.max(0, eventData.kuota - eventData.tiket_terjual);
    const percentTerjual = eventData.kuota > 0
      ? Math.min(100, Math.round((eventData.tiket_terjual / eventData.kuota) * 100))
      : 0;

    return {
      event: eventData,
      tiket_terjual: eventData.tiket_terjual,
      kuota: eventData.kuota,
      sisa_kuota: sisaKuota,
      percent_terjual: percentTerjual,
      total_pendapatan: totalPendapatan,
      total_hadir: totalHadir,
      breakdown,
      tiket_list: tiketList
    };
  } catch (error) {
    console.error('Error fetching rekap from Firestore:', error);
    throw new Error(`Gagal memuat rekapitulasi dari Firestore: ${error.message}`);
  }
}
