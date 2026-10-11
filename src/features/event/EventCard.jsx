import React from 'react';
import { Calendar, MapPin, Tag, Users, Edit2, Trash2 } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { formatRupiah, formatTanggal } from '../../utils/formatter';

export default function EventCard({ event, onEdit, onDelete }) {
  const isHabis = event.tiket_terjual >= event.kuota;
  const sisaKuota = Math.max(0, event.kuota - event.tiket_terjual);
  const percentSold = Math.min(100, Math.round((event.tiket_terjual / event.kuota) * 100));

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header: Title & Availability Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-main)' }}>
            {event.nama}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
            <Calendar size={14} color="var(--color-primary)" />
            <span>{formatTanggal(event.tanggal)}</span>
          </div>
        </div>

        {isHabis ? (
          <Badge status="habis" text="Habis" />
        ) : (
          <Badge status="tersedia" text={`Sisa ${sisaKuota}`} />
        )}
      </div>

      {/* Details: Lokasi & Harga */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={14} color="var(--color-text-light)" />
          <span style={{ color: 'var(--color-text-muted)' }}>{event.lokasi}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--color-primary)', fontSize: '15px' }}>
          <Tag size={15} />
          <span>{formatRupiah(event.harga)} / tiket</span>
        </div>
      </div>

      {/* Capacity Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Kapasitas Terisi</span>
          <span style={{ color: 'var(--color-text-main)' }}>
            {event.tiket_terjual} / {event.kuota} ({percentSold}%)
          </span>
        </div>
        <div
          style={{
            height: '8px',
            backgroundColor: 'var(--color-border)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${percentSold}%`,
              background: isHabis ? 'var(--color-danger)' : 'var(--gradient-brand)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '6px', borderTop: '1px solid var(--color-border-subtle)' }}>
        <Button
          variant="secondary"
          size="sm"
          icon={Edit2}
          onClick={() => onEdit(event)}
        >
          Ubah
        </Button>
        <Button
          variant="danger-outline"
          size="sm"
          icon={Trash2}
          onClick={() => onDelete(event)}
        >
          Hapus
        </Button>
      </div>
    </div>
  );
}
