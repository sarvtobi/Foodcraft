import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  BarChart3,
  ShoppingBag,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PerformaPesanan {
  total_masuk: number;
  selesai: number;
  sedang_diproses: number;
  dibatalkan: number;
  terlambat: number;
}

interface TopProduk {
  nama: string;
  total_terjual: string | number;
}

interface DasborData {
  periode: string;
  performa_pesanan: PerformaPesanan;
  ketepatan_waktu_persen: number;
  utilisasi_kapasitas_persen: number;
  top_produk: TopProduk[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getPeriodLabel(yyyyMM: string) {
  const [year, month] = yyyyMM.split('-');
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
}

function shiftMonth(yyyyMM: string, delta: number): string {
  const [year, month] = yyyyMM.split('-').map(Number);
  const d = new Date(year, month - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function currentYYYYMM() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// ─── Gauge ring component ─────────────────────────────────────────────────────
function GaugeRing({
  persen,
  color,
  trackColor,
  size = 120,
}: {
  persen: number;
  color: string;
  trackColor: string;
  size?: number;
}) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(persen, 100) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={10} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DasborAnalitik() {
  const [periode, setPeriode] = useState(currentYYYYMM());
  const [data, setData] = useState<DasborData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async (p: string) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get('/api/owner/dasbor-analitik', {
        params: { periode: p },
      });
      // Normalise: response mungkin nested atau langsung
      const d: DasborData = res.data.data ?? res.data;
      setData(d);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data analitik');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(periode);
  }, [periode]);

  const thisMonth = currentYYYYMM();

  // ── Render helpers ──────────────────────────────────────────────────────────
  const ketepatan = data?.ketepatan_waktu_persen ?? 0;
  const utilisasi = data?.utilisasi_kapasitas_persen ?? 0;

  const ketepatanColor = ketepatan >= 90 ? '#16A34A' : ketepatan >= 70 ? '#D97706' : '#DC2626';
  const utilisasiColor = utilisasi > 90 ? '#DC2626' : utilisasi > 65 ? '#D97706' : '#4338CA';

  const ketepatanMsg =
    ketepatan >= 90
      ? 'Sangat baik! Pengiriman tepat waktu.'
      : ketepatan >= 70
      ? 'Perlu ditingkatkan — beberapa order terlambat.'
      : 'Kritis! Staf bekerja terlalu lambat dari deadline.';

  const utilisasiMsg =
    utilisasi > 90
      ? 'Kapasitas hampir penuh — pertimbangkan tambah kapasitas!'
      : utilisasi > 65
      ? 'Cukup sibuk, pantau terus.'
      : 'Kapasitas masih longgar.';

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="page-header">Dasbor Analitik</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Pantau performa bisnis UMKM Anda per periode
          </p>
        </div>
        <button
          className="btn btn-outline"
          style={{ width: 'auto', display: 'inline-flex', gap: '0.4rem' }}
          onClick={() => fetchData(periode)}
          title="Refresh"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Periode Navigator */}
      <div className="card" style={{ padding: '0.875rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-outline"
            style={{ padding: '0.35rem 0.6rem', height: 'auto' }}
            onClick={() => setPeriode((p) => shiftMonth(p, -1))}
            title="Bulan sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
              {getPeriodLabel(periode)}
            </span>
            {periode === thisMonth && (
              <span
                className="badge"
                style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)', border: '1px solid #C7D2FE' }}
              >
                Bulan ini
              </span>
            )}
          </div>

          <button
            className="btn btn-outline"
            style={{ padding: '0.35rem 0.6rem', height: 'auto' }}
            onClick={() => setPeriode((p) => shiftMonth(p, 1))}
            title="Bulan berikutnya"
            disabled={periode >= thisMonth}
          >
            <ChevronRight size={16} />
          </button>

          <input
            type="month"
            className="form-control"
            value={periode}
            max={thisMonth}
            onChange={(e) => setPeriode(e.target.value)}
            style={{ width: 'auto', padding: '0.35rem 0.6rem' }}
          />

          {periode !== thisMonth && (
            <button
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', height: 'auto' }}
              onClick={() => setPeriode(thisMonth)}
            >
              Bulan ini
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="card flex-center" style={{ padding: '4rem' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <BarChart3 size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
            <p>Memuat data analitik...</p>
          </div>
        </div>
      ) : !data ? null : (
        <>
          {/* ── Performa Pesanan ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '0.875rem',
              marginBottom: '1.25rem',
            }}
          >
            {[
              {
                label: 'Total Masuk',
                val: data.performa_pesanan.total_masuk,
                icon: <TrendingUp size={20} />,
                bg: '#EEF2FF',
                color: 'var(--primary)',
              },
              {
                label: 'Selesai',
                val: data.performa_pesanan.selesai,
                icon: <CheckCircle2 size={20} />,
                bg: '#F0FDF4',
                color: '#16A34A',
              },
              {
                label: 'Diproses',
                val: data.performa_pesanan.sedang_diproses,
                icon: <Clock size={20} />,
                bg: '#FFFBEB',
                color: '#D97706',
              },
              {
                label: 'Dibatalkan',
                val: data.performa_pesanan.dibatalkan,
                icon: <XCircle size={20} />,
                bg: '#F8FAFC',
                color: '#64748B',
              },
              {
                label: 'Terlambat',
                val: data.performa_pesanan.terlambat,
                icon: <AlertTriangle size={20} />,
                bg: '#FEF2F2',
                color: '#DC2626',
              },
            ].map(({ label, val, icon, bg, color }) => (
              <div
                key={label}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.125rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: bg,
                    color,
                    padding: '0.6rem',
                    borderRadius: '10px',
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '0.68rem',
                      color: 'var(--text-muted)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {label}
                  </p>
                  <p style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1.1 }}>{val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Gauge Metrics ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            {/* Ketepatan Waktu */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <CheckCircle2 size={18} style={{ color: ketepatanColor }} />
                <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Ketepatan Waktu Delivery
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <GaugeRing
                    persen={ketepatan}
                    color={ketepatanColor}
                    trackColor={ketepatan >= 90 ? '#DCFCE7' : ketepatan >= 70 ? '#FEF3C7' : '#FEE2E2'}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: ketepatanColor }}>
                      {ketepatan}%
                    </span>
                  </div>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                    }}
                  >
                    {ketepatanMsg}
                  </p>
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {[
                      { range: '≥ 90%', label: 'Sangat Baik', color: '#16A34A', bg: '#F0FDF4' },
                      { range: '70–89%', label: 'Perlu Perhatian', color: '#D97706', bg: '#FFFBEB' },
                      { range: '< 70%', label: 'Kritis', color: '#DC2626', bg: '#FEF2F2' },
                    ].map(({ range, label, color, bg }) => (
                      <span
                        key={range}
                        style={{
                          display: 'inline-flex',
                          gap: '0.35rem',
                          fontSize: '0.72rem',
                          color,
                          backgroundColor: bg,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          fontWeight: 500,
                        }}
                      >
                        {range} → {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Utilisasi Kapasitas */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Zap size={18} style={{ color: utilisasiColor }} />
                <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Utilisasi Kapasitas Dapur
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <GaugeRing
                    persen={utilisasi}
                    color={utilisasiColor}
                    trackColor={utilisasi > 90 ? '#FEE2E2' : utilisasi > 65 ? '#FEF3C7' : '#E0E7FF'}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: utilisasiColor }}>
                      {utilisasi}%
                    </span>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {utilisasiMsg}
                  </p>
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {[
                      { range: '> 90%', label: 'Kelimpungan!', color: '#DC2626', bg: '#FEF2F2' },
                      { range: '66–90%', label: 'Cukup Sibuk', color: '#D97706', bg: '#FFFBEB' },
                      { range: '≤ 65%', label: 'Longgar', color: '#4338CA', bg: '#EEF2FF' },
                    ].map(({ range, label, color, bg }) => (
                      <span
                        key={range}
                        style={{
                          display: 'inline-flex',
                          gap: '0.35rem',
                          fontSize: '0.72rem',
                          color,
                          backgroundColor: bg,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          fontWeight: 500,
                        }}
                      >
                        {range} → {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Top Produk ── */}
          <div className="card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                paddingBottom: '0.875rem',
                borderBottom: '1px solid var(--border)',
                marginBottom: '0.875rem',
              }}
            >
              <ShoppingBag size={18} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Top Produk Terlaris
              </h2>
              <span
                className="badge"
                style={{
                  backgroundColor: '#EEF2FF',
                  color: 'var(--primary)',
                  border: '1px solid #C7D2FE',
                  marginLeft: 'auto',
                  fontSize: '0.75rem',
                }}
              >
                {getPeriodLabel(periode)}
              </span>
            </div>

            {data.top_produk.length === 0 ? (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                }}
              >
                Belum ada data penjualan untuk periode ini.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {/* Compute max untuk bar chart sederhana */}
                {(() => {
                  const maxVal = Math.max(
                    ...data.top_produk.map((p) => Number(p.total_terjual))
                  );
                  return data.top_produk.map((produk, idx) => {
                    const val = Number(produk.total_terjual);
                    const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                    const isTop = idx === 0;
                    return (
                      <div
                        key={produk.nama}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          backgroundColor: isTop ? '#EEF2FF' : '#F8FAFC',
                          border: `1px solid ${isTop ? '#C7D2FE' : 'var(--border)'}`,
                        }}
                      >
                        {/* Rank badge */}
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            backgroundColor: isTop ? 'var(--primary)' : '#E2E8F0',
                            color: isTop ? '#fff' : '#64748B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            flexShrink: 0,
                          }}
                        >
                          {idx + 1}
                        </div>

                        {/* Name + bar */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                color: 'var(--text-main)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {produk.nama}
                            </span>
                            <span
                              style={{
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                color: isTop ? 'var(--primary)' : 'var(--text-main)',
                                flexShrink: 0,
                                marginLeft: '0.5rem',
                              }}
                            >
                              {val.toLocaleString('id-ID')} terjual
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div
                            style={{
                              height: 6,
                              backgroundColor: '#E2E8F0',
                              borderRadius: '999px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${pct}%`,
                                backgroundColor: isTop ? 'var(--primary)' : '#94A3B8',
                                borderRadius: '999px',
                                transition: 'width 0.5s ease',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
