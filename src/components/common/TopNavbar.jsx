import React from 'react';
import { Ticket } from 'lucide-react';

export default function TopNavbar() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 800,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Ticket size={20} color="#1E2538" />
          </div>
          <div>
            <h1
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--color-text-main)',
                letterSpacing: '-0.03em',
                lineHeight: 1.1
              }}
            >
              Karsa Tiket
            </h1>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Tiketing Komunitas Kreatif
            </span>
          </div>
        </div>

        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)'
          }}
        >
          Sesi 3 Bootcamp
        </span>
      </div>
    </header>
  );
}
