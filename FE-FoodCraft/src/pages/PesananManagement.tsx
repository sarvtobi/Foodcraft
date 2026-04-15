import { useState, useEffect, type FormEvent, type JSX } from 'react';
import api from '../lib/axios';
import {
  ClipboardList,
  Plus,
  X,
  Eye,
  ChevronDown,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
  CalendarCheck,
  AlertCircle,
} from 'lucide-react';
import type { Pesanan, PesananStatus, Produk } from '../types';
import { useAuth } from '../contexts/AuthContext';

// ─── Helpers ────────────────────────────────────────────────────────────────

const PRIORITAS_CONFIG = {
  tinggi: {
    label: 'Tinggi',
    bg: '#FEF2F2',
    color: '#DC2626',
    border: '#FECACA',
    dot: '#EF4444',
  },
  sedang: {
    label: 'Sedang',
    bg: '#FFFBEB',
    color: '#D97706',
    border: '#FDE68A',
    dot: '#F59E0B',
  },
  rendah: {
    label: 'Rendah',
    bg: '#F0FDF4',
    color: '#16A34A',
    border: '#BBF7D0',
    dot: '#22C55E',
  },
} as const;

const STATUS_CONFIG: Record<
  PesananStatus,
  { label: string; bg: string; color: string; border: string; icon: JSX.Element }
> = {
  pending: {
    label: 'Pending',
    bg: '#F8FAFC',
    color: '#64748B',
    border: '#E2E8F0',
    icon: <Clock size={13} />,
  },
  diproses: {
    label: 'Diproses',
    bg: '#EEF2FF',
    color: '#4338CA',
    border: '#C7D2FE',
    icon: <Loader2 size={13} />,
  },
  selesai: {
    label: 'Selesai',
    bg: '#F0FDF4',
    color: '#16A34A',
    border: '#BBF7D0',
    icon: <CheckCircle2 size={13} />,
  },
  dibatalkan: {
    label: 'Dibatalkan',
    bg: '#FEF2F2',
    color: '#DC2626',
    border: '#FECACA',
    icon: <XCircle size={13} />,
  },
};

const STATUS_OPTIONS: PesananStatus[] = ['pending', 'diproses', 'selesai', 'dibatalkan'];

