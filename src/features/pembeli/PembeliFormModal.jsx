import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { normalizeWhatsApp, isValidEmail } from '../../utils/formatter';

export default function PembeliFormModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    nama: '',
    noWhatsapp: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama: initialData.nama || '',
        noWhatsapp: initialData.noWhatsapp || '',
        email: initialData.email || ''
      });
    } else {
      setFormData({
        nama: '',
        noWhatsapp: '',
        email: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!formData.nama.trim() || formData.nama.trim().length < 2) {
      errs.nama = 'Nama pembeli minimal 2 karakter.';
    }

    if (!initialData) {
      const normalized = normalizeWhatsApp(formData.noWhatsapp);
      if (!normalized || normalized.length < 10) {
        errs.noWhatsapp = 'Nomor WhatsApp minimal 10 digit (contoh: 08123456789).';
      }
    }

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      errs.email = 'Format email tidak valid (harus mengandung tanda @ dan domain sah).';
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
        nama: formData.nama.trim(),
        noWhatsapp: initialData ? initialData.noWhatsapp : normalizeWhatsApp(formData.noWhatsapp),
        email: formData.email.trim().toLowerCase()
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
      title={initialData ? 'Ubah Data Pembeli' : 'Tambah Pembeli Baru'}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px' }}>
        {errors.submit && (
          <div style={{ padding: '10px 12px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
            {errors.submit}
          </div>
        )}

        {/* Nama Pembeli */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Nama Lengkap <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.nama}
            placeholder="Contoh: Budi Santoso"
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

        {/* Nomor WhatsApp */}
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            <span>Nomor WhatsApp {!initialData && <span style={{ color: 'var(--color-danger)' }}>*</span>}</span>
            {initialData && <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: '12px' }}>Terkunci (ID Dokumen)</span>}
          </label>
          <input
            type="text"
            disabled={Boolean(initialData)}
            value={formData.noWhatsapp}
            placeholder="081234567890"
            onChange={(e) => setFormData({ ...formData, noWhatsapp: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${errors.noWhatsapp ? 'var(--color-danger)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: initialData ? 'var(--color-border-subtle)' : 'var(--color-surface)',
              cursor: initialData ? 'not-allowed' : 'text'
            }}
          />
          {errors.noWhatsapp && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.noWhatsapp}</span>}
        </div>

        {/* Email */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Alamat Email <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            placeholder="budi@example.com"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${errors.email ? 'var(--color-danger)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          {errors.email && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {initialData ? 'Simpan Perubahan' : 'Simpan Pembeli'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
