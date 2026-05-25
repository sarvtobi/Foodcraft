import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { 
  History, ClipboardList, Package, 
  ShoppingBag, RefreshCw, ChevronLeft, ChevronRight,
  ArrowRight, Info, PlusCircle, Edit, Trash2
} from 'lucide-react';

interface ActivityLog {
  id: number;
  log_name: string;
  description: string;
  event: string;
  created_at: string;
  properties: {
    attributes?: Record<string, any>;
    old?: Record<string, any>;
  };
  causer: {
    id: number;
    name: string;
    role: string;
  } | null;
  subject?: any;
}

interface ActivityLogsPageProps {
  apiPath: string;
  title: string;
  subtitle: string;
}

export default function ActivityLogsPage({ apiPath, title, subtitle }: ActivityLogsPageProps) {
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
      const res = await api.get(apiPath, { params: { page } });
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
  }, [apiPath]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLogIcon = (logName: string) => {
    switch (logName) {
      case 'pesanan': return <ClipboardList size={18} />;
      case 'bahan_baku': return <Package size={18} />;
      case 'produk': return <ShoppingBag size={18} />;
      default: return <History size={18} />;
    }
  };

  const getEventBadge = (event: string) => {
    const styles: Record<string, { bg: string, color: string, icon: any }> = {
      created: { bg: 'oklch(0.92 0.15 150 / 10%)', color: '#16A34A', icon: <PlusCircle size={12} /> },
      updated: { bg: 'oklch(0.5 0.2 260 / 10%)', color: 'var(--primary)', icon: <Edit size={12} /> },
      deleted: { bg: 'oklch(0.704 0.191 22.216 / 10%)', color: '#DC2626', icon: <Trash2 size={12} /> },
    };
    const style = styles[event] || { bg: 'var(--nav-active)', color: 'var(--text-muted)', icon: <Info size={12} /> };
    
    return (
      <span style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.35rem', 
        backgroundColor: style.bg, 
        color: style.color, 
        padding: '0.2rem 0.6rem', 
        borderRadius: '6px', 
        fontSize: '0.7rem', 
        fontWeight: 700, 
        textTransform: 'uppercase' 
      }}>
        {style.icon} {event}
      </span>
    );
  };

  const renderChanges = (log: ActivityLog) => {
    if (log.event !== 'updated' || !log.properties?.attributes) return null;

    const changes = Object.keys(log.properties.attributes).filter(key => key !== 'updated_at');
    if (changes.length === 0) return null;

    return (
      <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {changes.map(key => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500, textTransform: 'capitalize' }}>{key.replace('_', ' ')}:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>{String(log.properties.old?.[key] || '-')}</span>
              <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{String(log.properties.attributes?.[key])}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-header">{title}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{subtitle}</p>
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
                <th>Aktor</th>
                <th>Aktivitas & Perubahan</th>
                <th>Modul</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && logs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="loader" style={{ margin: '0 auto 1rem' }}></div>
                    <p style={{ color: 'var(--text-muted)' }}>Memuat riwayat aktivitas...</p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '4rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <History size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                      <p>Belum ada riwayat aktivitas yang tercatat.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ verticalAlign: 'top', width: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '10px', backgroundColor: 'var(--nav-active)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: '1px solid var(--border)', flexShrink: 0 }}>
                          {log.causer?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {log.causer?.name || 'Sistem'}
                          </p>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            {log.causer?.role || 'System'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {getEventBadge(log.event)}
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>{log.description}</p>
                        </div>
                        {renderChanges(log)}
                      </div>
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', backgroundColor: 'var(--nav-active)', padding: '0.3rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        {getLogIcon(log.log_name)}
                        <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{log.log_name.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td style={{ verticalAlign: 'top' }}>
                      <div style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 500 }}>
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
              Total {pagination.total} aktivitas
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
                {pagination.current_page} / {pagination.last_page}
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
