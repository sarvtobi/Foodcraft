import { useState, useEffect, type FormEvent } from 'react';
import api from '../../lib/axios';
import { Clock, Save, Settings2, CheckSquare, Square } from 'lucide-react';
import type { Kapasitas } from '../../types';

const HARI_OPTIONS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function KapasitasManagement() {
  const [kapasitas, setKapasitas] = useState<Kapasitas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form
  const [formMenit, setFormMenit] = useState(480);
  const [formHari, setFormHari] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchKapasitas = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/owner/kapasitas');
      const data: Kapasitas = res.data.kapasitas || res.data.data || res.data;
      setKapasitas(data);
      setFormMenit(data.kapasitas_harian_menit ?? 480);
      setFormHari(Array.isArray(data.hari_operasi) ? data.hari_operasi : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data kapasitas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKapasitas();
  }, []);

  const toggleHari = (hari: string) => {
    setFormHari((prev) =>
      prev.includes(hari) ? prev.filter((h) => h !== hari) : [...prev, hari]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (formHari.length === 0) {
      setFormError('Pilih minimal 1 hari operasi.');
      return;
    }
    if (formMenit <= 0) {
      setFormError('Kapasitas harian harus lebih dari 0 menit.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        kapasitas_harian_menit: Number(formMenit),
        hari_operasi: formHari,
      };
      const res = await api.post('/api/owner/kapasitas', payload);
      const updated: Kapasitas = res.data.kapasitas || res.data.data || res.data;
      setKapasitas(updated);
      setSuccessMsg('Pengaturan kapasitas berhasil disimpan!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Gagal menyimpan pengaturan kapasitas');
    } finally {
      setIsSubmitting(false);
    }
  };

  const jam = Math.floor(formMenit / 60);
  const menit = formMenit % 60;

  return (
    <div className="fade-in">
      <div className="flex-between">
        <div>
          <h1 className="page-header">Kapasitas Produksi</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Atur jam kerja dan hari operasi dapur/pabrik Anda
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Info Card */}
      {!isLoading && kapasitas && (
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
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Kapasitas Harian
              </p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {kapasitas.kapasitas_harian_menit} menit
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {Math.floor(kapasitas.kapasitas_harian_menit / 60)} jam {kapasitas.kapasitas_harian_menit % 60} menit
              </p>
            </div>
          </div>

          {/* Hari Operasi */}
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
              <Settings2 size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Hari Operasi
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.375rem' }}>
                {kapasitas.hari_operasi?.length > 0 ? (
                  kapasitas.hari_operasi.map((h) => (
                    <span
                      key={h}
                      className="badge"
                      style={{ backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0', fontWeight: 600 }}
                    >
                      {h}
                    </span>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Belum diatur</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="card">
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings2 size={18} style={{ color: 'var(--primary)' }} />
            Ubah Pengaturan Kapasitas
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Sistem menggunakan pengaturan ini sebagai batas operasional untuk penjadwalan produksi.
          </p>
        </div>

        {isLoading ? (
          <div className="flex-center" style={{ padding: '2rem' }}>
            Memuat data...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {formError && <div className="alert alert-error">{formError}</div>}
            {successMsg && (
              <div className="alert" style={{ backgroundColor: '#F0FDF4', color: '#166534', borderColor: '#BBF7D0' }}>
                {successMsg}
              </div>
            )}

            {/* Kapasitas Harian Menit */}
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} />
                Kapasitas Harian (menit)
              </label>
              <input
                type="number"
                min="1"
                className="form-control"
                required
                value={formMenit}
                onChange={(e) => setFormMenit(Number(e.target.value))}
                placeholder="Contoh: 480 (= 8 jam)"
              />
              {formMenit > 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
                  Setara dengan: <strong style={{ color: 'var(--primary)' }}>{jam} jam {menit > 0 ? `${menit} menit` : ''}</strong> per hari operasi.
                </p>
              )}
            </div>

            {/* Hari Operasi */}
            <div className="form-group">
              <label>Hari Operasi</label>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Pilih hari-hari di mana UMKM Anda aktif beroperasi.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {HARI_OPTIONS.map((hari) => {
                  const isSelected = formHari.includes(hari);
                  return (
                    <button
                      type="button"
                      key={hari}
                      onClick={() => toggleHari(hari)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: isSelected ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                        backgroundColor: isSelected ? '#EEF2FF' : 'transparent',
                        color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: isSelected ? 600 : 400,
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isSelected ? <CheckSquare size={15} /> : <Square size={15} />}
                      {hari}
                    </button>
                  );
                })}
              </div>
              {formHari.length > 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.625rem' }}>
                  {formHari.length} hari dipilih: {formHari.join(', ')}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Save size={16} />
                {isSubmitting ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
