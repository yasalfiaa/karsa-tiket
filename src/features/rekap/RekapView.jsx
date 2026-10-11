import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Calendar } from 'lucide-react';
import RekapMetrics from './RekapMetrics';
import RekapProgressBar from './RekapProgressBar';
import RekapStatusBreakdown from './RekapStatusBreakdown';
import RekapTiketTable from './RekapTiketTable';
import Button from '../../components/common/Button';
import { CardSkeleton } from '../../components/common/Skeleton';
import { useToast } from '../../contexts/ToastContext';
import { getEvents } from '../../services/eventService';
import { getRekapEvent } from '../../services/rekapService';
import { formatTanggal } from '../../utils/formatter';

export default function RekapView() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [rekapData, setRekapData] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRekap, setLoadingRekap] = useState(false);
  const [error, setError] = useState(null);

  const { toastError } = useToast();

  // Load events list first
  const fetchEvents = async () => {
    setLoadingEvents(true);
    setError(null);
    try {
      const data = await getEvents();
      setEvents(data);
      if (data.length > 0 && !selectedEventId) {
        setSelectedEventId(data[0].id);
      }
    } catch (err) {
      setError(err.message);
      toastError(err.message);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Load rekap data when event is selected
  const fetchRekap = async (evtId) => {
    if (!evtId) return;
    setLoadingRekap(true);
    setError(null);
    try {
      const data = await getRekapEvent(evtId);
      setRekapData(data);
    } catch (err) {
      setError(err.message);
      toastError(err.message);
    } finally {
      setLoadingRekap(false);
    }
  };

  useEffect(() => {
    if (selectedEventId) {
      fetchRekap(selectedEventId);
    }
  }, [selectedEventId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Rekapitulasi Event</h2>
        <p style={{ fontSize: '13px', marginTop: '2px' }}>
          Analisis pendapatan, kuota terjual, & kehadiran peserta
        </p>
      </div>

      {/* Event Selector Dropdown */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
          PILIH EVENT
        </label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            disabled={loadingEvents || events.length === 0}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: 600,
              outline: 'none',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-main)'
            }}
          >
            {events.length === 0 && <option value="">Belum ada event</option>}
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.nama} ({formatTanggal(evt.tanggal)})
              </option>
            ))}
          </select>

          <Button
            variant="secondary"
            size="md"
            icon={RefreshCw}
            onClick={() => fetchRekap(selectedEventId)}
            loading={loadingRekap}
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {loadingRekap && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {/* Error State */}
      {!loadingRekap && error && (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '28px 16px',
            backgroundColor: 'var(--color-danger-light)',
            borderColor: '#FECACA'
          }}
        >
          <p style={{ color: 'var(--color-danger)', fontWeight: 600, marginBottom: '12px' }}>
            {error}
          </p>
          <Button variant="secondary" icon={RefreshCw} onClick={() => fetchRekap(selectedEventId)}>
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Empty State: Belum ada event sama sekali */}
      {!loadingEvents && events.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <BarChart3 size={36} color="var(--color-text-light)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Belum ada data event</h3>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>
            Buat event terlebih dahulu untuk melihat rekapitulasi data penjualan.
          </p>
        </div>
      )}

      {/* Rekapitulasi Content */}
      {!loadingRekap && !error && rekapData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 4 Stat Cards */}
          <RekapMetrics rekap={rekapData} />

          {/* Progress Bar Keterisian Kuota */}
          <RekapProgressBar
            terjual={rekapData.tiket_terjual}
            kuota={rekapData.kuota}
            percent={rekapData.percent_terjual}
          />

          {/* 4 Status Breakdown Cards */}
          <RekapStatusBreakdown breakdown={rekapData.breakdown} />

          {/* Riwayat Tiket Terkait */}
          {rekapData.tiket_list.length > 0 ? (
            <RekapTiketTable tiketList={rekapData.tiket_list} />
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Belum ada tiket yang dipesan untuk event ini.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
