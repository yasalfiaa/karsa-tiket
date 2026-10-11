import React from 'react';
import Badge from '../../components/common/Badge';
import { formatRupiah } from '../../utils/formatter';

export default function RekapStatusBreakdown({ breakdown }) {
  const items = [
    { key: 'menunggu_bayar', label: 'Menunggu Bayar', data: breakdown.menunggu_bayar },
    { key: 'lunas', label: 'Lunas', data: breakdown.lunas },
    { key: 'hadir', label: 'Hadir (Check-in)', data: breakdown.hadir },
    { key: 'dibatalkan', label: 'Dibatalkan', data: breakdown.dibatalkan }
  ];

  return (
    <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Rincian Status Tiket</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {items.map((item) => (
          <div
            key={item.key}
            style={{
              padding: '10px 12px',
              backgroundColor: 'var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Badge status={item.key} size="sm" />
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                {item.data.count} transaksi
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                {item.data.lembar} Tiket
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)' }}>
                {formatRupiah(item.data.nominal)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
