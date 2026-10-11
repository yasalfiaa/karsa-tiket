import React from 'react';

export default function RekapProgressBar({ terjual, kuota, percent }) {
  const isPenuh = terjual >= kuota;

  return (
    <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
        <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
          Keterisian Kuota Acara
        </span>
        <span style={{ fontWeight: 700, color: isPenuh ? 'var(--color-danger)' : 'var(--color-primary)' }}>
          {terjual} dari {kuota} tiket ({percent}%)
        </span>
      </div>

      <div
        style={{
          height: '10px',
          backgroundColor: 'var(--color-border)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            background: isPenuh ? 'var(--color-danger)' : 'var(--gradient-brand)',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.4s ease'
          }}
        />
      </div>
    </div>
  );
}
