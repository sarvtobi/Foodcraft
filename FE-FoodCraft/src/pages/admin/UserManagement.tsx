import { useState, useEffect, type FormEvent } from 'react';
import api from '../../lib/axios';
import Modal from '../../components/Modal';
import { Users, Edit2, Trash2 } from 'lucide-react';
import type { User } from '../../types';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/admin/users');
      const uData = res.data.users || res.data.data || res.data;
      setUsers(Array.isArray(uData) ? uData : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openUpdateModal = (user: User) => {
    setSelectedUser(user);
    setFormData({ name: user.name || '', email: user.email || '', password: '' });
    setFormError('');
    setIsUpdateModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setFormError('');
    setValidationErrors({});
    setIsSubmitting(true);
    try {
      const payload: any = { name: formData.name, email: formData.email };
      if (formData.password) payload.password = formData.password;
      
      await api.put(`/api/admin/users/${selectedUser.id}`, payload);
      setIsUpdateModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setFormError(err.message || 'Update failed');
      if (err.errors) setValidationErrors(err.errors);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/api/admin/users/${selectedUser.id}`);
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-header">Manajemen Pengguna</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Kelola data akses owner dan staff dalam sistem</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 bg-gray-50/30 dark:bg-gray-800/20">
          <Users size={20} className="text-gray-500" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>Daftar Pengguna</h2>
        </div>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama & Email</th>
                <th>Role Akses</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Tidak ada data pengguna.</p>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: 'var(--nav-active)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: '1px solid var(--border)' }}>
                          {u.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.name}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        display: 'inline-flex',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: u.role === 'super_admin' ? 'oklch(0.704 0.191 22.216 / 10%)' : u.role === 'owner' ? 'oklch(0.5 0.2 260 / 10%)' : 'oklch(0.92 0.15 150 / 10%)',
                        color: u.role === 'super_admin' ? '#DC2626' : u.role === 'owner' ? 'var(--primary)' : '#16A34A',
                        border: `1px solid ${u.role === 'super_admin' ? 'oklch(0.704 0.191 22.216 / 20%)' : u.role === 'owner' ? 'oklch(0.5 0.2 260 / 20%)' : 'oklch(0.92 0.15 150 / 20%)'}`
                      }}>
                        {u.role ? u.role.replace('_', ' ') : 'USER'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {u.role !== 'super_admin' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openUpdateModal(u)}
                            className="btn btn-outline"
                            style={{ padding: '0.4rem', border: 'none' }}
                            title="Edit User"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(u)}
                            className="btn btn-danger"
                            style={{ padding: '0.4rem', border: 'none' }}
                            title="Hapus User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} title="Update User">
        {formError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{formError}</div>
        )}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {validationErrors.name && <p className="mt-1 text-xs text-red-600">{validationErrors.name[0]}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {validationErrors.email && <p className="mt-1 text-xs text-red-600">{validationErrors.email[0]}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password (Opsional)</label>
            <input
              type="password"
              placeholder="Kosongkan jika tidak diubah"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {validationErrors.password && <p className="mt-1 text-xs text-red-600">{validationErrors.password[0]}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Hapus User">
        <div className="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus pengguna <span className="font-semibold text-gray-900">{selectedUser?.name}</span>? Tindakan ini tidak dapat dibatalkan.
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            disabled={isSubmitting}
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={isSubmitting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
          >
            <Trash2 size={16} />
            {isSubmitting ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
