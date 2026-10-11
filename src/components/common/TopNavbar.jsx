import React, { useState, useEffect } from 'react';
import { Ticket } from 'lucide-react';

export default function TopNavbar() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date());
    setCurrentDate(today);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 800,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
        {/* Brand Logo & Name */}
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
              boxShadow: 'var(--shadow-xs)'
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
                letterSpacing: '-0.02em',
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

        {/* Real-Time Date Text Badge (Clean without icon) */}
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            border: '1px solid rgba(85, 123, 181, 0.15)',
            letterSpacing: '0.01em'
          }}
        >
          {currentDate || 'Hari Ini'}
        </span>
      </div>
    </header>
  );
}
