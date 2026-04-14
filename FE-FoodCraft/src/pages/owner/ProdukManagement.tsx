import { useState, useEffect, type FormEvent } from 'react';
import api from '../../lib/axios';
import { ShoppingBag, Edit2, Trash2, Plus, List, X } from 'lucide-react';
import type { Produk, BahanBaku } from '../../types';

export default function ProdukManagement() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [bahanBakuList, setBahanBakuList] = useState<BahanBaku[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals for Produk
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);

  // Modals for Resep
  const [isResepModalOpen, setIsResepModalOpen] = useState(false);

  // Form State Produk
  const [formProduk, setFormProduk] = useState({
    nama: '',
    harga: 0,
    deskripsi: '',
    waktu_produksi: 0
  });
  
  // Form State Resep
  const [formResep, setFormResep] = useState({
    bahan_baku_id: '',
    kuantitas: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [resProduk, resBahan] = await Promise.all([
        api.get('/api/owner/produk'),
        api.get('/api/owner/bahan-baku')
      ]);
      const pData = resProduk.data.produk || resProduk.data.data || resProduk.data;
      const bData = resBahan.data.bahan_baku || resBahan.data.data || resBahan.data;
      setProdukList(Array.isArray(pData) ? pData : []);
      setBahanBakuList(Array.isArray(bData) ? bData : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data produk dan bahan baku');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLER PRODUK ---
  const openCreateProduk = () => {
    setModalMode('create');
    setFormProduk({ nama: '', harga: 0, deskripsi: '', waktu_produksi: 0 });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const openEditProduk = (item: Produk) => {
    setModalMode('edit');
    setSelectedProduk(item);
    setFormProduk({ 
      nama: item.nama, 
      harga: item.harga || 0, 
      deskripsi: item.deskripsi || '',
      waktu_produksi: item.waktu_produksi || 0
    });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const openDeleteProduk = (item: Produk) => {
    setSelectedProduk(item);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitProduk = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    
    try {
      const payload = {
        nama: formProduk.nama,
        harga: Number(formProduk.harga),
        deskripsi: formProduk.deskripsi,
        waktu_produksi: Number(formProduk.waktu_produksi)
      };

      if (modalMode === 'create') {
        await api.post('/api/owner/produk', payload);
      } else {
        if (!selectedProduk) return;
        await api.put(`/api/owner/produk/${selectedProduk.id}`, payload);
      }
      
      setIsFormModalOpen(false);
      fetchData();
    } catch (err: any) {
      setFormError(err.response?.data?.message || `Gagal ${modalMode === 'create' ? 'menambah' : 'menyimpan'} produk`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduk = async () => {
    if (!selectedProduk) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/api/owner/produk/${selectedProduk.id}`);
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus produk');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- HANDLER RESEP ---
  const openResepModal = (produk: Produk) => {
    setSelectedProduk(produk);
    setFormResep({ bahan_baku_id: '', kuantitas: 0 });
    setFormError('');
    setIsResepModalOpen(true);
  };

  const handleAddResep = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedProduk) return;
    setIsSubmitting(true);
    setFormError('');
    try {
      await api.post(`/api/owner/produk/${selectedProduk.id}/resep`, {
        bahan_baku_id: Number(formResep.bahan_baku_id),
        kuantitas: Number(formResep.kuantitas)
      });
      setFormResep({ bahan_baku_id: '', kuantitas: 0 });
      // Refresh to get updated resep
      fetchData();
      
      // Update selectedProduk manually in state or rely on full refresh closing modal?
      // Better to fetch and update selectedProduk so modal stays open with latest data
      const res = await api.get(`/api/owner/produk/${selectedProduk.id}`);
      setSelectedProduk(res.data.produk || res.data.data || res.data);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Gagal menambah resep');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateResep = async (resepId: number, newKuantitas: number) => {
    if (!selectedProduk) return;
    try {
      await api.put(`/api/owner/resep/${resepId}`, { kuantitas: newKuantitas });
      fetchData();
      const res = await api.get(`/api/owner/produk/${selectedProduk.id}`);
      setSelectedProduk(res.data.produk || res.data.data || res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal update resep');
    }
  };

  const handleDeleteResep = async (resepId: number) => {
    if (!selectedProduk) return;
    try {
      await api.delete(`/api/owner/resep/${resepId}`);
      fetchData();
      const res = await api.get(`/api/owner/produk/${selectedProduk.id}`);
      setSelectedProduk(res.data.produk || res.data.data || res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus resep');
    }
  };

  return (
    <div className="fade-in">
      <div className="flex-between">
        <h1 className="page-header">Manajemen Produk & Resep</h1>
        <button className="btn btn-primary" onClick={openCreateProduk} style={{ width: 'auto' }}>
          <Plus size={18} /> Tambah Produk
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {isLoading ? (
          <div className="flex-center" style={{ padding: '2rem' }}>Loading...</div>
        ) : produkList.length === 0 ? (
          <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem', padding: '3rem 1rem' }}>
            <ShoppingBag size={48} color="var(--text-muted)" />
            <p style={{ color: 'var(--text-muted)' }}>Belum ada produk yang didaftarkan.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Produk</th>
                  <th>Deskripsi</th>
                  <th>Harga</th>
                  <th>Waktu Produksi</th>
                  <th>Jumlah Bahan</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {produkList.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td style={{ fontWeight: 500 }}>{item.nama}</td>
                    <td>{item.deskripsi || '-'}</td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>
                      Rp {item.harga?.toLocaleString('id-ID')}
                    </td>
                    <td>
                      {item.waktu_produksi != null && item.waktu_produksi > 0 ? (
                        <span className="badge" style={{ backgroundColor: '#FFF7ED', color: '#C2410C', border: '1px solid #FED7AA' }}>
                          ⏱ {item.waktu_produksi} mnt
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className="badge" style={{ backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0' }}>
                        {item.resep?.length || 0} Bahan
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.4rem 0.75rem', border: '1px solid var(--border)', color: 'var(--primary)', marginRight: '0.5rem', display: 'inline-flex', verticalAlign: 'middle' }} 
                        onClick={() => openResepModal(item)}
                        title="Kelola Resep"
                      >
                        <List size={16} /> Resep
                      </button>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.4rem', border: 'none', color: 'var(--text-main)', marginRight: '0.5rem', display: 'inline-flex', verticalAlign: 'middle' }} 
                        onClick={() => openEditProduk(item)}
                        title="Edit Produk"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '0.4rem', border: 'none', display: 'inline-flex', verticalAlign: 'middle' }} 
                        onClick={() => openDeleteProduk(item)}
                        title="Hapus Produk"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Produk Modal */}
      {isFormModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Tambah Produk' : 'Edit Produk'}</h2>
              <button className="modal-close" onClick={() => setIsFormModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitProduk}>
              {formError && <div className="alert alert-error">{formError}</div>}
              
              <div className="form-group">
                <label>Nama Produk</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formProduk.nama}
                  onChange={e => setFormProduk({ ...formProduk, nama: e.target.value })}
                  placeholder="Contoh: Roti Tawar"
                />
              </div>
              <div className="form-group">
                <label>Harga Jual (Rp)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  required
                  value={formProduk.harga}
                  onChange={e => setFormProduk({ ...formProduk, harga: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>
                  Waktu Produksi (menit/unit)
                  <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.5rem', fontSize: '0.8rem' }}>— berapa menit untuk 1 produk?</span>
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={formProduk.waktu_produksi}
                  onChange={e => setFormProduk({ ...formProduk, waktu_produksi: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Deskripsi (Opsional)</label>
                <textarea
                  rows={3}
                  className="form-control"
                  value={formProduk.deskripsi}
                  onChange={e => setFormProduk({ ...formProduk, deskripsi: e.target.value })}
                  placeholder="Deskripsi singkat mengenai produk..."
                ></textarea>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsFormModalOpen(false)}>Batal</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: 'auto' }}>
                  {isSubmitting ? 'Menyimpan...' : (modalMode === 'create' ? 'Simpan' : 'Update')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Produk Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Hapus Produk</h2>
              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              Apakah Anda yakin ingin menghapus produk <strong style={{ color: 'var(--text-main)' }}>{selectedProduk?.nama}</strong>? Tindakan ini akan menghapus semua takaran resep yang terkait.
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting}>Batal</button>
              <button type="button" className="btn btn-danger" onClick={handleDeleteProduk} disabled={isSubmitting} style={{ width: 'auto' }}>
                {isSubmitting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resep Modal */}
      {isResepModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Kelola Resep: {selectedProduk?.nama}</h2>
              <button className="modal-close" onClick={() => setIsResepModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* List Bahan di Produk ini */}
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  Bahan Terdaftar
                </h3>
                
                {(!selectedProduk?.resep || selectedProduk.resep.length === 0) ? (
                  <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', border: '1px dashed var(--border)', borderRadius: 'var(--radius)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Belum ada bahan baku dalam resep ini.
                  </div>
                ) : (
                  <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                    {selectedProduk.resep!.map((r, index) => (
                      <div key={r.id} style={{ 
                        padding: '0.875rem 1rem', 
                        backgroundColor: 'var(--surface)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        gap: '1rem',
                        borderBottom: index !== selectedProduk.resep!.length - 1 ? '1px solid var(--border)' : 'none'
                      }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.875rem' }}>
                            {r.bahan_baku?.nama || `Bahan ID: ${r.bahan_baku_id}`}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            <span style={{ display: 'inline-block', backgroundColor: '#F1F5F9', padding: '0.125rem 0.5rem', borderRadius: '4px', fontWeight: 500, border: '1px solid #E2E8F0', color: '#475569' }}>
                              Total: {r.kuantitas} {r.bahan_baku?.satuan || 'unit'}
                            </span>
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           {/* Quick update quantity input */}
                          <input 
                            type="number" 
                            className="form-control"
                            style={{ width: '80px', padding: '0.375rem 0.5rem', fontSize: '0.875rem' }}
                            defaultValue={r.kuantitas}
                            onBlur={(e) => {
                              const val = Number(e.target.value);
                              if (val !== r.kuantitas && val > 0) handleUpdateResep(r.id, val);
                            }}
                          />
                          <button
                            onClick={() => handleDeleteResep(r.id)}
                            className="btn btn-danger"
                            style={{ padding: '0.4rem', border: 'none' }}
                            title="Hapus Bahan"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <hr style={{ borderColor: 'var(--border)', margin: 0 }} />

              {/* Form Tambah Bahan ke Resep */}
              <form onSubmit={handleAddResep} style={{ backgroundColor: '#EEF2FF', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid #E0E7FF' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3730A3', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={16} /> Tambah Bahan Baku Baru
                </h3>
                
                {formError && <div style={{ marginBottom: '0.75rem', fontSize: '0.875rem', color: 'var(--danger)', fontWeight: 500 }}>{formError}</div>}
                
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Pilih Bahan</label>
                    <select
                      required
                      value={formResep.bahan_baku_id}
                      onChange={e => setFormResep({ ...formResep, bahan_baku_id: e.target.value })}
                      className="form-control"
                      style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                    >
                      <option value="" disabled>-- Pilih --</option>
                      {bahanBakuList.map((b) => (
                        <option key={b.id} value={b.id}>{b.nama} ({b.satuan})</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: '100px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Takaran</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={formResep.kuantitas || ''}
                      onChange={e => setFormResep({ ...formResep, kuantitas: Number(e.target.value) })}
                      className="form-control"
                      style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                      placeholder="0"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formResep.bahan_baku_id}
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1rem', height: '37px', width: 'auto' }}
                  >
                    {isSubmitting ? '...' : 'Tambah'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setIsResepModalOpen(false)}>Selesai</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

