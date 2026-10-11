import React from 'react';
import { Ticket, User, CheckCircle2, UserCheck, XCircle } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { formatRupiah } from '../../utils/formatter';

export default function TiketCard({ tiket, onMarkLunas, onMarkHadir, onCancel }) {
  const isMenunggu = tiket.status === 'menunggu_bayar';
  const isLunas = tiket.status === 'lunas';
  const isHadir = tiket.status === 'hadir';
  const isBatal = tiket.status === 'dibatalkan';

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        borderLeft: `4px solid ${
          isLunas ? 'var(--color-status-lunas-text)' :
          isHadir ? 'var(--color-status-hadir-text)' :
          isMenunggu ? 'var(--color-status-menunggu-text)' : 'var(--color-status-batal-text)'
        }`
      }}
    >
      {/* Top Bar: Event Name & Status Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
            ID: #{tiket.id.slice(0, 8).toUpperCase()}
          </span>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)', marginTop: '2px' }}>
            {tiket.event_nama}
          </h3>
        </div>
        <Badge status={tiket.status} />
      </div>

      {/* Body: Buyer, Quantity, Total */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          padding: '10px 12px',
          backgroundColor: 'var(--color-border-subtle)',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px'
        }}
      >
        <div>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 600 }}>
            <User size={12} /> Pembeli
          </span>
          <span style={{ fontWeight: 700, color: 'var(--color-text-main)', marginTop: '2px', display: 'block' }}>
            {tiket.pembeli_nama}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            +{tiket.pembeli_id}
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 600 }}>
            <Ticket size={12} /> {tiket.jumlah} Tiket
          </span>
          <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '15px', marginTop: '2px', display: 'block' }}>
            {formatRupiah(tiket.total_harga)}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            @{formatRupiah(tiket.harga_satuan)}
          </span>
        </div>
      </div>

      {/* Action Buttons depending on status */}
      {(isMenunggu || isLunas) && (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '4px' }}>
          {isMenunggu && (
            <>
              <Button
                variant="danger-outline"
                size="sm"
                icon={XCircle}
                onClick={() => onCancel(tiket)}
              >
                Batalkan
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={CheckCircle2}
                style={{ backgroundColor: '#059669', borderColor: '#059669' }}
                onClick={() => onMarkLunas(tiket)}
              >
                Konfirmasi Lunas
              </Button>
            </>
          )}

          {isLunas && (
            <Button
              variant="primary"
              size="sm"
              icon={UserCheck}
              onClick={() => onMarkHadir(tiket)}
            >
              Check-in (Hadir)
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
