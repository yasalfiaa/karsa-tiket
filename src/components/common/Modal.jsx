import React, { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '500px' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(30, 37, 56, 0.55)',
        backdropFilter: 'blur(6px)',
        zIndex: 1100, // Higher than BottomNav (900)
        display: 'flex',
        alignItems: 'flex-start', // Start from top to avoid cutoff on small screens
        justifyContent: 'center',
        padding: '24px 16px',
        overflowY: 'auto', // Allow scrolling entire page if screen height is very small
        WebkitOverflowScrolling: 'touch',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth,
          maxHeight: 'calc(100vh - 48px)', // Constrain height to viewport
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-float)',
          margin: 'auto 0', // Center vertically when space permits, scrollable when not
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Sticky at top of modal) */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--gradient-card)',
            flexShrink: 0
          }}
        >
          <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Content (Scrollable with smooth scrolling & visible scrollbar) */}
        <div
          style={{
            padding: '20px',
            overflowY: 'auto',
            flex: '1 1 auto', // Ensures flex child takes available space and activates scroll
            minHeight: 0,     // Essential for flex child scrolling
            WebkitOverflowScrolling: 'touch',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
