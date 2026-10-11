import React from 'react';
import Badge from '../../components/common/Badge';
import { formatRupiah } from '../../utils/formatter';

export default function RekapTiketTable({ tiketList = [] }) {
  if (tiketList.length === 0) {
    return null;
  }

  return (
    <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Daftar Tiket Terkait</h3>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
              <th style={{ padding: '8px 6px', fontWeight: 600 }}>Pembeli</th>
              <th style={{ padding: '8px 6px', fontWeight: 600, textAlign: 'center' }}>Jml</th>
              <th style={{ padding: '8px 6px', fontWeight: 600 }}>Total</th>
              <th style={{ padding: '8px 6px', fontWeight: 600, textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tiketList.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                <td style={{ padding: '8px 6px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{t.pembeli_nama}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>+{t.pembeli_id}</div>
                </td>
                <td style={{ padding: '8px 6px', textAlign: 'center', fontWeight: 600 }}>
                  {t.jumlah}
                </td>
                <td style={{ padding: '8px 6px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {formatRupiah(t.total_harga)}
                </td>
                <td style={{ padding: '8px 6px', textAlign: 'right' }}>
                  <Badge status={t.status} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
