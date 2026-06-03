import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { 
  History, Monitor, Globe, Clock, 
  RefreshCw, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { getStorageUrl } from '../../lib/utils';

interface ActivityLog {
  id: number;
  log_name: string;
  description: string;
  event: string;
  created_at: string;
  properties: {
    ip_address?: string;
    user_agent?: string;
  };
  causer: {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  } | null;
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  const fetchLogs = async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/admin/activity-logs', { params: { page } });
      const { data } = res.data;
      
      setLogs(data.data || []);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page || Math.ceil(data.total / data.per_page),
        total: data.total
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil log aktivitas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-header">Log Aktivitas Keamanan</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Pantau riwayat login dan akses seluruh pengguna dalam sistem
          </p>
        </div>
        <button 
          className="btn btn-outline" 
          onClick={() => fetchLogs(pagination.current_page)}
          style={{ width: 'auto', display: 'flex', gap: '0.5rem' }}
          disabled={isLoading}
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Aktivitas</th>
                <th>Detail Teknis</th>
                <th>Waktu Kejadian</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && logs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="loader" style={{ margin: '0 auto 1rem' }}></div>
                    <p style={{ color: 'var(--text-muted)' }}>Memuat riwayat keamanan...</p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '4rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <History size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                      <p>Belum ada data aktivitas yang tercatat.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ minWidth: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--nav-active)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: '1px solid var(--border)', overflow: 'hidden' }}>
                          {log.causer?.avatar ? (
                            <img 
                              src={getStorageUrl(log.causer.avatar)!} 
                              alt={log.causer.name} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          ) : (
                            log.causer?.name?.charAt(0).toUpperCase() || '?'
                          )}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {log.causer?.name || 'Unknown User'}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {log.causer?.email || '-'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <span style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          width: 'fit-content',
                          gap: '0.25rem', 
                          backgroundColor: 'oklch(0.92 0.15 150 / 10%)', 
                          color: '#16A34A', 
                          padding: '0.2rem 0.5rem', 
                          borderRadius: '4px', 
                          fontSize: '0.7rem', 
                          fontWeight: 700, 
                          textTransform: 'uppercase',
                          border: '1px solid oklch(0.92 0.15 150 / 20%)'
                        }}>
                          {log.event}
                        </span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{log.description}</p>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Globe size={13} /> {log.properties.ip_address || '-'}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.properties.user_agent}>
                          <Monitor size={13} /> {log.properties.user_agent || '-'}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                        <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                        {formatDate(log.created_at)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--nav-active)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Menampilkan {logs.length} dari {pagination.total} log
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-outline" 
                style={{ width: 'auto', padding: '0.4rem' }}
                disabled={pagination.current_page === 1 || isLoading}
                onClick={() => fetchLogs(pagination.current_page - 1)}
              >
                <ChevronLeft size={18} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Halaman {pagination.current_page} dari {pagination.last_page}
              </div>
              <button 
                className="btn btn-outline" 
                style={{ width: 'auto', padding: '0.4rem' }}
                disabled={pagination.current_page === pagination.last_page || isLoading}
                onClick={() => fetchLogs(pagination.current_page + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
