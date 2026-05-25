import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { 
  Bug, Search, RefreshCw, ChevronLeft, ChevronRight,
  User, Globe, Terminal, 
  CheckCircle2, Trash2, Code, FileCode, 
  Info, AlertTriangle,
  X
} from 'lucide-react';

interface SystemError {
  id: number;
  user_id: number | null;
  ip_address: string;
  method: string;
  url: string;
  exception_class: string;
  message: string;
  file: string;
  line: number;
  trace: string[];
  payload: any;
  resolved: boolean;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function SystemErrors() {
  const [errors, setErrors] = useState<SystemError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    resolved: '', // '' (all), '1' (resolved), '0' (unresolved)
    search: ''
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  const [selectedError, setSelectedError] = useState<SystemError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchErrors = async (params = filters) => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/admin/system-errors', { params });
      const { data } = res.data;
      
      setErrors(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page || Math.ceil(data.total / (data.per_page || 15)),
        total: data.total
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengambil log error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchErrors(filters);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.resolved, filters.search, filters.page]);

  const handleToggleResolve = async (error: SystemError) => {
    try {
      setIsSubmitting(true);
      await api.put(`/api/admin/system-errors/${error.id}/resolve`, { 
        resolved: !error.resolved 
      });
      // Update local state for immediate feedback
      setErrors(prev => prev.map(e => e.id === error.id ? { ...e, resolved: !error.resolved } : e));
      if (selectedError?.id === error.id) {
        setSelectedError({ ...selectedError, resolved: !error.resolved });
      }
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui status error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Hapus log error ini permanen?')) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/api/admin/system-errors/${id}`);
      setErrors(prev => prev.filter(e => e.id !== id));
      if (selectedError?.id === id) setSelectedError(null);
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus log error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-header">Laporan Error Sistem</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Pantau dan selesaikan bug teknis (HTTP 500) yang terjadi pada platform
          </p>
        </div>
        <button 
          className="btn btn-outline" 
          onClick={() => fetchErrors()}
          style={{ width: 'auto', display: 'flex', gap: '0.5rem' }}
          disabled={isLoading}
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ── FILTERS ── */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Pencarian Bug</label>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Cari pesan error, file, URL, atau user..."
                className="form-control"
                style={{ paddingLeft: '3rem' }}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0, width: '180px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Status Penyelesaian</label>
            <select 
              className="form-control"
              value={filters.resolved}
              onChange={(e) => handleFilterChange('resolved', e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="0">🚨 Belum Selesai</option>
              <option value="1">✅ Sudah Selesai</option>
            </select>
          </div>
          
          <button className="btn btn-outline" style={{ height: '42px', padding: '0 1rem' }} onClick={() => setFilters({ page: 1, resolved: '', search: '' })}>
            Reset
          </button>
        </div>
      </div>

      {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

      {/* ── ERRORS TABLE ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Pesan Error & Lokasi</th>
                <th>User / IP</th>
                <th>Waktu</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && errors.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="loader" style={{ margin: '0 auto 1rem' }}></div>
                    <p style={{ color: 'var(--text-muted)' }}>Memindai laporan bug...</p>
                  </td>
                </tr>
              ) : errors.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '4rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <CheckCircle2 size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, color: '#16A34A' }} />
                      <p>Luar biasa! Tidak ada laporan error yang ditemukan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                errors.map((err) => (
                  <tr key={err.id} style={{ opacity: err.resolved ? 0.6 : 1 }}>
                    <td style={{ verticalAlign: 'top' }}>
                      <div 
                        onClick={() => handleToggleResolve(err)}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', backgroundColor: err.resolved ? 'oklch(0.92 0.15 150 / 10%)' : 'oklch(0.704 0.191 22.216 / 10%)', color: err.resolved ? '#16A34A' : '#DC2626' }}
                        title={err.resolved ? "Tandai Belum Selesai" : "Tandai Sudah Selesai"}
                      >
                        {err.resolved ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                      </div>
                    </td>
                    <td style={{ maxWidth: '450px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4 }}>{err.message}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          <FileCode size={12} />
                          <span style={{ fontFamily: 'monospace' }}>{err.file.split('\\').pop()}:{err.line}</span>
                          <span style={{ opacity: 0.5 }}>•</span>
                          <span style={{ fontWeight: 600 }}>{err.exception_class.split('\\').pop()}</span>
                        </div>
                        <div style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          <span style={{ color: '#8B5CF6', fontWeight: 800 }}>{err.method}</span>
                          <span title={err.url}>{err.url.replace(/^https?:\/\/[^/]+/, '')}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                          <User size={12} style={{ color: 'var(--text-muted)' }} />
                          {err.user?.name || 'Guest'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          <Globe size={10} /> {err.ip_address}
                        </div>
                      </div>
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {formatDate(err.created_at)}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '0.4rem', height: 'auto' }}
                          onClick={() => setSelectedError(err)}
                          title="Detail Debug"
                        >
                          <Terminal size={16} />
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '0.4rem', height: 'auto', border: 'none' }}
                          onClick={() => handleDelete(err.id)}
                          title="Hapus Log"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION ── */}
        {pagination.last_page > 1 && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--nav-active)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total {pagination.total} laporan bug
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-outline" 
                style={{ width: 'auto', padding: '0.4rem' }}
                disabled={pagination.current_page === 1 || isLoading}
                onClick={() => handleFilterChange('page', filters.page - 1)}
              >
                <ChevronLeft size={18} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {pagination.current_page} / {pagination.last_page}
              </div>
              <button 
                className="btn btn-outline" 
                style={{ width: 'auto', padding: '0.4rem' }}
                disabled={pagination.current_page === pagination.last_page || isLoading}
                onClick={() => handleFilterChange('page', filters.page + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── DEBUG DETAIL MODAL ── */}
      {selectedError && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '900px', width: '95%' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ backgroundColor: selectedError.resolved ? 'oklch(0.92 0.15 150 / 10%)' : 'oklch(0.704 0.191 22.216 / 10%)', color: selectedError.resolved ? '#16A34A' : '#DC2626', padding: '0.5rem', borderRadius: '8px' }}>
                  <Bug size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.1rem' }}>Detail Debugging</h2>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>LOG ID: #{selectedError.id}</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelectedError(null)}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '70vh', overflowY: 'auto', padding: '0.5rem' }}>
              
              {/* Error Header */}
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--nav-active)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3 style={{ color: '#DC2626', fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>{selectedError.exception_class}</h3>
                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 500 }}>{selectedError.message}</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
                    <FileCode size={14} /> {selectedError.file} <strong>:{selectedError.line}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Stack Trace */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Info size={14} /> Stack Trace (Top 15)
                  </h4>
                  <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-main)', overflowX: 'auto' }}>
                    {selectedError.trace.map((line, i) => (
                      <div key={i} style={{ padding: '0.2rem 0', borderBottom: i === selectedError.trace.length - 1 ? 'none' : '1px solid var(--border)', opacity: i > 5 ? 0.6 : 1 }}>
                        <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>{i + 1}</span>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payload */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Code size={14} /> Request Payload
                  </h4>
                  <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)', maxHeight: '300px', overflowY: 'auto' }}>
                    <pre style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                      {JSON.stringify(selectedError.payload || 'No Payload', null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <button className="btn btn-outline" style={{ width: 'auto' }} onClick={() => setSelectedError(null)}>Tutup</button>
              <button 
                className="btn btn-primary" 
                style={{ width: 'auto', background: selectedError.resolved ? 'var(--text-muted)' : 'var(--success)' }} 
                onClick={() => handleToggleResolve(selectedError)}
                disabled={isSubmitting}
              >
                {selectedError.resolved ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
