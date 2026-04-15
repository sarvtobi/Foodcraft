import { useState, useEffect } from 'react';
import api from '../lib/axios';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChefHat,
  RefreshCw,
  CalendarCheck,
} from 'lucide-react';
import type { JadwalProduksi } from '../types';

function formatTanggal(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}


export default function JadwalProduksiPage() {
  const [jadwalList, setJadwalList] = useState<JadwalProduksi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter tanggal
  const today = new Date().toISOString().split('T')[0];
  const [filterTanggal, setFilterTanggal] = useState(today);

  // Selesai
  const [selesaiLoadingId, setSelesaiLoadingId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchJadwal = async (tgl: string) => {
    try {
      setIsLoading(true);
      setError('');
      const res = await api.get('/api/staff/jadwal-produksi', {
        params: { tanggal: tgl },
      });
      const data =
        res.data.jadwal ||
        res.data.jadwal_produksis ||
        res.data.data ||
        res.data;
      setJadwalList(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil jadwal produksi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal(filterTanggal);
  }, [filterTanggal]);

  const handleSelesai = async (jadwal: JadwalProduksi) => {
    setSelesaiLoadingId(jadwal.id);
    setSuccessMsg('');
    try {
      await api.post(`/api/staff/jadwal-produksi/${jadwal.id}/selesai`);
      // Ambil nama produk dari pesanan.items[0]
      const firstItem = jadwal.pesanan?.items?.[0];
      const namaProduk = firstItem?.produk?.nama || `Pesanan #${jadwal.pesanan_id}`;
      setSuccessMsg(
        `✅ Produksi "${namaProduk}" berhasil diselesaikan. Stok bahan baku telah dipotong.`
      );
      fetchJadwal(filterTanggal);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menandai jadwal selesai');
    } finally {
      setSelesaiLoadingId(null);
    }
  };

  // Group jadwal by status: aktif & selesai
  const aktif = jadwalList.filter((j) => j.status !== 'selesai');
  const selesai = jadwalList.filter((j) => j.status === 'selesai');

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="page-header">Jadwal Produksi Dapur</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Antrian masak hari ini — diatur otomatis oleh Capacity Engine
          </p>
        </div>
        <button
          className="btn btn-outline"
          style={{ width: 'auto', display: 'inline-flex', gap: '0.4rem' }}
          onClick={() => fetchJadwal(filterTanggal)}
          title="Refresh"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && (
        <div
          className="alert"
          style={{ backgroundColor: '#F0FDF4', color: '#166534', borderColor: '#BBF7D0' }}
        >
          {successMsg}
        </div>
      )}

      {/* Filter Tanggal */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarDays size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Tanggal Produksi:</span>
          </div>
          <input
            type="date"
            className="form-control"
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
            style={{ width: 'auto', padding: '0.4rem 0.75rem' }}
          />
          {filterTanggal !== today && (
            <button
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.75rem', height: 'auto', fontSize: '0.8rem' }}
              onClick={() => setFilterTanggal(today)}
            >
              Hari Ini
            </button>
          )}
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {filterTanggal === today ? '📅 Hari ini' : formatTanggal(filterTanggal)}
          </span>
        </div>
      </div>

      {/* Summary strip */}
      {!isLoading && jadwalList.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}
        >
          {[
            {
              label: 'Antrian Aktif',
              val: aktif.length,
              bg: '#EEF2FF',
              color: 'var(--primary)',
              icon: <Clock size={18} />,
            },
            {
              label: 'Selesai Hari ini',
              val: selesai.length,
              bg: '#F0FDF4',
              color: '#16A34A',
              icon: <CheckCircle2 size={18} />,
            },
            {
              label: 'Terlambat / Kritis',
              val: jadwalList.filter((j) => j.terlambat).length,
              bg: '#FEF2F2',
              color: '#DC2626',
              icon: <AlertTriangle size={18} />,
            },
          ].map(({ label, val, bg, color, icon }) => (
            <div
              key={label}
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 1.25rem' }}
            >
              <div style={{ backgroundColor: bg, color, padding: '0.6rem', borderRadius: '10px', flexShrink: 0 }}>
                {icon}
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {label}
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{val}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Antrian Aktif */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h2
          style={{
            fontSize: '0.875rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border)',
            marginBottom: '0.75rem',
          }}
        >
          <ChefHat size={18} style={{ color: 'var(--primary)' }} />
          Antrian Masak
          {aktif.length > 0 && (
            <span
              className="badge"
              style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)', border: '1px solid #C7D2FE', marginLeft: 'auto' }}
            >
              {aktif.length} item
            </span>
          )}
        </h2>

        {isLoading ? (
          <div className="flex-center" style={{ padding: '2rem' }}>
            Memuat jadwal...
          </div>
        ) : aktif.length === 0 ? (
          <div
            className="flex-center"
            style={{ flexDirection: 'column', gap: '0.75rem', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}
          >
            <CalendarCheck size={40} />
            <p>Tidak ada antrian produksi untuk tanggal ini.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {aktif.map((jadwal) => (
              <JadwalCard
                key={jadwal.id}
                jadwal={jadwal}
                isLoading={selesaiLoadingId === jadwal.id}
                onSelesai={() => handleSelesai(jadwal)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Selesai */}
      {selesai.length > 0 && (
        <div className="card">
          <h2
            style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--border)',
              marginBottom: '0.75rem',
            }}
          >
            <CheckCircle2 size={18} />
            Sudah Selesai Dimasak
            <span
              className="badge"
              style={{ backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0', marginLeft: 'auto' }}
            >
              {selesai.length} item
            </span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {selesai.map((jadwal) => (
              <JadwalCard key={jadwal.id} jadwal={jadwal} done />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-component: JadwalCard ──────────────────────────────────────────────
interface JadwalCardProps {
  jadwal: JadwalProduksi;
  done?: boolean;
  isLoading?: boolean;
  onSelesai?: () => void;
}

function JadwalCard({ jadwal, done = false, isLoading = false, onSelesai }: JadwalCardProps) {
  // Produk info diambil dari pesanan.items (bukan pesanan_item yang tidak ada di response)
  const items = jadwal.pesanan?.items ?? [];
  const isTerlambat = !!jadwal.terlambat;

  // Tampilkan nama semua produk dalam satu jadwal
  const produkNames = items.length > 0
    ? items.map((it) => it.produk?.nama || `Produk #${it.produk_id}`).join(', ')
    : `Pesanan #${jadwal.pesanan_id}`;

  const totalKuantitas = items.reduce((sum, it) => sum + (it.kuantitas || 0), 0);
  const pelanggan = jadwal.pesanan?.pelanggan || `Pesanan #${jadwal.pesanan_id}`;
  const tenggatWaktu = jadwal.pesanan?.tenggat_waktu;

  return (
    <div
      style={{
        padding: '0.875rem 1.125rem',
        border: `1px solid ${done ? '#BBF7D0' : isTerlambat ? '#FECACA' : 'var(--border)'}`,
        borderRadius: '10px',
        backgroundColor: done ? '#F0FDF4' : isTerlambat ? '#FEF2F2' : 'var(--surface)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        opacity: done ? 0.8 : 1,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '10px',
          backgroundColor: done ? '#DCFCE7' : isTerlambat ? '#FEE2E2' : '#EEF2FF',
          color: done ? '#16A34A' : isTerlambat ? '#DC2626' : 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {done ? <CheckCircle2 size={20} /> : isTerlambat ? <AlertTriangle size={20} /> : <ChefHat size={20} />}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
            {produkNames}
          </p>
          {totalKuantitas > 0 && (
            <span
              className="badge"
              style={{ backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0' }}
            >
              ×{totalKuantitas}
            </span>
          )}
          {isTerlambat && !done && (
            <span
              className="badge"
              style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}
            >
              ⚠ Terlambat
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Untuk: <strong style={{ color: 'var(--text-main)' }}>{pelanggan}</strong>
          {tenggatWaktu && (
            <>
              {' '}· Tenggat:{' '}
              <strong style={{ color: isTerlambat ? '#DC2626' : 'var(--text-main)' }}>
                {new Date(tenggatWaktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </strong>
            </>
          )}
        </p>
        {jadwal.total_waktu_menit != null && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            <Clock size={11} style={{ display: 'inline', marginRight: '0.2rem', verticalAlign: 'middle' }} />
            Estimasi waktu masak: {jadwal.total_waktu_menit} menit
          </p>
        )}
      </div>

      {/* Aksi */}
      {!done && onSelesai && (
        <button
          className="btn btn-primary"
          style={{
            width: 'auto',
            padding: '0.5rem 1rem',
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
          }}
          disabled={isLoading}
          onClick={onSelesai}
        >
          {isLoading ? (
            <>
              <Clock size={14} style={{ animation: 'spin 1s linear infinite' }} />
              Menyimpan...
            </>
          ) : (
            <>
              <CheckCircle2 size={14} />
              Tandai Selesai
            </>
          )}
        </button>
      )}

      {done && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#16A34A',
            flexShrink: 0,
          }}
        >
          <CheckCircle2 size={15} /> Selesai
        </span>
      )}
    </div>
  );
}
