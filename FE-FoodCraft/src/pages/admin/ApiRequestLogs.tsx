import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { 
  Activity, Search, RefreshCw, ChevronLeft, ChevronRight,
  Globe, Clock, Terminal, User, AlertCircle, Code, Filter,
  ExternalLink, BarChart2
} from 'lucide-react';

interface ApiLog {
  id: number;
  user_id: number | null;
  ip_address: string;
  method: string;
  url: string;
  payload: any;
  status_code: number;
  duration_ms: number;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function ApiRequestLogs() {
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    method: '',
    status_code: '',
    search: ''
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 15
  });

  const [selectedPayload, setSelectedPayload] = useState<any>(null);

  const fetchLogs = async (params = filters) => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/admin/api-logs', { params });
      const { data } = res.data;
      
      setLogs(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
        per_page: data.per_page
      });
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil log API');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs(filters);
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [filters.method, filters.status_code, filters.search, filters.page]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return '#16A34A'; // Success
    if (code >= 400 && code < 500) return '#D97706'; // Client Error
    if (code >= 500) return '#DC2626'; // Server Error
    return 'var(--text-muted)';
  };

  const getStatusBg = (code: number) => {
    if (code >= 200 && code < 300) return 'oklch(0.92 0.15 150 / 10%)';
    if (code >= 400 && code < 500) return 'oklch(0.895 0.147 85.34 / 10%)';
    if (code >= 500) return 'oklch(0.704 0.191 22.216 / 10%)';
    return 'var(--nav-active)';
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return '#0EA5E9';
      case 'POST': return '#16A34A';
      case 'PUT': return '#8B5CF6';
      case 'DELETE': return '#DC2626';
      default: return 'var(--text-muted)';
    }
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
          <h1 className="page-header">Monitoring API Request</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Pantau performa dan traffic API sistem secara real-time
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-outline" 
            onClick={() => fetchLogs()}
            style={{ width: 'auto', display: 'flex', gap: '0.5rem' }}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Pencarian</label>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Cari URL, IP, atau Nama User..."
                className="form-control"
                style={{ paddingLeft: '3rem' }}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0, width: '140px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Method</label>
            <select 
              className="form-control"
              value={filters.method}
              onChange={(e) => handleFilterChange('method', e.target.value)}
            >
              <option value="">Semua</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0, width: '140px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Status</label>
            <select 
              className="form-control"
              value={filters.status_code}
              onChange={(e) => handleFilterChange('status_code', e.target.value)}
            >
              <option value="">Semua</option>
              <option value="200">200 OK</option>
              <option value="201">201 Created</option>
              <option value="422">422 Validation</option>
              <option value="401">401 Unauthorized</option>
              <option value="403">403 Forbidden</option>
              <option value="404">404 Not Found</option>
              <option value="500">500 Server Error</option>
            </select>
          </div>
          
          <button className="btn btn-outline" style={{ height: '42px', padding: '0 1rem' }} onClick={() => setFilters({ page: 1, method: '', status_code: '', search: '' })}>
            Reset
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* ── LOGS TABLE ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Status & Method</th>
                <th>Endpoint URL</th>
                <th>User / IP</th>
                <th>Latency</th>
                <th>Waktu</th>
                <th style={{ textAlign: 'right' }}>Payload</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && logs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="loader" style={{ margin: '0 auto 1rem' }}></div>
                    <p style={{ color: 'var(--text-muted)' }}>Menganalisis traffic API...</p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '4rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <Activity size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                      <p>Tidak ada log request yang ditemukan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ 
                          width: '45px',
                          textAlign: 'center',
                          backgroundColor: getStatusBg(log.status_code), 
                          color: getStatusColor(log.status_code), 
                          padding: '0.25rem', 
                          borderRadius: '6px', 
                          fontSize: '0.8rem', 
                          fontWeight: 800,
                          border: `1px solid ${getStatusColor(log.status_code)}40`
                        }}>
                          {log.status_code}
                        </span>
                        <span style={{ color: getMethodColor(log.method), fontWeight: 800, fontSize: '0.75rem', width: '40px' }}>
                          {log.method}
                        </span>
                      </div>
                    </td>
                    <td style={{ maxWidth: '300px' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }} title={log.url}>
                        {log.url.replace(/^https?:\/\/[^/]+/, '')}
                      </p>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                          <User size={12} style={{ color: 'var(--text-muted)' }} />
                          {log.user?.name || 'Guest'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          <Globe size={10} /> {log.ip_address}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: log.duration_ms > 500 ? '#DC2626' : 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600 }}>
                        <BarChart2 size={14} style={{ color: 'var(--text-muted)' }} />
                        {log.duration_ms}ms
                      </div>
                    </td>
                    <td>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {formatDate(log.created_at)}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {log.payload ? (
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '0.35rem 0.6rem', height: 'auto', fontSize: '0.75rem' }}
                          onClick={() => setSelectedPayload(log.payload)}
                        >
                          <Code size={14} /> View
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>None</span>
                      )}
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
              Menampilkan {logs.length} dari {pagination.total} log request
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-outline" 
                style={{ width: 'auto', padding: '0.4rem' }}
                disabled={pagination.current_page === 1 || isLoading}
                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
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
                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── PAYLOAD MODAL ── */}
      {selectedPayload && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ backgroundColor: 'var(--nav-active)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '8px' }}>
                  <Terminal size={20} />
                </div>
                <h2>Request Payload</h2>
              </div>
              <button className="modal-close" onClick={() => setSelectedPayload(null)}>
                <AlertCircle size={24} />
              </button>
            </div>
            
            <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', maxHeight: '400px', overflowY: 'auto' }}>
              <pre style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontFamily: 'monospace', lineHeight: 1.5 }}>
                {JSON.stringify(selectedPayload, null, 2)}
              </pre>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setSelectedPayload(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
