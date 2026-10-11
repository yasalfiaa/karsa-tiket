import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { formatRupiah } from '../../utils/formatter';

export default function TiketCreateModal({ isOpen, onClose, onSave, events = [], pembeliList = [] }) {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedPembeliId, setSelectedPembeliId] = useState('');
  const [jumlah, setJumlah] = useState('1');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Auto select first available event with remaining quota
      const availableEvent = events.find((e) => (e.kuota - e.tiket_terjual) > 0);
      setSelectedEventId(availableEvent ? availableEvent.id : (events[0]?.id || ''));
      setSelectedPembeliId(pembeliList[0]?.noWhatsapp || '');
      setJumlah('1');
      setErrors({});
    }
  }, [isOpen, events, pembeliList]);

  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const sisaKuota = selectedEvent ? Math.max(0, selectedEvent.kuota - selectedEvent.tiket_terjual) : 0;
  const numJumlah = Number(jumlah) || 0;
  const calculatedTotal = selectedEvent ? selectedEvent.harga * numJumlah : 0;

  const validate = () => {
    const errs = {};
    if (!selectedEventId) errs.event = 'Pilih event terlebih dahulu.';
    if (!selectedPembeliId) errs.pembeli = 'Pilih pembeli terlebih dahulu.';

    if (!numJumlah || numJumlah < 1 || numJumlah > 5 || !Number.isInteger(numJumlah)) {
      errs.jumlah = 'Jumlah tiket minimal 1 dan maksimal 5.';
    } else if (numJumlah > sisaKuota) {
      errs.jumlah = `Jumlah melebihi sisa kuota (tersisa ${sisaKuota} tiket).`;
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
        event_id: selectedEventId,
        pembeli_id: selectedPembeliId,
        jumlah: numJumlah
      });
      onClose();
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pesan Tiket Baru">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {errors.submit && (
          <div style={{ padding: '10px 12px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
            {errors.submit}
          </div>
        )}

        {/* Pilih Event */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Pilih Event <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${errors.event ? 'var(--color-danger)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'var(--color-surface)'
            }}
          >
            {events.length === 0 && <option value="">Belum ada event</option>}
            {events.map((evt) => {
              const sisa = Math.max(0, evt.kuota - evt.tiket_terjual);
              return (
                <option key={evt.id} value={evt.id} disabled={sisa <= 0}>
                  {evt.nama} — {formatRupiah(evt.harga)} (Sisa: {sisa})
                </option>
              );
            })}
          </select>
          {errors.event && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.event}</span>}
        </div>

        {/* Pilih Pembeli */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Pilih Pembeli <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <select
            value={selectedPembeliId}
            onChange={(e) => setSelectedPembeliId(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${errors.pembeli ? 'var(--color-danger)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'var(--color-surface)'
            }}
          >
            {pembeliList.length === 0 && <option value="">Belum ada pembeli terdaftar</option>}
            {pembeliList.map((p) => (
              <option key={p.noWhatsapp} value={p.noWhatsapp}>
                {p.nama} (+{p.noWhatsapp})
              </option>
            ))}
          </select>
          {errors.pembeli && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.pembeli}</span>}
        </div>

        {/* Jumlah Tiket */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600 }}>
              Jumlah Tiket (1 - 5) <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Sisa kuota: <strong>{sisaKuota}</strong>
            </span>
          </div>
          <input
            type="number"
            min="1"
            max={Math.min(5, Math.max(1, sisaKuota))}
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${errors.jumlah ? 'var(--color-danger)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          {errors.jumlah && <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.jumlah}</span>}
        </div>

        {/* Ringkasan Total */}
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600 }}>Total Pembayaran</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>
              Status awal: Menunggu Bayar
            </span>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)' }}>
            {formatRupiah(calculatedTotal)}
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" variant="primary" loading={loading} disabled={sisaKuota <= 0}>
            Simpan Tiket
          </Button>
        </div>
      </form>
    </Modal>
  );
}
