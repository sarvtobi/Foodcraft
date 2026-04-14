import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Clock, CalendarDays, Info } from 'lucide-react';
import type { Kapasitas } from '../../types';

export default function KapasitasInfo() {
  const [kapasitas, setKapasitas] = useState<Kapasitas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchKapasitas = async () => {
      try {
        const res = await api.get('/api/staff/kapasitas');
        const data: Kapasitas = res.data.kapasitas || res.data.data || res.data;
        setKapasitas(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Gagal mengambil info kapasitas operasional');
      } finally {
        setIsLoading(false);
      }
    };
    fetchKapasitas();
  }, []);

  const HARI_SEMUA = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  return (
    <div className="fade-in">
      <div className="flex-between">
        <div>
          <h1 className="page-header">Info Operasional Dapur</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Informasi hari kerja dan waktu operasional UMKM (hanya baca)
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {isLoading ? (
        <div className="card flex-center" style={{ padding: '3rem' }}>
          Memuat data operasional...
        </div>
      ) : !kapasitas ? (
        <div className="card flex-center" style={{ flexDirection: 'column', gap: '1rem', padding: '3rem 1rem' }}>
          <Info size={40} color="var(--text-muted)" />
          <p style={{ color: 'var(--text-muted)' }}>Pengaturan kapasitas belum dikonfigurasi oleh owner.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            {/* Kapasitas Menit */}
            <div
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem' }}
            >
              <div
                style={{
                  backgroundColor: '#EEF2FF',
                  color: 'var(--primary)',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  flexShrink: 0,
                }}
              >
                <Clock size={22} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Kapasitas Harian
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {kapasitas.kapasitas_harian_menit} mnt
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  ≈ {Math.floor(kapasitas.kapasitas_harian_menit / 60)} jam{' '}
                  {kapasitas.kapasitas_harian_menit % 60 > 0
                    ? `${kapasitas.kapasitas_harian_menit % 60} menit`
                    : ''}
                </p>
              </div>
            </div>

            {/* Jumlah Hari Aktif */}
            <div
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem' }}
            >
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  color: '#16A34A',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  flexShrink: 0,
                }}
              >
                <CalendarDays size={22} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Hari Aktif / Minggu
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {kapasitas.hari_operasi?.length ?? 0} hari
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Total ≈{' '}
                  {(
                    ((kapasitas.hari_operasi?.length ?? 0) * kapasitas.kapasitas_harian_menit) /
                    60
                  ).toFixed(1)}{' '}
                  jam/minggu
                </p>
              </div>
            </div>
          </div>

          {/* Hari Operasi Detail */}
          <div className="card">
            <h2
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1rem',
              }}
            >
              Jadwal Hari Operasi
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {HARI_SEMUA.map((hari) => {
                const isActive = kapasitas.hari_operasi?.includes(hari);
                return (
                  <div
                    key={hari}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.5rem 1.125rem',
                      borderRadius: '8px',
                      border: isActive ? '1.5px solid #BBF7D0' : '1.5px solid var(--border)',
                      backgroundColor: isActive ? '#F0FDF4' : '#F8FAFC',
                      color: isActive ? '#15803D' : 'var(--text-muted)',
                      fontWeight: isActive ? 700 : 400,
                      fontSize: '0.875rem',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: isActive ? '#22C55E' : '#CBD5E1',
                        flexShrink: 0,
                      }}
                    />
                    {hari}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.875rem 1rem',
                backgroundColor: '#EEF2FF',
                color: '#3730A3',
                borderRadius: '8px',
                fontSize: '0.875rem',
                border: '1px solid #E0E7FF',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}
            >
              <Info size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>
                Data ini bersifat <strong>read-only</strong>. Hanya owner yang dapat mengubah jadwal dan kapasitas operasional.
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
