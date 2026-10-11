import React, { useState } from 'react';
import { ToastProvider } from './contexts/ToastContext';
import TopNavbar from './components/common/TopNavbar';
import BottomNav from './components/common/BottomNav';
import EventList from './features/event/EventList';
import PembeliList from './features/pembeli/PembeliList';
import TiketList from './features/tiket/TiketList';
import RekapView from './features/rekap/RekapView';

export default function App() {
  const [activeTab, setActiveTab] = useState('event');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataChanged = () => {
    setRefreshKey((k) => k + 1);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'event':
        return <EventList key={refreshKey} />;
      case 'pembeli':
        return <PembeliList key={refreshKey} />;
      case 'tiket':
        return <TiketList key={refreshKey} />;
      case 'rekap':
        return <RekapView key={refreshKey} />;
      default:
        return <EventList key={refreshKey} />;
    }
  };

  return (
    <ToastProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Header with Instant Demo Tool */}
        <TopNavbar onDataChanged={handleDataChanged} />

        {/* Main Content Area (Mobile Container) */}
        <main className="container animate-fade-in" style={{ flex: 1, padding: '16px' }}>
          {renderActiveTab()}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </ToastProvider>
  );
}
