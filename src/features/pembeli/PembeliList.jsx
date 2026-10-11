import React, { useState, useEffect } from 'react';
import { UserPlus, MessageCircle, Mail, Edit2, Trash2, UsersRound, RefreshCw } from 'lucide-react';
import PembeliSearch from './PembeliSearch';
import PembeliFormModal from './PembeliFormModal';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { CardSkeleton } from '../../components/common/Skeleton';
import { useToast } from '../../contexts/ToastContext';
import { getPembeliList, createPembeli, updatePembeli, deletePembeli } from '../../services/pembeliService';

export default function PembeliList() {
  const [pembeliList, setPembeliList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPembeli, setEditingPembeli] = useState(null);

  // Delete
  const [deletingPembeli, setDeletingPembeli] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { toastSuccess, toastError } = useToast();

  const fetchPembeli = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPembeliList();
      setPembeliList(data);
    } catch (err) {
      setError(err.message);
      toastError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPembeli();
  }, []);

  const handleOpenCreate = () => {
    setEditingPembeli(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPembeli(p);
    setIsModalOpen(true);
  };

  const handleSavePembeli = async (formData) => {
    if (editingPembeli) {
      await updatePembeli(editingPembeli.noWhatsapp, formData);
      toastSuccess(`Data pembeli "${formData.nama}" berhasil diperbarui.`);
    } else {
      await createPembeli(formData);
      toastSuccess(`Pembeli "${formData.nama}" berhasil didaftarkan.`);
    }
    await fetchPembeli();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPembeli) return;
    setDeleteLoading(true);
    try {
      await deletePembeli(deletingPembeli.noWhatsapp);
      toastSuccess(`Pembeli "${deletingPembeli.nama}" berhasil dihapus.`);
      setDeletingPembeli(null);
      await fetchPembeli();
    } catch (err) {
      toastError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter based on search query (by name or whatsapp number)
  const filteredList = pembeliList.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.nama && p.nama.toLowerCase().includes(q)) ||
      (p.noWhatsapp && p.noWhatsapp.includes(q))
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Data Pembeli</h2>
          <p style={{ fontSize: '13px', marginTop: '2px' }}>
            Database kontak & pembeli tiket komunitas
          </p>
        </div>

        <Button variant="primary" icon={UserPlus} onClick={handleOpenCreate}>
          Tambah Pembeli
        </Button>
      </div>

      {/* Search Bar */}
      <PembeliSearch value={searchQuery} onChange={setSearchQuery} />

      {/* Loading Skeleton */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
          <Button variant="secondary" icon={RefreshCw} onClick={fetchPembeli}>
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && pembeliList.length === 0 && (
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
            <UsersRound size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
              Belum ada data pembeli
            </h3>
            <p style={{ fontSize: '13px', maxWidth: '300px' }}>
              Daftarkan pembeli pertama saat menerima pesanan via WhatsApp.
            </p>
          </div>
          <Button variant="primary" icon={UserPlus} onClick={handleOpenCreate} style={{ marginTop: '8px' }}>
            Daftarkan Pembeli
          </Button>
        </div>
      )}

      {/* No Search Match */}
      {!loading && !error && pembeliList.length > 0 && filteredList.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '32px 16px' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            Tidak ada pembeli yang cocok dengan kata kunci "{searchQuery}".
          </p>
        </div>
      )}

      {/* Pembeli Contact Cards */}
      {!loading && !error && filteredList.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredList.map((p) => {
            const initial = p.nama ? p.nama.charAt(0).toUpperCase() : '?';
            const waUrl = `https://wa.me/${p.noWhatsapp}`;

            return (
              <div
                key={p.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Avatar Initial */}
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'var(--gradient-brand)',
                      color: 'var(--color-text-main)',
                      fontWeight: 700,
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {initial}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                      {p.nama}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '3px', fontSize: '13px' }}>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#059669',
                          fontWeight: 600
                        }}
                      >
                        <MessageCircle size={14} />
                        +{p.noWhatsapp}
                      </a>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)' }}>
                        <Mail size={13} />
                        {p.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit2}
                    onClick={() => handleOpenEdit(p)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    style={{ color: 'var(--color-danger)' }}
                    onClick={() => setDeletingPembeli(p)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <PembeliFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePembeli}
        initialData={editingPembeli}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingPembeli)}
        onClose={() => setDeletingPembeli(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Data Pembeli"
        message={`Apakah Anda yakin ingin menghapus data pembeli "${deletingPembeli?.nama}"? Pembeli yang memiliki tiket aktif tidak dapat dihapus.`}
        confirmText="Hapus Pembeli"
        loading={deleteLoading}
      />
    </div>
  );
}
