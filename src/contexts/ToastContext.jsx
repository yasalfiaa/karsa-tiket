import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastSuccess = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const toastError = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const toastWarning = useCallback((msg) => addToast(msg, 'warning'), [addToast]);
  const toastInfo = useCallback((msg) => addToast(msg, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toastSuccess, toastError, toastWarning, toastInfo }}>
      {children}
      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '90%',
        maxWidth: '420px',
        pointerEvents: 'none'
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: 500,
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              animation: 'fadeIn 0.2s ease-out forwards',
              backgroundColor: toast.type === 'success' ? '#D1FAE5' :
                               toast.type === 'error' ? '#FEE2E2' :
                               toast.type === 'warning' ? '#FEF3C7' : '#EEF3FA',
              color: toast.type === 'success' ? '#065F46' :
                     toast.type === 'error' ? '#991B1B' :
                     toast.type === 'warning' ? '#92400E' : '#1E3A8A',
              border: `1px solid ${
                toast.type === 'success' ? '#A7F3D0' :
                toast.type === 'error' ? '#FECACA' :
                toast.type === 'warning' ? '#FDE68A' : '#C7D2FE'
              }`
            }}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                marginLeft: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'inherit',
                opacity: 0.7,
                fontSize: '16px'
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
