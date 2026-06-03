import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Package, ShoppingBag, 
  Clock, CheckCircle2, 
  Building2, ArrowRight, ChefHat, AlertTriangle, ChevronRight
} from 'lucide-react';
import { getStorageUrl } from '../../lib/utils';

import type { JadwalProduksi } from '../../types';

interface StaffDashboardData {
  umkm_name?: string;
  umkm_avatar?: string;
  umkm_profile?: string;
  status?: string;
}

export default function StaffDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<StaffDashboardData | null>(null);
  const [antrian, setAntrian] = useState<JadwalProduksi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const [dashRes, jadwalRes] = await Promise.all([
        api.get('/api/staff/dashboard'),
        api.get('/api/staff/jadwal-produksi', { params: { tanggal: today } })
      ]);

      setData(dashRes.data.data || dashRes.data);
      
      const jadwalData = jadwalRes.data.jadwal || jadwalRes.data.jadwal_produksis || jadwalRes.data.data || jadwalRes.data;
      const aktif = Array.isArray(jadwalData) ? jadwalData.filter((j: any) => j.status !== 'selesai') : [];
      setAntrian(aktif);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="loader"></div>
        <p style={{ color: 'var(--text-muted)' }}>Menyiapkan meja kerja Anda...</p>
      </div>
    );
  }

  const quickActions = [
    { label: 'Antrian Masak', icon: <ChefHat size={22} />, path: '/staff/jadwal-produksi', color: 'var(--primary)' },
    { label: 'Stok Bahan', icon: <Package size={22} />, path: '/staff/bahan-baku', color: '#0EA5E9' },
    { label: 'Daftar Produk', icon: <ShoppingBag size={22} />, path: '/staff/produk', color: '#8B5CF6' },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* ── HERO SECTION ── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          {/* <div style={{ width: '3rem', height: '3rem', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem' }}>
            {user?.name?.charAt(0).toUpperCase() || 'S'}
          </div> */}
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Halo, {user?.name}!</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Siap untuk memulai operasional produksi hari ini?</p>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        
        {/* ── LEFT COLUMN: STATS & TOOLS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Stats Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="card" style={{ marginBottom: 0, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--nav-active)', color: 'var(--primary)' }}>
                <ChefHat size={24} />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Antrian Aktif</p>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{antrian.length} Pesanan</h3>
              </div>
            </div>

            {/* <div className="card" style={{ marginBottom: 0, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'oklch(0.92 0.15 150 / 10%)', color: '#16A34A' }}>
                <Clock size={24} />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Status Kerja</p>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{data?.status || 'Aktif'}</h3>
              </div>
            </div> */}
          </div>

          {/* Quick Actions Grid */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>Akses Cepat Operasional</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {quickActions.map(action => (
                <Link key={action.label} to={action.path} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ marginBottom: 0, textAlign: 'center', padding: '1.5rem 1rem', transition: 'all 0.2s', border: '1px solid var(--border)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div style={{ color: action.color, marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                      {action.icon}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Tasks (Antrian Masak) */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Antrian Masak Hari Ini</h3>
              <Link to="/staff/jadwal-produksi" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Lihat Semua <ChevronRight size={14} />
              </Link>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {antrian.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {antrian.slice(0, 5).map((item) => {
                    const products = item.pesanan?.items?.map(it => it.produk?.nama).join(', ') || `Pesanan #${item.pesanan_id}`;
                    const totalQty = item.pesanan?.items?.reduce((sum, it) => sum + (it.kuantitas || 0), 0) || 0;
                    
                    return (
                      <div key={item.id} style={{ padding: '1rem', background: 'var(--nav-active)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', minWidth: 0 }}>
                          <div style={{ padding: '0.5rem', background: item.terlambat ? 'oklch(0.704 0.191 22.216 / 10%)' : 'var(--surface)', color: item.terlambat ? '#DC2626' : 'var(--primary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            {item.terlambat ? <AlertTriangle size={18} /> : <ChefHat size={18} />}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <h4 style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{products}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Porsi: <strong>{totalQty} unit</strong> · {item.pesanan?.pelanggan || 'Pelanggan'}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ background: 'var(--nav-active)', width: '3rem', height: '3rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--text-muted)' }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bagus! Belum ada antrian masak untuk saat ini.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: BUSINESS INFO ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', background: 'linear-gradient(to bottom, var(--primary) 60px, var(--surface) 60px)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ padding: '2rem 1.5rem 1.5rem' }}>
              <div style={{ width: '4.5rem', height: '4.5rem', borderRadius: '16px', background: 'var(--surface)', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1rem', border: '1px solid var(--border)', overflow: 'hidden' }}>
                {data?.umkm_avatar || data?.umkm_profile ? (
                  <img 
                    src={getStorageUrl(data.umkm_avatar || data.umkm_profile)!} 
                    alt="UMKM" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <Building2 size={32} />
                )}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Unit Bisnis</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{data?.umkm_name || 'FoodCraft Unit'}</h2>
              <div style={{ height: '2px', width: '2rem', background: 'var(--primary)', borderRadius: '1rem', marginBottom: '1.5rem' }}></div>
              
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Anda ditugaskan sebagai Staff Produksi di unit bisnis ini. Pastikan untuk memperbarui stok dan mencatat setiap output produksi.
              </p>

              <Link to="/staff/kapasitas" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: 'var(--nav-active)', borderRadius: '10px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                  Lihat Jam Operasional
                  <ArrowRight size={16} />
                </div>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
