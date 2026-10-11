import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  limit,
  where,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { isFirebaseConfigured, localDB } from './storageEngine';

const COLLECTION_NAME = 'tiket';

/**
 * Fetch tickets with optional status filtering
 */
export async function getTiketList(statusFilter = 'semua') {
  if (!isFirebaseConfigured) {
    let tickets = localDB.getTiket();
    if (statusFilter && statusFilter !== 'semua') {
      tickets = tickets.filter((t) => t.status === statusFilter);
    }
    return tickets.sort((a, b) => (b.dibuat_pada?.seconds || 0) - (a.dibuat_pada?.seconds || 0));
  }

  try {
    let q;
    if (statusFilter && statusFilter !== 'semua') {
      q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', statusFilter),
        limit(50)
      );
    } else {
      q = query(
        collection(db, COLLECTION_NAME),
        orderBy('dibuat_pada', 'desc'),
        limit(50)
      );
    }

    const snapshot = await getDocs(q);
    const results = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    if (statusFilter && statusFilter !== 'semua') {
      results.sort((a, b) => {
        const timeA = a.dibuat_pada?.seconds || 0;
        const timeB = b.dibuat_pada?.seconds || 0;
        return timeB - timeA;
      });
    }

    return results;
  } catch (error) {
    console.error('Error fetching tiket from Firestore, using local fallback:', error);
    let tickets = localDB.getTiket();
    if (statusFilter && statusFilter !== 'semua') {
      tickets = tickets.filter((t) => t.status === statusFilter);
    }
    return tickets;
  }
}

/**
 * Create a new ticket transaction atomically using runTransaction (Anti-Overbooking)
 */
export async function createTiketTransaction({ event_id, pembeli_id, jumlah }) {
  if (!event_id) throw new Error('Pilih event terlebih dahulu.');
  if (!pembeli_id) throw new Error('Pilih pembeli terlebih dahulu.');

  const numJumlah = Number(jumlah);
  if (isNaN(numJumlah) || numJumlah < 1 || numJumlah > 5 || !Number.isInteger(numJumlah)) {
    throw new Error('Jumlah tiket harus berupa bilangan bulat antara 1 sampai 5.');
  }

  if (!isFirebaseConfigured) {
    const events = localDB.getEvents();
    const pembeliList = localDB.getPembeli();
    const tickets = localDB.getTiket();

    const eventIdx = events.findIndex((e) => e.id === event_id);
    if (eventIdx === -1) throw new Error('Event yang dipilih tidak ditemukan.');

    const pembeli = pembeliList.find((p) => p.noWhatsapp === pembeli_id);
    if (!pembeli) throw new Error('Pembeli yang dipilih tidak ditemukan.');

    const eventData = events[eventIdx];
    const sisaKuota = eventData.kuota - eventData.tiket_terjual;
    if (numJumlah > sisaKuota) {
      throw new Error(`Sisa kuota tidak mencukupi (tersisa ${Math.max(0, sisaKuota)} tiket).`);
    }

    const totalHarga = eventData.harga * numJumlah;
    const newTiket = {
      id: 'tkt-' + Date.now(),
      event_id,
      event_nama: eventData.nama,
      pembeli_id,
      pembeli_nama: pembeli.nama,
      jumlah: numJumlah,
      harga_satuan: eventData.harga,
      total_harga: totalHarga,
      status: 'menunggu_bayar',
      dibuat_pada: { seconds: Math.floor(Date.now() / 1000) }
    };

    // Update event quota atomically in memory
    events[eventIdx].tiket_terjual += numJumlah;
    tickets.unshift(newTiket);

    localDB.saveEvents(events);
    localDB.saveTiket(tickets);

    return newTiket;
  }

  const eventRef = doc(db, 'event', event_id);
  const pembeliRef = doc(db, 'pembeli', pembeli_id);
  const newTiketRef = doc(collection(db, COLLECTION_NAME));

  try {
    const result = await runTransaction(db, async (transaction) => {
      const eventSnap = await transaction.get(eventRef);
      if (!eventSnap.exists()) {
        throw new Error('Event yang dipilih tidak ditemukan.');
      }

      const pembeliSnap = await transaction.get(pembeliRef);
      if (!pembeliSnap.exists()) {
        throw new Error('Pembeli yang dipilih tidak ditemukan.');
      }

      const eventData = eventSnap.data();
      const pembeliData = pembeliSnap.data();

      const sisaKuota = eventData.kuota - eventData.tiket_terjual;
      if (numJumlah > sisaKuota) {
        throw new Error(`Sisa kuota tidak mencukupi (tersisa ${Math.max(0, sisaKuota)} tiket).`);
      }

      const totalHarga = eventData.harga * numJumlah;

      const tiketData = {
        event_id,
        event_nama: eventData.nama,
        pembeli_id,
        pembeli_nama: pembeliData.nama,
        jumlah: numJumlah,
        harga_satuan: eventData.harga,
        total_harga: totalHarga,
        status: 'menunggu_bayar',
        dibuat_pada: serverTimestamp()
      };

      transaction.set(newTiketRef, tiketData);
      transaction.update(eventRef, {
        tiket_terjual: eventData.tiket_terjual + numJumlah
      });

      return {
        id: newTiketRef.id,
        ...tiketData
      };
    });

    return result;
  } catch (error) {
    console.error('Error during createTiketTransaction:', error);
    throw error;
  }
}

