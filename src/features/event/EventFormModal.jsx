import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';

export default function EventFormModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    nama: '',
    tanggal: '',
    lokasi: '',
    harga: '',
    kuota: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama: initialData.nama || '',
        tanggal: initialData.tanggal || '',
        lokasi: initialData.lokasi || '',
        harga: initialData.harga !== undefined ? String(initialData.harga) : '',
        kuota: initialData.kuota !== undefined ? String(initialData.kuota) : ''
      });
    } else {
      setFormData({
        nama: '',
        tanggal: '',
        lokasi: '',
        harga: '',
        kuota: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.nama.trim()) errs.nama = 'Nama event tidak boleh kosong.';
    if (!formData.tanggal) errs.tanggal = 'Pilih tanggal acara.';
    if (!formData.lokasi.trim()) errs.lokasi = 'Lokasi acara wajib diisi.';

    const hargaNum = Number(formData.harga);
    if (formData.harga === '' || isNaN(hargaNum) || hargaNum < 0) {
      errs.harga = 'Harga harus berupa angka valid minimal Rp 0.';
    }

    const kuotaNum = Number(formData.kuota);
    if (formData.kuota === '' || isNaN(kuotaNum) || kuotaNum <= 0 || !Number.isInteger(kuotaNum)) {
      errs.kuota = 'Kuota harus berupa bilangan bulat positif (minimal 1).';
    } else if (initialData && kuotaNum < initialData.tiket_terjual) {
      errs.kuota = `Kuota tidak boleh lebih kecil dari tiket terjual (${initialData.tiket_terjual}).`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSave({
        ...formData,
        harga: Number(formData.harga),
        kuota: Number(formData.kuota)
      });
      onClose();
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Ubah Data Event' : 'Tambah Event Baru'}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {errors.submit && (
          <div style={{ padding: '10px 12px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
            {errors.submit}
          </div>
        )}

        {/* Nama Event */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Nama Event <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.nama}
            placeholder="Contoh: Konser Senja Indie Vol. 3"
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${errors.nama ? 'var(--color-danger)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          {errors.nama && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.nama}</span>}
        </div>

        {/* Tanggal */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Tanggal Acara <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            type="date"
            value={formData.tanggal}
            onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${errors.tanggal ? 'var(--color-danger)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          {errors.tanggal && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.tanggal}</span>}
        </div>

        {/* Lokasi */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Lokasi Acara <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.lokasi}
            placeholder="Contoh: Ruang Kreatif Kolektif, Bandung"
            onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${errors.lokasi ? 'var(--color-danger)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          {errors.lokasi && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.lokasi}</span>}
        </div>

        {/* Grid: Harga & Kuota */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Harga Tiket (Rp) <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={formData.harga}
              placeholder="50000"
              onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.harga ? 'var(--color-danger)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            {errors.harga && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.harga}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Kuota Tiket <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.kuota}
              placeholder="100"
              onChange={(e) => setFormData({ ...formData, kuota: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${errors.kuota ? 'var(--color-danger)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            {errors.kuota && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.kuota}</span>}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {initialData ? 'Simpan Perubahan' : 'Simpan Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
