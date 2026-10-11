import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, CalendarX } from 'lucide-react';
import EventCard from './EventCard';
import EventFormModal from './EventFormModal';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { CardSkeleton } from '../../components/common/Skeleton';
import { useToast } from '../../contexts/ToastContext';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../services/eventService';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Delete dialog
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { toastSuccess, toastError } = useToast();

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message);
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (formData) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, formData);
      toastSuccess(`Event "${formData.nama}" berhasil diperbarui.`);
    } else {
      await createEvent(formData);
      toastSuccess(`Event "${formData.nama}" berhasil ditambahkan.`);
    }
    await fetchEvents();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEvent) return;
    setDeleteLoading(true);
    try {
      await deleteEvent(deletingEvent.id);
      toastSuccess(`Event "${deletingEvent.nama}" berhasil dihapus.`);
      setDeletingEvent(null);
      await fetchEvents();
    } catch (err) {
      toastError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Daftar Event</h2>
          <p style={{ fontSize: '13px', marginTop: '2px' }}>
            Kelola workshop, konser, dan kuota tiket
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={handleOpenCreate}
        >
          Tambah Event
        </Button>
      </div>

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
            padding: '32px 16px',
            backgroundColor: 'var(--color-danger-light)',
            borderColor: '#FECACA'
          }}
        >
          <p style={{ color: 'var(--color-danger)', fontWeight: 600, marginBottom: '12px' }}>
            {error}
          </p>
          <Button variant="secondary" icon={RefreshCw} onClick={fetchEvents}>
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && events.length === 0 && (
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
            <CalendarX size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
              Belum ada event
            </h3>
            <p style={{ fontSize: '13px', maxWidth: '300px' }}>
              Mulai buat acara pertama Anda untuk membuka penjualan tiket komunitas.
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleOpenCreate} style={{ marginTop: '8px' }}>
            Buat Event Sekarang
          </Button>
        </div>
      )}

      {/* Event Cards List */}
      {!loading && !error && events.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {events.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onEdit={handleOpenEdit}
              onDelete={(item) => setDeletingEvent(item)}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        initialData={editingEvent}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingEvent)}
        onClose={() => setDeletingEvent(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Event"
        message={`Apakah Anda yakin ingin menghapus event "${deletingEvent?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Event"
        loading={deleteLoading}
      />
    </div>
  );
}
