import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { 
  Users, Store, Activity, ShieldCheck, TrendingUp, TrendingDown,
  ArrowUpRight, Bug, Zap, Globe, Clock, Server
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminDashboardData {
  metrics: {
    total_users: number;
    total_users_growth: number;
    total_umkms: number;
    total_umkm_trend: string;
    active_users_24h: number;
  };
  system_health: {
    avg_latency_ms: number;
    success_rate_percent: number;
  };
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/admin/dashboard');
        // Handle response mapping based on provide structure
        setData(response.data);
      } catch (err: any) {
        setError(err.message || 'Gagal mengambil data dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="loader"></div>
        <p style={{ color: 'var(--text-muted)' }}>Menganalisis sistem...</p>
      </div>
    );
  }

  const metrics = [
    { 
      label: 'Total Pengguna', 
      value: data?.metrics.total_users ?? 0, 
      growth: data?.metrics.total_users_growth,
      icon: <Users size={24} />, 
      color: 'var(--primary)', 
      bg: 'var(--nav-active)', 
      path: '/admin/users' 
    },
    { 
      label: 'UMKM Terdaftar', 
      value: data?.metrics.total_umkms ?? 0, 
      trend: data?.metrics.total_umkm_trend,
      icon: <Store size={24} />, 
      color: '#8B5CF6', 
      bg: 'oklch(0.5 0.2 260 / 10%)', 
      path: '/admin/users' 
    },
    { 
      label: 'User Aktif (24 Jam)', 
      value: data?.metrics.active_users_24h ?? 0, 
      icon: <Zap size={24} />, 
      color: '#D97706', 
      bg: 'oklch(0.895 0.147 85.34 / 10%)', 
      path: '/admin/activity-logs' 
    },
    { 
      label: 'Avg. Latency', 
      value: `${data?.system_health.avg_latency_ms.toFixed(1) ?? 0}ms`, 
      icon: <Activity size={24} />, 
      color: (data?.system_health.avg_latency_ms ?? 0) > 300 ? '#DC2626' : '#0EA5E9', 
      bg: 'oklch(0.5 0.2 200 / 10%)', 
      path: '/admin/api-logs' 
    },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-header">Dashboard Administrasi</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Pantau kesehatan infrastruktur dan pertumbuhan ekosistem FoodCraft</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {metrics.map((m) => (
          <Link key={m.label} to={m.path} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ marginBottom: 0, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', transition: 'all 0.2s', border: '1px solid var(--border)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
              <div style={{ backgroundColor: m.bg, color: m.color, padding: '0.85rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {m.icon}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{m.label}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{m.value}</h3>
                  {m.growth !== undefined && (
                    <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
                      <TrendingUp size={12} /> {m.growth}%
                    </span>
                  )}
                  {m.trend === 'up' && (
                    <span style={{ color: '#16A34A' }}><TrendingUp size={16} /></span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        {/* System Health Section */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--nav-active)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={18} style={{ color: 'var(--primary)' }} />
              Status Performa Sistem
            </h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', background: 'oklch(0.92 0.15 150 / 20%)', padding: '0.25rem 0.75rem', borderRadius: '999px', border: '1px solid oklch(0.92 0.15 150 / 30%)' }}>
              ACTIVE
            </span>
          </div>
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>Tingkat Keberhasilan Request</p>
                <div style={{ position: 'relative', height: '10px', backgroundColor: 'var(--border)', borderRadius: '5px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${data?.system_health.success_rate_percent ?? 0}%`, background: 'linear-gradient(to right, var(--primary), #16A34A)', borderRadius: '5px' }}></div>
                </div>
                <h4 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{data?.system_health.success_rate_percent ?? 0}%</h4>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>Rata-rata Waktu Respon</p>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', height: '10px', marginBottom: '0.5rem' }}>
                   <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '2px', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '0', top: 0, height: '100%', width: `${Math.min((data?.system_health.avg_latency_ms ?? 0) / 5, 100)}%`, background: (data?.system_health.avg_latency_ms ?? 0) > 300 ? '#DC2626' : 'var(--primary)', borderRadius: '2px' }}></div>
                   </div>
                </div>
                <h4 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{data?.system_health.avg_latency_ms.toFixed(1) ?? 0} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>ms</span></h4>
              </div>
            </div>
            
            <div style={{ marginTop: '2.5rem', padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <ShieldCheck size={18} style={{ color: '#16A34A' }} />
                <h5 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>Laporan Keamanan</h5>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Tidak ada anomali terdeteksi dalam 24 jam terakhir. Seluruh endpoint API dilindungi oleh rate-limiting dan sanitasi payload otomatis.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions & Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #4338CA 100%)', color: 'white', border: 'none', padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Sistem Dashboard</h4>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, lineHeight: 1.6 }}>
              Gunakan fitur Monitoring untuk meninjau log aktivitas keamanan dan mendeteksi bug sistem secara proaktif.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Link to="/admin/activity-logs" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>
                  Log Keamanan
                  <ArrowUpRight size={16} />
                </div>
              </Link>
              <Link to="/admin/system-errors" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>
                  Monitoring Error
                  <ArrowUpRight size={16} />
                </div>
              </Link>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={16} /> Lokasi Node API
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A' }}></div>
                   <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Main Cluster</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>Jakarta, ID</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A' }}></div>
                   <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Database Node</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>Singapore, SG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
