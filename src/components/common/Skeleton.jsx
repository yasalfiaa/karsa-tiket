import React from 'react';

export default function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--radius-md)', style = {} }) {
  return (
    <div
      className="skeleton-shimmer"
      style={{
        width,
        height,
        borderRadius,
        display: 'block',
        ...style
      }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="60%" height="22px" />
        <Skeleton width="25%" height="20px" borderRadius="var(--radius-full)" />
      </div>
      <Skeleton width="40%" height="16px" />
      <Skeleton width="80%" height="14px" />
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <Skeleton width="100px" height="34px" />
        <Skeleton width="80px" height="34px" />
      </div>
    </div>
  );
}
