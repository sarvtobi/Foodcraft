import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Package } from 'lucide-react';
import type { BahanBaku } from '../../types';

export default function BahanBakuList() {
  const [bahanBakuList, setBahanBakuList] = useState<BahanBaku[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBahanBaku = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/staff/bahan-baku');
      const data = res.data.bahan_baku || res.data.data || res.data;
      setBahanBakuList(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data bahan baku');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBahanBaku();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Stok Bahan Baku</h1>
          <p className="text-gray-600 mt-1">Pantau stok bahan baku yang tersedia saat ini</p>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bahanBakuList.length === 0 ? (
            <div className="card flex-center" style={{ gridColumn: '1 / -1', padding: '5rem 2rem', textAlign: 'center', backgroundColor: 'transparent', border: '2px dashed var(--border)', boxShadow: 'none' }}>
              <div style={{ color: 'var(--text-muted)' }}>
                <Package size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                <p>Tidak ada data bahan baku yang dapat dilihat.</p>
              </div>
            </div>
          ) : (
            bahanBakuList.map((item) => (
              <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem', marginBottom: 0, transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ backgroundColor: 'var(--nav-active)', color: 'var(--primary)', padding: '0.625rem', borderRadius: '12px', flexShrink: 0 }}>
                    <Package size={22} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.3 }} title={item.nama}>
                    {item.nama}
                  </h3>
                </div>
                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Stok Aktual</p>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                    {item.stok} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>{item.satuan}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
