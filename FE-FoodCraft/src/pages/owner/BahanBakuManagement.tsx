import { useState, useEffect, type FormEvent } from 'react';
import api from '../../lib/axios';
import { Package, Edit2, Trash2, Plus, X } from 'lucide-react';
import type { BahanBaku } from '../../types';

export default function BahanBakuManagement() {
  const [bahanBakuList, setBahanBakuList] = useState<BahanBaku[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  const [selectedItem, setSelectedItem] = useState<BahanBaku | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    satuan: '',
    stok: 0,
    stok_minimum: 0
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBahanBaku = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/owner/bahan-baku');
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

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ nama: '', satuan: '', stok: 0, stok_minimum: 0 });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const openEditModal = (item: BahanBaku) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormData({ 
      nama: item.nama, 
      satuan: item.satuan, 
      stok: item.stok || 0, 
      stok_minimum: item.stok_minimum || 0 
    });
    setFormError('');
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (item: BahanBaku) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    
    try {
      if (modalMode === 'create') {
        const payload = {
          nama: formData.nama,
          satuan: formData.satuan,
          stok: Number(formData.stok),
          stok_minimum: Number(formData.stok_minimum)
        };
        await api.post('/api/owner/bahan-baku', payload);
      } else {
        if (!selectedItem) return;
        const payload = {
          nama: formData.nama,
          satuan: formData.satuan,
          stok: Number(formData.stok),
          stok_minimum: Number(formData.stok_minimum)
        };
        await api.put(`/api/owner/bahan-baku/${selectedItem.id}`, payload);
      }
      
      setIsFormModalOpen(false);
      fetchBahanBaku();
    } catch (err: any) {
      setFormError(err.response?.data?.message || `Gagal ${modalMode === 'create' ? 'menambah' : 'menyimpan'} bahan baku`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/api/owner/bahan-baku/${selectedItem.id}`);
      setIsDeleteModalOpen(false);
      fetchBahanBaku();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus bahan baku');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="flex-between">
        <h1 className="page-header">Manajemen Bahan Baku</h1>
        <button className="btn btn-primary" onClick={openCreateModal} style={{ width: 'auto' }}>
          <Plus size={18} /> Tambah Bahan Baku
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        {isLoading ? (
          <div className="flex-center" style={{ padding: '2rem' }}>Loading...</div>
        ) : bahanBakuList.length === 0 ? (
          <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem', padding: '3rem 1rem' }}>
            <Package size={48} color="var(--text-muted)" />
            <p style={{ color: 'var(--text-muted)' }}>Belum ada bahan baku yang didaftarkan.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Bahan</th>
                  <th>Satuan</th>
                  <th>Stok Saat Ini</th>
                  <th>Stok Min.</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {bahanBakuList.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td style={{ fontWeight: 500 }}>{item.nama}</td>
                    <td>{item.satuan}</td>
                    <td>
                      <span className={`badge ${item.stok <= item.stok_minimum ? 'badge-warning' : 'badge-success'}`}>
                        {item.stok}
                      </span>
                    </td>
                    <td>{item.stok_minimum}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.4rem', border: 'none', color: 'var(--text-main)', marginRight: '0.5rem' }} 
                        onClick={() => openEditModal(item)}
                        title="Edit Bahan"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '0.4rem', border: 'none' }} 
                        onClick={() => openDeleteModal(item)}
                        title="Hapus Bahan"
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

      {/* Form Modal */}
      {isFormModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Tambah Bahan Baku' : 'Edit Bahan Baku'}</h2>
              <button className="modal-close" onClick={() => setIsFormModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {formError && <div className="alert alert-error">{formError}</div>}
              
              <div className="form-group">
                <label>Nama Bahan Baku</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Tepung Terigu"
                />
              </div>
              <div className="form-group">
                <label>Satuan</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.satuan}
                  onChange={e => setFormData({ ...formData, satuan: e.target.value })}
                  placeholder="Contoh: Kilogram (kg)"
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Stok Awal</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.stok}
                    onChange={e => setFormData({ ...formData, stok: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Stok Minimum</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.stok_minimum}
                    onChange={e => setFormData({ ...formData, stok_minimum: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsFormModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: 'auto' }}>
                  {isSubmitting ? 'Menyimpan...' : (modalMode === 'create' ? 'Simpan' : 'Update')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Hapus Bahan Baku</h2>
              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              Apakah Anda yakin ingin menghapus bahan baku <strong style={{ color: 'var(--text-main)' }}>{selectedItem?.nama}</strong>? Tindakan ini tidak dapat dibatalkan dan dapat berimbas pada resep yang mengharuskannya.
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting}>Batal</button>
              <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={isSubmitting} style={{ width: 'auto' }}>
                {isSubmitting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
