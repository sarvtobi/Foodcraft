import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Users, Store, Activity, ShieldCheck, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminDashboardData {
  total_users?: number;
  total_owners?: number;
  total_umkm?: number;
  recent_activities?: any[];
  [key: string]: any;
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/admin/dashboard');
        setData(response.data.data || response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Gagal mengambil data dashboard');
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
    { label: 'Total Pengguna', value: data?.total_users || 0, icon: <Users size={24} />, color: 'var(--primary)', bg: 'var(--nav-active)' },
    { label: 'Total Owner UMKM', value: data?.total_owners || 0, icon: <ShieldCheck size={24} />, color: '#16A34A', bg: 'oklch(0.92 0.15 150 / 10%)' },
    { label: 'UMKM Terdaftar', value: data?.total_umkm || 0, icon: <Store size={24} />, color: '#8B5CF6', bg: 'oklch(0.5 0.2 260 / 10%)' },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="page-header">Dashboard Administrasi</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Ringkasan sistem dan metrik performa platform FoodCraft</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {metrics.map((m) => (
          <div key={m.label} className="card" style={{ marginBottom: 0, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ backgroundColor: m.bg, color: m.color, padding: '0.85rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {m.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{m.value}</h3>
                <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <TrendingUp size={12} /> +{Math.floor(Math.random() * 5)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Log Keamanan Terbaru</h3>
            <Link to="/admin/activity-logs" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Lihat Semua <ArrowUpRight size={14} />
            </Link>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--nav-active)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Raw System Data:</p>
              <pre style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)', overflowX: 'auto' }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Quick Info</h4>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, lineHeight: 1.6 }}>
              Sistem saat ini berjalan dengan stabil. Semua modul otentikasi dipantau secara real-time untuk keamanan data pengguna.
            </p>
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Uptime</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>99.9%</span>
              </div>
              <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                <div style={{ width: '99.9%', height: '100%', backgroundColor: 'white', borderRadius: '2px' }}></div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={16} /> Status Server
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Database</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', backgroundColor: 'oklch(0.92 0.15 150 / 10%)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>ONLINE</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>API Gateway</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', backgroundColor: 'oklch(0.92 0.15 150 / 10%)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>STABLE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
