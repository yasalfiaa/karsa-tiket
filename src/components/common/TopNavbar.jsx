import React, { useState } from 'react';
import { Ticket, Sparkles, Trash2 } from 'lucide-react';
import { localDB } from '../../services/storageEngine';
import { useToast } from '../../contexts/ToastContext';

export default function TopNavbar({ onDataChanged }) {
  const { toastSuccess, toastInfo } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSeed = () => {
    setLoading(true);
    localDB.seedData();
    toastSuccess('Data sampel (2 Event, 3 Pembeli, 4 Tiket) berhasil dimuat!');
    setLoading(false);
    if (onDataChanged) onDataChanged();
    else window.location.reload();
  };

  const handleReset = () => {
    if (window.confirm('Reset dan bersihkan seluruh data lokal?')) {
      localDB.clearData();
      toastInfo('Seluruh data lokal telah dibersihkan.');
      if (onDataChanged) onDataChanged();
      else window.location.reload();
    }
  };

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
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <Ticket size={18} color="#1E2538" />
          </div>
          <div>
            <h1
              style={{
                fontSize: '17px',
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

        {/* Quick Demo & Evaluation Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handleSeed}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-brand)',
              color: 'var(--color-text-main)',
              fontSize: '11px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)',
              transition: 'transform 0.15s ease'
            }}
            title="Muat data sampel instan (Event, Pembeli, Tiket)"
          >
            <Sparkles size={13} />
            <span>Isi Data Demo</span>
          </button>

          <button
            onClick={handleReset}
            style={{
              padding: '6px 8px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-border-subtle)',
              color: 'var(--color-text-muted)',
              fontSize: '11px',
              border: 'none',
              cursor: 'pointer'
            }}
            title="Bersihkan Data"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </header>
  );
}
