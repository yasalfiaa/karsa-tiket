import React, { useState, useEffect } from 'react';
import { TicketPlus, Ticket, RefreshCw } from 'lucide-react';
import TiketCard from './TiketCard';
import TiketTabs from './TiketTabs';
import TiketCreateModal from './TiketCreateModal';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { CardSkeleton } from '../../components/common/Skeleton';
import { useToast } from '../../contexts/ToastContext';
import { getTiketList, createTiketTransaction, updateTiketStatus } from '../../services/tiketService';
import { getEvents } from '../../services/eventService';
import { getPembeliList } from '../../services/pembeliService';

export default function TiketList() {
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [pembeliList, setPembeliList] = useState([]);
  const [activeFilter, setActiveFilter] = useState('semua');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal create
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Cancel confirmation dialog
  const [cancellingTicket, setCancellingTicket] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const { toastSuccess, toastError } = useToast();

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ticketData, eventData, buyerData] = await Promise.all([
        getTiketList(activeFilter),
        getEvents(),
        getPembeliList()
      ]);
      setTickets(ticketData);
      setEvents(eventData);
      setPembeliList(buyerData);
    } catch (err) {
      setError(err.message);
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [activeFilter]);

  const handleCreateTiket = async (ticketData) => {
    try {
      await createTiketTransaction(ticketData);
      toastSuccess('Tiket berhasil dicatat dengan status Menunggu Bayar.');
      await fetchTickets();
    } catch (err) {
      toastError(err.message);
      throw err;
    }
  };

  const handleMarkLunas = async (ticket) => {
    try {
      await updateTiketStatus(ticket.id, 'lunas');
      toastSuccess(`Pembayaran tiket #${ticket.id.slice(0, 6)} dikonfirmasi LUNAS.`);
      await fetchTickets();
    } catch (err) {
      toastError(err.message);
    }
  };

  const handleMarkHadir = async (ticket) => {
    try {
      await updateTiketStatus(ticket.id, 'hadir');
      toastSuccess(`Peserta "${ticket.pembeli_nama}" berhasil Check-in (Hadir).`);
      await fetchTickets();
    } catch (err) {
      toastError(err.message);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancellingTicket) return;
    setCancelLoading(true);
    try {
      await updateTiketStatus(cancellingTicket.id, 'dibatalkan');
      toastSuccess(`Tiket dibatalkan. Kuota ${cancellingTicket.jumlah} tiket telah dikembalikan ke event.`);
      setCancellingTicket(null);
      await fetchTickets();
    } catch (err) {
      toastError(err.message);
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Kelola Tiket</h2>
          <p style={{ fontSize: '13px', marginTop: '2px' }}>
            Catat pesanan, pelunasan bayar, & check-in peserta
          </p>
        </div>

        <Button
          variant="primary"
          icon={TicketPlus}
          onClick={() => setIsCreateOpen(true)}
          disabled={events.length === 0 || pembeliList.length === 0}
        >
          Pesan Tiket
        </Button>
      </div>

      {/* Status Tabs Filter */}
      <TiketTabs
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />

      {/* Loading Skeleton */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '28px 16px',
            backgroundColor: 'var(--color-danger-light)',
            borderColor: '#FECACA'
          }}
        >
          <p style={{ color: 'var(--color-danger)', fontWeight: 600, marginBottom: '12px' }}>
            {error}
          </p>
          <Button variant="secondary" icon={RefreshCw} onClick={fetchTickets}>
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && tickets.length === 0 && (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '48px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}
          >
            <Ticket size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
              Belum ada tiket {activeFilter !== 'semua' ? `dengan status "${activeFilter}"` : ''}
            </h3>
            <p style={{ fontSize: '13px', maxWidth: '300px' }}>
              {events.length === 0
                ? 'Tambahkan event terlebih dahulu di menu Event.'
                : pembeliList.length === 0
                ? 'Daftarkan pembeli terlebih dahulu di menu Pembeli.'
                : 'Mulai catat pemesanan tiket untuk penonton/peserta acara.'}
            </p>
          </div>
          {events.length > 0 && pembeliList.length > 0 && (
            <Button variant="primary" icon={TicketPlus} onClick={() => setIsCreateOpen(true)} style={{ marginTop: '8px' }}>
              Buat Tiket Baru
            </Button>
          )}
        </div>
      )}

      {/* Tickets List */}
      {!loading && !error && tickets.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tickets.map((t) => (
            <TiketCard
              key={t.id}
              tiket={t}
              onMarkLunas={handleMarkLunas}
              onMarkHadir={handleMarkHadir}
              onCancel={(item) => setCancellingTicket(item)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <TiketCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreateTiket}
        events={events}
        pembeliList={pembeliList}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(cancellingTicket)}
        onClose={() => setCancellingTicket(null)}
        onConfirm={handleConfirmCancel}
        title="Batalkan Pesanan Tiket"
        message={`Apakah Anda yakin ingin membatalkan pesanan ${cancellingTicket?.jumlah} tiket atas nama ${cancellingTicket?.pembeli_nama}? Kuota tiket akan otomatis dikembalikan ke event.`}
        confirmText="Ya, Batalkan Tiket"
        loading={cancelLoading}
      />
    </div>
  );
}
