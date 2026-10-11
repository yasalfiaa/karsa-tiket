import React from 'react';
import { Calendar, Users, Ticket, BarChart3 } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'event', label: 'Event', icon: Calendar },
    { id: 'pembeli', label: 'Pembeli', icon: Users },
    { id: 'tiket', label: 'Tiket', icon: Ticket },
    { id: 'rekap', label: 'Rekap', icon: BarChart3 },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--color-border)',
        zIndex: 900,
        boxShadow: '0 -4px 16px rgba(30, 37, 56, 0.06)'
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '8px 12px'
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 16px',
                borderRadius: 'var(--radius-lg)',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                transition: 'all var(--transition-fast)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '12px'
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
