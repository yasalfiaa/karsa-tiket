import React from 'react';

export default function Badge({ status, text, size = 'sm' }) {
  const getBadgeTheme = (st) => {
    switch (st) {
      case 'menunggu_bayar':
        return {
          bg: 'var(--color-status-menunggu-bg)',
          color: 'var(--color-status-menunggu-text)',
          border: 'var(--color-status-menunggu-border)',
          label: text || 'Menunggu Bayar'
        };
      case 'lunas':
        return {
          bg: 'var(--color-status-lunas-bg)',
          color: 'var(--color-status-lunas-text)',
          border: 'var(--color-status-lunas-border)',
          label: text || 'Lunas'
        };
      case 'hadir':
        return {
          bg: 'var(--color-status-hadir-bg)',
          color: 'var(--color-status-hadir-text)',
          border: 'var(--color-status-hadir-border)',
          label: text || 'Hadir'
        };
      case 'dibatalkan':
        return {
          bg: 'var(--color-status-batal-bg)',
          color: 'var(--color-status-batal-text)',
          border: 'var(--color-status-batal-border)',
          label: text || 'Dibatalkan'
        };
      case 'habis':
        return {
          bg: '#FEE2E2',
          color: '#DC2626',
          border: '#FECACA',
          label: text || 'Habis'
        };
      case 'tersedia':
        return {
          bg: '#E0E7FF',
          color: '#3730A3',
          border: '#C7D2FE',
          label: text || 'Tersedia'
        };
      default:
        return {
          bg: '#F1F5F9',
          color: '#475569',
          border: '#E2E8F0',
          label: text || st
        };
    }
  };

  const theme = getBadgeTheme(status);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: size === 'sm' ? '3px 8px' : '5px 12px',
        fontSize: size === 'sm' ? '12px' : '13px',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        backgroundColor: theme.bg,
        color: theme.color,
        border: `1px solid ${theme.border}`,
        lineHeight: 1.2
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: theme.color
        }}
      />
      {theme.label}
    </span>
  );
}
