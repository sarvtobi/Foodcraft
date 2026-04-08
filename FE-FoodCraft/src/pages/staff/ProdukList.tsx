import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { ShoppingBag, List, X } from 'lucide-react';
import type { Produk } from '../../types';

export default function ProdukList() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isResepModalOpen, setIsResepModalOpen] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);

  const fetchProduk = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/staff/produk');
      const data = res.data.produk || res.data.data || res.data;
      setProdukList(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data produk');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  const openResepModal = async (produk: Produk) => {
    setSelectedProduk(produk);
    setIsResepModalOpen(true);
    
    // Optionally fetch specific details to guarantee fresh recipe data
    try {
      const res = await api.get(`/api/staff/produk/${produk.id}`);
      const detailedProduk = res.data.produk || res.data.data || res.data;
      if (detailedProduk) {
        setSelectedProduk(detailedProduk);
      }
    } catch(err) {
      console.error("Failed to fetch detailed product info", err);
    }
  };

  if (isLoading && produkList.length === 0) {
    return (
      <div className="flex-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex-between">
        <div>
          <h1 className="page-header">Daftar Menu Produksi</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Lihat panduan dan kebutuhan resep bahan baku untuk persiapan harian</p>
        </div>
      </div>

      {error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <div className="grid-cards">
          {produkList.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>Belum ada menu produk terdaftar.</p>
            </div>
          ) : (
            produkList.map((item) => (
              <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.nama}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {item.deskripsi || 'Tidak ada deskripsi'}
                    </p>
                  </div>
                  <div style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)', padding: '0.625rem', borderRadius: '12px', flexShrink: 0 }}>
                    <ShoppingBag size={20} />
                  </div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <button
                    onClick={() => openResepModal(item)}
                    className="btn btn-outline"
                    style={{ width: '100%', display: 'flex', gap: '0.5rem', color: 'var(--primary)', borderColor: '#E0E7FF' }}
                  >
                    <List size={18} /> Lihat Resep Persiapan
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Detail Resep Modal */}
      {isResepModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Detail Persiapan: {selectedProduk?.nama}</h2>
              <button className="modal-close" onClick={() => setIsResepModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div>
              {(!selectedProduk?.resep || selectedProduk.resep.length === 0) ? (
                <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius)', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Produk ini belum memiliki daftar resep (BOM).
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#EEF2FF', color: '#3730A3', padding: '0.75rem', borderRadius: '8px', fontSize: '0.875rem', border: '1px solid #E0E7FF' }}>
                    Gunakan takaran di bawah ini untuk persiapan produksi 1 unit <strong style={{ fontWeight: 600 }}>{selectedProduk.nama}</strong>.
                  </div>
                  <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                    {selectedProduk.resep.map((r, index) => (
                      <div key={r.id} style={{ 
                        padding: '0.75rem 1rem', 
                        backgroundColor: 'var(--surface)', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        borderBottom: index !== selectedProduk.resep!.length - 1 ? '1px solid var(--border)' : 'none'
                      }}>
                        <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                          {r.bahan_baku?.nama || `Bahan ID: ${r.bahan_baku_id}`}
                        </span>
                        <span className="badge" style={{ backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', color: '#475569' }}>
                          {r.kuantitas} {r.bahan_baku?.satuan}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setIsResepModalOpen(false)}
                className="btn btn-outline"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
