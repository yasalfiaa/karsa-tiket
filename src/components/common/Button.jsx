import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  fullWidth = false,
  icon: Icon,
  style = {}
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--color-primary)',
          color: 'var(--color-text-white)',
          border: '1px solid var(--color-primary)'
        };
      case 'secondary':
        return {
          background: 'var(--color-surface)',
          color: 'var(--color-text-main)',
          border: '1px solid var(--color-border)'
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--color-primary)',
          border: '1px solid var(--color-primary)'
        };
      case 'danger':
        return {
          background: 'var(--color-danger)',
          color: 'var(--color-text-white)',
          border: '1px solid var(--color-danger)'
        };
      case 'danger-outline':
        return {
          background: 'transparent',
          color: 'var(--color-danger)',
          border: '1px solid var(--color-danger)'
        };
      case 'accent':
        return {
          background: 'var(--gradient-brand)',
          color: 'var(--color-text-main)',
          border: '1px solid transparent'
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--color-text-muted)',
          border: 'none'
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '13px', borderRadius: 'var(--radius-sm)' };
      case 'lg':
        return { padding: '14px 24px', fontSize: '16px', borderRadius: 'var(--radius-lg)' };
      case 'md':
      default:
        return { padding: '10px 18px', fontSize: '14px', borderRadius: 'var(--radius-md)' };
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled || loading ? 0.6 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all var(--transition-fast)',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style
      }}
    >
      {loading ? (
        <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid currentColor', borderRightColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
      ) : Icon ? (
        <Icon size={18} />
      ) : null}
      {children}
    </button>
  );
}
