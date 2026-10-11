import React from 'react';
import { Search, X } from 'lucide-react';

export default function PembeliSearch({ value, onChange }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }}
    >
      <Search
        size={18}
        color="var(--color-text-light)"
        style={{ position: 'absolute', left: '12px' }}
      />
      <input
        type="text"
        placeholder="Cari pembeli (nama atau no. WhatsApp)..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 36px 10px 38px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          fontSize: '14px',
          outline: 'none',
          boxShadow: 'var(--shadow-xs)'
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
