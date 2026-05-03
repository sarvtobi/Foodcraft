import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import {
  BarChart3, RefreshCw, ChevronLeft, ChevronRight,
  TrendingUp, TrendingDown, Clock, Package, Users,
  CheckCircle2, Activity,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatItem {
  value: number;
  unit: string;
  trend_persen?: number;
  trend_value?: number;
  is_up?: boolean;
  label?: string;
}

interface GrafikPoint { bulan: string; efisiensi: number; kapasitas: number; }
interface RingkasanProduksi { produk: string; target: number; aktual: number; satuan: string; progress: number; }
interface NotifikasiStok { bahan: string; stok: number; limit: number; satuan: string; status: string; progress: number; }

interface DashboardData {
  periode: string;
  last_updated: string;
  statistik_utama: {
    total_output: StatItem;
    tingkat_keterlambatan: StatItem;
    status_bahan_baku: StatItem;
    mitra_aktif: StatItem;
  };
  grafik_performa: GrafikPoint[];
  ringkasan_produksi: RingkasanProduksi[];
  notifikasi_stok: NotifikasiStok[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function currentYYYYMM() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`;
}
function shiftMonth(ym: string, d: number) {
  const [y, m] = ym.split('-').map(Number);
  const dt = new Date(y, m - 1 + d, 1);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
}
function getPeriodLabel(ym: string) {
  const [y, m] = ym.split('-');
  return new Date(Number(y), Number(m) - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

// ─── Mini SVG Line Chart ──────────────────────────────────────────────────────
function LineChart({ data, activeFilter }: { data: GrafikPoint[]; activeFilter: string }) {
  const W = 800, H = 200, PAD = 30;
  if (!data.length) return null;

  const maxVal = Math.max(...data.flatMap(d => [d.efisiensi, d.kapasitas]), 1);
  const pts = (key: 'efisiensi' | 'kapasitas') =>
    data.map((d, i) => {
      const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
      const y = H - PAD - ((d[key] / maxVal) * (H - PAD * 2));
      return `${x},${y}`;
    }).join(' ');

  const polyPts = (key: 'efisiensi' | 'kapasitas') => {
    const mapped = data.map((d, i) => ({
      x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
      y: H - PAD - ((d[key] / maxVal) * (H - PAD * 2)),
    }));
    const close = `${mapped[mapped.length - 1].x},${H - PAD} ${mapped[0].x},${H - PAD}`;
    return mapped.map(p => `${p.x},${p.y}`).join(' ') + ' ' + close;
  };

  const yTicks = [0, 30, 60, 90, 120].filter(v => v <= maxVal + 10);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 200, overflow: 'visible' }}>
      {yTicks.map(v => {
        const y = H - PAD - ((v / maxVal) * (H - PAD * 2));
        return (
          <g key={v}>
            <line x1={PAD} x2={W - PAD} y1={y} y2={y} stroke="#E2E8F0" strokeWidth={1} />
            <text x={PAD - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#94A3B8">{v}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
        return <text key={d.bulan} x={x} y={H - 8} textAnchor="middle" fontSize={10} fill="#94A3B8">{d.bulan}</text>;
      })}

      {(activeFilter === 'semua' || activeFilter === 'efisiensi') && (
        <>
          <polygon points={polyPts('efisiensi')} fill="url(#efGrad)" opacity={0.2} />
          <polyline points={pts('efisiensi')} fill="none" stroke="#0EA5E9" strokeWidth={2.5} strokeLinejoin="round" />
        </>
      )}
      {(activeFilter === 'semua' || activeFilter === 'kapasitas') && (
        <polyline points={pts('kapasitas')} fill="none" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="5,4" strokeLinejoin="round" />
      )}

      <defs>
        <linearGradient id="efGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Progress Ring ────────────────────────────────────────────────────────────
function ProgressRing({ pct, color, size = 44 }: { pct: number; color: string; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
    </svg>
  );
}

function statusColor(s: string) {
  if (s === 'Kritis') return '#DC2626';
  if (s === 'Rendah') return '#D97706';
  return '#16A34A';
}
function statusBg(s: string) {
  if (s === 'Kritis') return '#FEE2E2';
  if (s === 'Rendah') return '#FEF3C7';
  return '#DCFCE7';
}
function progressColor(pct: number) {
  if (pct >= 90) return '#16A34A';
  if (pct >= 70) return '#0EA5E9';
  if (pct >= 50) return '#D97706';
  return '#DC2626';
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OwnerDashboard() {
  const [periode, setPeriode] = useState(currentYYYYMM());
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartFilter, setChartFilter] = useState<'semua' | 'efisiensi' | 'kapasitas'>('semua');
  const thisMonth = currentYYYYMM();

  const fetchData = async (p: string) => {
    setIsLoading(true); setError('');
    try {
      const res = await api.get('/api/owner/dasbor-analitik', { params: { periode: p } });
      setData(res.data.data ?? res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data analitik.');
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(periode); }, [periode]);

  const stat = data?.statistik_utama;

  const topCards = stat ? [
    {
      label: 'Total Output Produksi',
      value: stat.total_output.value.toLocaleString('id-ID'),
      unit: stat.total_output.unit,
      trend: stat.total_output.trend_persen,
      isUp: stat.total_output.is_up,
      icon: <BarChart3 size={22} />,
      iconBg: '#E0F2FE', iconColor: '#0284C7',
    },
    {
      label: 'Rata-rata Tingkat Keterlambatan',
      value: stat.tingkat_keterlambatan.value,
      unit: stat.tingkat_keterlambatan.unit,
      trend: stat.tingkat_keterlambatan.trend_persen,
      isUp: stat.tingkat_keterlambatan.is_up,
      icon: <Clock size={22} />,
      iconBg: '#FEF3C7', iconColor: '#D97706',
    },
    {
      label: 'Status Bahan Baku',
      value: stat.status_bahan_baku.value,
      unit: stat.status_bahan_baku.unit,
      subLabel: stat.status_bahan_baku.label,
      trend: stat.status_bahan_baku.trend_persen,
      isUp: stat.status_bahan_baku.is_up,
      icon: <Package size={22} />,
      iconBg: '#EDE9FE', iconColor: '#7C3AED',
    },
    {
      label: 'Mitra UMKM Aktif',
      value: stat.mitra_aktif.value.toLocaleString('id-ID'),
      unit: stat.mitra_aktif.unit,
      trend: stat.mitra_aktif.trend_value,
      isUp: stat.mitra_aktif.is_up,
      isTrendAbsolute: true,
      icon: <Users size={22} />,
      iconBg: '#DCFCE7', iconColor: '#16A34A',
    },
  ] : [];

  return (
    <div className="fade-in" style={{ maxWidth: 1400 }}>
      {/* ── Header ── */}
      <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
        <div>
          <h1 className="page-header">Analitik Performa Produksi</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 2 }}>
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn btn-outline" style={{ gap: '0.4rem', padding: '0.5rem 1rem' }}
            onClick={() => fetchData(periode)}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* ── Period Navigator ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', height: 'auto' }}
          onClick={() => setPeriode(p => shiftMonth(p, -1))}>
          <ChevronLeft size={15} />
        </button>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Activity size={15} style={{ color: 'var(--primary)' }} />
          {getPeriodLabel(periode)}
          {periode === thisMonth && (
            <span style={{ background: '#EEF2FF', color: 'var(--primary)', fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: 999, border: '1px solid #C7D2FE', fontWeight: 600 }}>
              Bulan ini
            </span>
          )}
        </span>
        <button className="btn btn-outline" style={{ padding: '0.35rem 0.6rem', height: 'auto' }}
          onClick={() => setPeriode(p => shiftMonth(p, 1))} disabled={periode >= thisMonth}>
          <ChevronRight size={15} />
        </button>
        <input type="month" className="form-control" value={periode} max={thisMonth}
          onChange={e => setPeriode(e.target.value)}
          style={{ width: 'auto', padding: '0.35rem 0.6rem', fontSize: '0.875rem' }} />
        {periode !== thisMonth && (
          <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', height: 'auto' }}
            onClick={() => setPeriode(thisMonth)}>
            Bulan ini
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="card flex-center" style={{ padding: '5rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)' }}>
            <BarChart3 size={40} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
            <p>Memuat data analitik...</p>
          </div>
        </div>
      ) : !data ? null : (
        <>
          {/* ── STATISTIK UTAMA ── */}
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            STATISTIK PRODUKSI
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {topCards.map(card => (
              <div key={card.label} className="card" style={{ padding: '1.25rem', marginBottom: 0, transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ background: card.iconBg, color: card.iconColor, padding: '0.6rem', borderRadius: 10 }}>
                    {card.icon}
                  </div>
                  {card.trend !== undefined && card.trend !== 0 && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: card.isUp ? '#16A34A' : '#DC2626', display: 'flex', alignItems: 'center', gap: 2 }}>
                      {card.isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                      {card.isTrendAbsolute ? `+${card.trend}` : `${card.isUp ? '+' : ''}${card.trend}%`}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.875rem', fontWeight: 500 }}>{card.label}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1, marginTop: '0.25rem' }}>
                  {card.value} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                    {card.subLabel ?? card.unit}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* ── GRAFIK ── */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Grafik Penggunaan Bahan & Efisiensi Produksi
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Performa utilisasi sumber daya di semua unit UMKM aktif
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['semua', 'efisiensi', 'kapasitas'] as const).map(f => (
                  <button key={f} onClick={() => setChartFilter(f)}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.875rem', borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer', fontWeight: 600, background: chartFilter === f ? 'var(--primary)' : 'transparent', color: chartFilter === f ? '#fff' : 'var(--text-muted)', transition: 'all 0.2s' }}>
                    {f === 'semua' ? 'Semua' : f === 'efisiensi' ? 'Efisiensi' : 'Kapasitas'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', marginTop: '0.5rem' }}>
              {(chartFilter === 'semua' || chartFilter === 'efisiensi') && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#0EA5E9', fontWeight: 600 }}>
                  <span style={{ display: 'inline-block', width: 24, height: 2.5, background: '#0EA5E9', borderRadius: 2 }} />
                  Efisiensi Produksi
                </span>
              )}
              {(chartFilter === 'semua' || chartFilter === 'kapasitas') && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>
                  <span style={{ display: 'inline-block', width: 24, height: 2, background: '#94A3B8', borderRadius: 2, borderTop: '2px dashed #94A3B8' }} />
                  Kapasitas
                </span>
              )}
            </div>
            <LineChart data={data.grafik_performa} activeFilter={chartFilter} />
          </div>

          {/* ── BAWAH: Ringkasan + Notifikasi ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {/* Ringkasan Produksi */}
            <div className="card" style={{ marginBottom: 0, padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Ringkasan Produksi</h2>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pencapaian target per produk bulan ini</p>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Lihat Semua →</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 60px 60px auto', gap: '0.25rem 0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                {['Produk', 'Target', 'Aktual', 'Satuan', 'Progress'].map(h => (
                  <span key={h} style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
                ))}
              </div>

              {data.ringkasan_produksi.map(row => (
                <div key={row.produk} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 60px 60px auto', gap: '0.25rem 0.5rem', alignItems: 'center', padding: '0.625rem 0', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{row.produk}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{row.target.toLocaleString('id-ID')}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{row.aktual.toLocaleString('id-ID')}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{row.satuan}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 100 }}>
                    <div style={{ flex: 1, height: 6, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(row.progress, 100)}%`, background: progressColor(row.progress), borderRadius: 999, transition: 'width 0.5s ease' }} />
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: progressColor(row.progress), minWidth: 32 }}>
                      {row.progress}%
                    </span>
                  </div>
                </div>
              ))}
              {data.ringkasan_produksi.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem', fontSize: '0.875rem' }}>
                  Belum ada data produksi.
                </p>
              )}
            </div>

            {/* Notifikasi Stok */}
            <div className="card" style={{ marginBottom: 0, padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Notifikasi Stok Menipis</h2>
                  {data.notifikasi_stok.length > 0 && (
                    <span style={{ background: '#EF4444', color: '#fff', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, padding: '0.1rem 0.45rem', minWidth: 20, textAlign: 'center' }}>
                      {data.notifikasi_stok.length}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Atur →</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 70px auto', gap: '0.25rem 0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                {['Bahan', 'Stok', 'Status', 'Progress'].map(h => (
                  <span key={h} style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
                ))}
              </div>

              {data.notifikasi_stok.map(row => (
                <div key={row.bahan} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 70px auto', gap: '0.25rem 0.5rem', alignItems: 'center', padding: '0.625rem 0', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.bahan}>
                    {row.bahan.length > 12 ? row.bahan.slice(0, 12) + '…' : row.bahan}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {row.stok}/{row.limit} {row.satuan}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 6, background: statusBg(row.status), color: statusColor(row.status), textAlign: 'center' }}>
                    {row.status}
                  </span>
                  <ProgressRing pct={row.progress} color={statusColor(row.status)} size={40} />
                </div>
              ))}
              {data.notifikasi_stok.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', color: 'var(--text-muted)', gap: '0.5rem' }}>
                  <CheckCircle2 size={28} style={{ color: '#16A34A' }} />
                  <p style={{ fontSize: '0.875rem' }}>Semua stok dalam kondisi baik!</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