function formatTanggal(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function hariTersisa(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(dateStr);
  deadline.setHours(0, 0, 0, 0);
  return Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Empty form item type ───────────────────────────────────────────────────
interface FormItem {
  produk_id: string;
  kuantitas: number;
}

// ============================================================================
export default function PesananManagement() {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';

  const [pesananList, setPesananList] = useState<Pesanan[]>([]);
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Jadwalkan state
  const [jadwalkanLoadingId, setJadwalkanLoadingId] = useState<number | null>(null);
  const [jadwalkanResult, setJadwalkanResult] = useState<{ id: number; terlambat: boolean; tanggal: string } | null>(null);

  // Detail modal
  const [detailPesanan, setDetailPesanan] = useState<Pesanan | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Create modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formPelanggan, setFormPelanggan] = useState('');
  const [formTenggat, setFormTenggat] = useState('');
  const [formItems, setFormItems] = useState<FormItem[]>([{ produk_id: '', kuantitas: 1 }]);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status update
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [resPesanan, resProduk] = await Promise.all([
        api.get('/api/pesanan'),
        api.get('/api/owner/produk').catch(() => api.get('/api/staff/produk')),
      ]);
      const pData = resPesanan.data.pesanan || resPesanan.data.data || resPesanan.data;
      const prData = resProduk.data.produk || resProduk.data.data || resProduk.data;
      setPesananList(Array.isArray(pData) ? pData : []);
      setProdukList(Array.isArray(prData) ? prData : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data pesanan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Open detail ────────────────────────────────────────────────────────────
  const openDetail = async (pesanan: Pesanan) => {
    setDetailPesanan(pesanan);
    setIsDetailOpen(true);
    setIsDetailLoading(true);
    try {
      const res = await api.get(`/api/pesanan/${pesanan.id}`);
      const data: Pesanan = res.data.pesanan || res.data.data || res.data;
      setDetailPesanan(data);
    } catch {
      // fallback ke data list
    } finally {
      setIsDetailLoading(false);
    }
  };

  // ── Update status ──────────────────────────────────────────────────────────
  const handleUpdateStatus = async (id: number, status: PesananStatus) => {
    setUpdatingStatusId(id);
    try {
      await api.put(`/api/pesanan/${id}/status`, { status });
      // Update lokal tanpa full refetch
      setPesananList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
      // Kalau detail sedang terbuka, update juga
      if (detailPesanan?.id === id) {
        setDetailPesanan((prev) => (prev ? { ...prev, status } : prev));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengubah status pesanan');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // ── Jadwalkan pesanan (owner only) ────────────────────────────────────────
  const handleJadwalkan = async (pesanan: Pesanan) => {
    setJadwalkanLoadingId(pesanan.id);
    setJadwalkanResult(null);
    try {
      const res = await api.post(`/api/owner/pesanan/${pesanan.id}/jadwalkan`);
      const data = res.data;
      // Coba baca terlambat flag dari response (mungkin nested)
      const entriesArr = data.jadwal || data.data || [];
      const hasTerlambat = Array.isArray(entriesArr)
        ? entriesArr.some((j: any) => j.terlambat)
        : data.terlambat;
      const firstTanggal = Array.isArray(entriesArr) && entriesArr[0]
        ? entriesArr[0].tanggal_produksi
        : data.tanggal_produksi || '';
      setJadwalkanResult({ id: pesanan.id, terlambat: !!hasTerlambat, tanggal: firstTanggal });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menjadwalkan pesanan');
    } finally {
      setJadwalkanLoadingId(null);
    }
  };

  // ── Create handlers ────────────────────────────────────────────────────────
  const openCreate = () => {
    setFormPelanggan('');
    setFormTenggat('');
    setFormItems([{ produk_id: '', kuantitas: 1 }]);
    setFormError('');
    setIsCreateOpen(true);
  };

  const addFormItem = () =>
    setFormItems((prev) => [...prev, { produk_id: '', kuantitas: 1 }]);

  const removeFormItem = (index: number) =>
    setFormItems((prev) => prev.filter((_, i) => i !== index));

  const updateFormItem = (index: number, field: keyof FormItem, value: string | number) =>
    setFormItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );

  const handleSubmitCreate = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (formItems.some((it) => !it.produk_id || it.kuantitas < 1)) {
      setFormError('Lengkapi semua item produk dan kuantitasnya.');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/api/pesanan', {
        pelanggan: formPelanggan,
        tenggat_waktu: formTenggat,
        items: formItems.map((it) => ({
          produk_id: Number(it.produk_id),
          kuantitas: Number(it.kuantitas),
        })),
      });
      setIsCreateOpen(false);
      fetchData();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Gagal membuat pesanan baru');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Computed preview harga ─────────────────────────────────────────────────
  const previewTotal = formItems.reduce((sum, it) => {
    const produk = produkList.find((p) => p.id === Number(it.produk_id));
    return sum + (produk?.harga || 0) * (it.kuantitas || 0);
  }, 0);

  // ── Deadline badge helper ──────────────────────────────────────────────────
  const DeadlineBadge = ({ dateStr }: { dateStr: string }) => {
    const sisa = hariTersisa(dateStr);
    const color = sisa <= 2 ? '#DC2626' : sisa <= 7 ? '#D97706' : '#475569';
    const bg = sisa <= 2 ? '#FEF2F2' : sisa <= 7 ? '#FFFBEB' : '#F1F5F9';
    const border = sisa <= 2 ? '#FECACA' : sisa <= 7 ? '#FDE68A' : '#E2E8F0';
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.2rem 0.6rem',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: bg,
          color,
          border: `1px solid ${border}`,
        }}
      >
        {sisa < 0 ? '⚠️ Lewat' : sisa === 0 ? '🔥 Hari ini' : `${sisa}h lagi`}
      </span>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="page-header">Manajemen Pesanan</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Antrian pesanan diurutkan otomatis berdasarkan prioritas &amp; tenggat waktu terdekat
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} style={{ width: 'auto' }}>
          <Plus size={18} /> Buat Pesanan
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Prioritas legend */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {(['tinggi', 'sedang', 'rendah'] as const).map((p) => {
          const cfg = PRIORITAS_CONFIG[p];
          return (
            <span
              key={p}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: cfg.bg,
                color: cfg.color,
                border: `1px solid ${cfg.border}`,
              }}
            >
              <span
                style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cfg.dot }}
              />
              {cfg.label}
            </span>
          );
        })}
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
          — Prioritas ditetapkan otomatis oleh sistem
        </span>
      </div>

      {/* Table */}
      <div className="card">
        {isLoading ? (
          <div className="flex-center" style={{ padding: '2.5rem' }}>
            Memuat data pesanan...
          </div>
        ) : pesananList.length === 0 ? (
          <div
            className="flex-center"
            style={{ flexDirection: 'column', gap: '1rem', padding: '3rem 1rem' }}
          >
            <ClipboardList size={48} color="var(--text-muted)" />
            <p style={{ color: 'var(--text-muted)' }}>Belum ada pesanan masuk.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pelanggan</th>
                  <th>Prioritas</th>
                  <th>Tenggat Waktu</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pesananList.map((p) => {
                  const prCfg = PRIORITAS_CONFIG[p.prioritas as keyof typeof PRIORITAS_CONFIG] ?? PRIORITAS_CONFIG['rendah'];
                  const stCfg = STATUS_CONFIG[p.status];
                  return (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td style={{ fontWeight: 500 }}>{p.pelanggan}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: prCfg.bg,
                            color: prCfg.color,
                            border: `1px solid ${prCfg.border}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: '50%',
                              backgroundColor: prCfg.dot,
                            }}
                          />
                          {p.prioritas}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span style={{ fontSize: '0.875rem' }}>{formatTanggal(p.tenggat_waktu)}</span>
                          <DeadlineBadge dateStr={p.tenggat_waktu} />
                        </div>
                      </td>
                      <td>
                        {/* Inline status dropdown */}
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <select
                            value={p.status}
                            disabled={updatingStatusId === p.id}
                            onChange={(e) =>
                              handleUpdateStatus(p.id, e.target.value as PesananStatus)
                            }
                            style={{
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              padding: '0.3rem 1.75rem 0.3rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              backgroundColor: stCfg.bg,
                              color: stCfg.color,
                              border: `1px solid ${stCfg.border}`,
                              cursor: updatingStatusId === p.id ? 'wait' : 'pointer',
                              outline: 'none',
                            }}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {STATUS_CONFIG[s].label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={12}
                            style={{
                              position: 'absolute',
                              right: '0.4rem',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              pointerEvents: 'none',
                              color: stCfg.color,
                            }}
                          />
                        </div>
                      </td>
                      <td style={{ color: 'var(--success)', fontWeight: 600 }}>
                        {p.total_harga != null
                          ? `Rp ${Number(p.total_harga).toLocaleString('id-ID')}`
                          : '—'}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end", alignItems: "center" }}>
                          {isOwner && p.status === "pending" && (
                            <button
                              className="btn btn-outline"
                              style={{
                                padding: "0.4rem 0.7rem",
                                border: "1px solid #BBF7D0",
                                color: "#16A34A",
                                backgroundColor: jadwalkanResult?.id === p.id ? "#F0FDF4" : "transparent",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                fontSize: "0.8rem",
                              }}
                              disabled={jadwalkanLoadingId === p.id}
                              onClick={() => handleJadwalkan(p)}
                            >
                              {jadwalkanLoadingId === p.id
                                ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                                : jadwalkanResult?.id === p.id
                                  ? jadwalkanResult.terlambat ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />
                                  : <CalendarCheck size={14} />}
                              {jadwalkanLoadingId === p.id ? "Menjadwalkan..." : "Jadwalkan"}
                            </button>
                          )}
                          <button
                            className="btn btn-outline"
                            style={{
                              padding: "0.4rem 0.75rem",
                              border: "1px solid var(--border)",
                              color: "var(--primary)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                            onClick={() => openDetail(p)}
                          >
                            <Eye size={15} /> Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Create Modal ─────────────────────────────────────────────────── */}
      {isCreateOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <h2>Buat Pesanan Baru</h2>
              <button className="modal-close" onClick={() => setIsCreateOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitCreate}>
              {formError && <div className="alert alert-error">{formError}</div>}

              <div className="form-group">
                <label>Nama Pelanggan</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formPelanggan}
                  onChange={(e) => setFormPelanggan(e.target.value)}
                  placeholder="Contoh: Ibu Tita"
                />
              </div>

              <div className="form-group">
                <label>Tenggat Waktu (Deadline)</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={formTenggat}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormTenggat(e.target.value)}
                />
                {formTenggat && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
                    {(() => {
                      const sisa = hariTersisa(formTenggat);
                      const p =
                        sisa <= 2 ? 'Tinggi 🔴' : sisa <= 7 ? 'Sedang 🟡' : 'Rendah 🟢';
                      return `Prioritas otomatis: ${p} (${sisa} hari lagi)`;
                    })()}
                  </p>
                )}
              </div>

              {/* Items */}
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Item Pesanan</span>
                  <button
                    type="button"
                    onClick={addFormItem}
                    className="btn btn-outline"
                    style={{
                      padding: '0.25rem 0.6rem',
                      fontSize: '0.8rem',
                      display: 'inline-flex',
                      gap: '0.25rem',
                      height: 'auto',
                    }}
                  >
                    <Plus size={14} /> Tambah Produk
                  </button>
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {formItems.map((item, idx) => {
                    const produkTerpilih = produkList.find((p) => p.id === Number(item.produk_id));
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          alignItems: 'center',
                          padding: '0.75rem',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <select
                            required
                            value={item.produk_id}
                            onChange={(e) => updateFormItem(idx, 'produk_id', e.target.value)}
                            className="form-control"
                            style={{ padding: '0.4rem', fontSize: '0.875rem' }}
                          >
                            <option value="" disabled>
                              -- Pilih Produk --
                            </option>
                            {produkList.map((pr) => (
                              <option key={pr.id} value={pr.id}>
                                {pr.nama} — Rp {pr.harga.toLocaleString('id-ID')}
                              </option>
                            ))}
                          </select>
                          {produkTerpilih && (
                            <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                              Subtotal: Rp{' '}
                              {(produkTerpilih.harga * (item.kuantitas || 0)).toLocaleString('id-ID')}
                            </p>
                          )}
                        </div>
                        <div style={{ width: '80px' }}>
                          <input
                            type="number"
                            min={1}
                            required
                            className="form-control"
                            value={item.kuantitas || ''}
                            onChange={(e) =>
                              updateFormItem(idx, 'kuantitas', Number(e.target.value))
                            }
                            style={{ padding: '0.4rem', fontSize: '0.875rem', textAlign: 'center' }}
                            placeholder="Qty"
                          />
                        </div>
                        {formItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFormItem(idx)}
                            className="btn btn-danger"
                            style={{ padding: '0.4rem', border: 'none', flexShrink: 0 }}
                            title="Hapus item"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Preview total */}
              {previewTotal > 0 && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#EEF2FF',
                    borderRadius: '8px',
                    border: '1px solid #E0E7FF',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '0.875rem', color: '#3730A3', fontWeight: 500 }}>
                    Estimasi Total
                  </span>
                  <span style={{ fontWeight: 700, color: '#3730A3', fontSize: '1rem' }}>
                    Rp {previewTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: 'auto' }}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Buat Pesanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Detail Modal ─────────────────────────────────────────────────── */}
      {isDetailOpen && detailPesanan && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h2>Detail Pesanan #{detailPesanan.id}</h2>
              <button className="modal-close" onClick={() => setIsDetailOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {isDetailLoading ? (
              <div className="flex-center" style={{ padding: '2rem' }}>
                Memuat detail...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Info rows */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                  }}
                >
                  {[
                    { label: 'Pelanggan', value: detailPesanan.pelanggan },
                    {
                      label: 'Tenggat Waktu',
                      value: (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span>{formatTanggal(detailPesanan.tenggat_waktu)}</span>
                          <DeadlineBadge dateStr={detailPesanan.tenggat_waktu} />
                        </div>
                      ),
                    },
                    {
                      label: 'Prioritas',
                      value: (() => {
                        const cfg = PRIORITAS_CONFIG[detailPesanan.prioritas as keyof typeof PRIORITAS_CONFIG] ?? PRIORITAS_CONFIG['rendah'];
                        return (
                          <span
                            className="badge"
                            style={{
                              backgroundColor: cfg.bg,
                              color: cfg.color,
                              border: `1px solid ${cfg.border}`,
                              display: 'inline-flex',
                              gap: '0.3rem',
                              alignItems: 'center',
                            }}
                          >
                            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: cfg.dot }} />
                            {detailPesanan.prioritas}
                          </span>
                        );
                      })(),
                    },
                    {
                      label: 'Status',
                      value: (() => {
                        const cfg = STATUS_CONFIG[detailPesanan.status];
                        return (
                          <span
                            className="badge"
                            style={{
                              backgroundColor: cfg.bg,
                              color: cfg.color,
                              border: `1px solid ${cfg.border}`,
                              display: 'inline-flex',
                              gap: '0.3rem',
                              alignItems: 'center',
                            }}
                          >
                            {cfg.icon}
                            {cfg.label}
                          </span>
                        );
                      })(),
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                        {label}
                      </p>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ubah status dari dalam detail */}
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Ubah Status Pesanan
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {STATUS_OPTIONS.map((s) => {
                      const cfg = STATUS_CONFIG[s];
                      const isActive = detailPesanan.status === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={isActive || updatingStatusId === detailPesanan.id}
                          onClick={() => handleUpdateStatus(detailPesanan.id, s)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.4rem 0.85rem',
                            borderRadius: '7px',
                            border: isActive ? `1.5px solid ${cfg.border}` : '1.5px solid var(--border)',
                            backgroundColor: isActive ? cfg.bg : 'transparent',
                            color: isActive ? cfg.color : 'var(--text-muted)',
                            fontWeight: isActive ? 700 : 400,
                            fontSize: '0.82rem',
                            cursor: isActive ? 'default' : 'pointer',
                            opacity: updatingStatusId === detailPesanan.id && !isActive ? 0.5 : 1,
                          }}
                        >
                          {cfg.icon}
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Items list */}
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Item Pesanan
                  </p>
                  {!detailPesanan.items || detailPesanan.items.length === 0 ? (
                    <div
                      style={{
                        padding: '1rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '8px',
                        border: '1px dashed var(--border)',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.875rem',
                      }}
                    >
                      Tidak ada item.
                    </div>
                  ) : (
                    <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                      {detailPesanan.items.map((item, index) => (
                        <div
                          key={item.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.75rem 1rem',
                            backgroundColor: 'var(--surface)',
                            borderBottom:
                              index !== (detailPesanan.items?.length ?? 0) - 1
                                ? '1px solid var(--border)'
                                : 'none',
                          }}
                        >
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}>
                              {item.produk?.nama || `Produk #${item.produk_id}`}
                            </p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                              {item.kuantitas} × Rp {item.harga_satuan?.toLocaleString('id-ID')}
                            </p>
                          </div>
                          <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.875rem' }}>
                            Rp {((item.subtotal ?? item.harga_satuan * item.kuantitas) || 0).toLocaleString('id-ID')}
                          </span>
                        </div>
                      ))}
                      {/* Total row */}
                      {detailPesanan.total != null && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.75rem 1rem',
                            backgroundColor: '#F0FDF4',
                            borderTop: '1px solid var(--border)',
                          }}
                        >
                          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Total</span>
                          <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '1rem' }}>
                            Rp {detailPesanan.total.toLocaleString('id-ID')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Warning jika prioritas tinggi */}
                {detailPesanan.prioritas === 'tinggi' && detailPesanan.status === 'pending' && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#FEF2F2',
                      borderRadius: '8px',
                      border: '1px solid #FECACA',
                      color: '#DC2626',
                      fontSize: '0.875rem',
                    }}
                  >
                    <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                    <span>
                      Pesanan ini berprioritas <strong>Tinggi</strong>! Tenggat waktu sangat dekat — segera proses.
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setIsDetailOpen(false)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
