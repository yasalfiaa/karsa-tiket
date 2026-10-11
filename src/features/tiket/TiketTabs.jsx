import React from 'react';

export default function TiketTabs({ activeFilter, onSelectFilter, counts = {} }) {
  const tabs = [
    { id: 'semua', label: 'Semua', count: counts.semua },
    { id: 'menunggu_bayar', label: 'Menunggu Bayar', count: counts.menunggu_bayar },
    { id: 'lunas', label: 'Lunas', count: counts.lunas },
    { id: 'hadir', label: 'Hadir', count: counts.hadir },
    { id: 'dibatalkan', label: 'Batal', count: counts.dibatalkan },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '4px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectFilter(tab.id)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-surface)',
              color: isActive ? 'var(--color-text-white)' : 'var(--color-text-muted)',
              border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span
                style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--color-border-subtle)',
                  color: isActive ? 'var(--color-text-white)' : 'var(--color-text-main)',
                  fontWeight: 700
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