/**
 * Update ticket status with strict state machine and quota refund on cancellation
 */
export async function updateTiketStatus(tiketId, newStatus) {
  if (!tiketId) throw new Error('ID tiket tidak valid.');

  if (!isFirebaseConfigured) {
    const tickets = localDB.getTiket();
    const events = localDB.getEvents();

    const tIdx = tickets.findIndex((t) => t.id === tiketId);
    if (tIdx === -1) throw new Error('Tiket tidak ditemukan.');

    const currentTiket = tickets[tIdx];
    const currentStatus = currentTiket.status;

    if (currentStatus === 'hadir' || currentStatus === 'dibatalkan') {
      throw new Error(`Tiket dengan status "${currentStatus}" bersifat final dan tidak dapat diubah lagi.`);
    }

    if (currentStatus === 'menunggu_bayar') {
      if (newStatus === 'hadir') {
        throw new Error('Tiket menunggu bayar tidak dapat langsung check-in (harus berstatus lunas terlebih dahulu).');
      }

      if (newStatus === 'lunas') {
        tickets[tIdx].status = 'lunas';
        localDB.saveTiket(tickets);
        return tickets[tIdx];
      }

      if (newStatus === 'dibatalkan') {
        // Return quota
        const eIdx = events.findIndex((e) => e.id === currentTiket.event_id);
        if (eIdx !== -1) {
          events[eIdx].tiket_terjual = Math.max(0, events[eIdx].tiket_terjual - currentTiket.jumlah);
          localDB.saveEvents(events);
        }
        tickets[tIdx].status = 'dibatalkan';
        localDB.saveTiket(tickets);
        return tickets[tIdx];
      }
    }

    if (currentStatus === 'lunas') {
      if (newStatus === 'dibatalkan') {
        throw new Error('Tiket yang sudah berstatus lunas tidak dapat dibatalkan.');
      }
      if (newStatus === 'hadir') {
        tickets[tIdx].status = 'hadir';
        localDB.saveTiket(tickets);
        return tickets[tIdx];
      }
    }

    throw new Error(`Perubahan status dari "${currentStatus}" ke "${newStatus}" tidak sah.`);
  }

  const tiketRef = doc(db, COLLECTION_NAME, tiketId);
  const snap = await getDoc(tiketRef);
  if (!snap.exists()) {
    throw new Error('Tiket tidak ditemukan.');
  }

  const currentTiket = snap.data();
  const currentStatus = currentTiket.status;

  if (currentStatus === 'hadir' || currentStatus === 'dibatalkan') {
    throw new Error(`Tiket dengan status "${currentStatus}" bersifat final dan tidak dapat diubah lagi.`);
  }

  if (currentStatus === 'menunggu_bayar') {
    if (newStatus === 'hadir') {
      throw new Error('Tiket menunggu bayar tidak dapat langsung check-in (harus berstatus lunas terlebih dahulu).');
    }

    if (newStatus === 'lunas') {
      await updateDoc(tiketRef, { status: 'lunas' });
      return { id: tiketId, ...currentTiket, status: 'lunas' };
    }

    if (newStatus === 'dibatalkan') {
      const eventRef = doc(db, 'event', currentTiket.event_id);
      await runTransaction(db, async (transaction) => {
        const eventSnap = await transaction.get(eventRef);
        if (eventSnap.exists()) {
          const currentEvent = eventSnap.data();
          const newTerjual = Math.max(0, currentEvent.tiket_terjual - currentTiket.jumlah);
          transaction.update(eventRef, { tiket_terjual: newTerjual });
        }
        transaction.update(tiketRef, { status: 'dibatalkan' });
      });

      return { id: tiketId, ...currentTiket, status: 'dibatalkan' };
    }
  }

  if (currentStatus === 'lunas') {
    if (newStatus === 'dibatalkan') {
      throw new Error('Tiket yang sudah berstatus lunas tidak dapat dibatalkan.');
    }

    if (newStatus === 'hadir') {
      await updateDoc(tiketRef, { status: 'hadir' });
      return { id: tiketId, ...currentTiket, status: 'hadir' };
    }
  }

  throw new Error(`Perubahan status dari "${currentStatus}" ke "${newStatus}" tidak sah.`);
}
