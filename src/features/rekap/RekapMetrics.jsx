import React from 'react';
import { DollarSign, Ticket, Users, UserCheck } from 'lucide-react';
import { formatRupiah } from '../../utils/formatter';

export default function RekapMetrics({ rekap }) {
  const cards = [
    {
      title: 'Total Pendapatan',
      value: formatRupiah(rekap.total_pendapatan),
      subtitle: 'Dari tiket lunas & hadir',
      icon: DollarSign,
      color: '#059669',
      bg: '#D1FAE5'
    },
    {
      title: 'Tiket Terjual',
      value: `${rekap.tiket_terjual} / ${rekap.kuota}`,
      subtitle: `${rekap.percent_terjual}% kapasitas`,
      icon: Ticket,
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-light)'
    },
    {
      title: 'Sisa Kuota',
      value: `${rekap.sisa_kuota} Tiket`,
      subtitle: rekap.sisa_kuota === 0 ? 'Tiket Habis!' : 'Masih tersedia',
      icon: Users,
      color: rekap.sisa_kuota === 0 ? '#DC2626' : '#4355B9',
      bg: rekap.sisa_kuota === 0 ? '#FEE2E2' : '#EEF3FA'
    },
    {
      title: 'Peserta Hadir',
      value: `${rekap.total_hadir} Orang`,
      subtitle: `${rekap.tiket_terjual > 0 ? Math.round((rekap.total_hadir / rekap.tiket_terjual) * 100) : 0}% check-in rate`,
      icon: UserCheck,
      color: '#7C3AED',
      bg: '#EDE9FE'
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px'
      }}
    >
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className="card"
            style={{
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                {c.title}
              </span>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: c.bg,
                  color: c.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={15} />
              </div>
            </div>

            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>
              {c.value}
            </div>

            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              {c.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
}
