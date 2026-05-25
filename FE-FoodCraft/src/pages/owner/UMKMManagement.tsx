import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { 
  Plus, X, Building2, Edit2, MapPin, Phone, 
  Mail, Calendar} from 'lucide-react';

interface Staff {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface UMKM {
  id: number;
  name: string;
  description: string;
  address: string;
  phone?: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
  staffs?: Staff[];
}

export default function UMKMManagement() {
  const [umkm, setUmkm] = useState<UMKM | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: ''
  });

  const fetchUMKM = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/owner/umkm');
      // Payload: { message: "...", umkm: {id: 1, name: "...", staffs: [...] } }
      const data = res.data.umkm || res.data.data || res.data;
      
      if (Array.isArray(data)) {
        setUmkm(data[0] || null);
      } else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        setUmkm(data);
      } else {
        setUmkm(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data UMKM');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUMKM();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await api.post('/api/owner/umkm', formData);
      } else {
        await api.put('/api/owner/umkm', formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', description: '', address: '', phone: '' });
      fetchUMKM();
    } catch (err: any) {
      setError(err.response?.data?.message || `Gagal ${modalMode === 'create' ? 'membuat' : 'memperbarui'} UMKM`);
    }
  };

  const openEditModal = () => {
    if (!umkm) return;
    setModalMode('edit');
    setFormData({
      name: umkm.name,
      description: umkm.description || '',
      address: umkm.address,
      phone: umkm.phone || ''
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ name: '', description: '', address: '', phone: '' });
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="loader"></div>
        <p style={{ color: 'var(--text-muted)' }}>Memuat profil bisnis...</p>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-header">Manajemen Bisnis</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Kelola profil utama dan informasi operasional UMKM Anda
          </p>
        </div>
        {!umkm && (
          <button className="btn btn-primary" onClick={openCreateModal} style={{ width: 'auto' }}>
            <Plus size={18} /> Daftarkan UMKM
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!umkm ? (
        <div className="card flex-center" style={{ flexDirection: 'column', gap: '1.5rem', padding: '5rem 2rem', textAlign: 'center' }}>
          <div style={{ backgroundColor: 'var(--nav-active)', padding: '2rem', borderRadius: '50%' }}>
            <Building2 size={64} style={{ color: 'var(--primary)', opacity: 0.8 }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Belum Ada Data UMKM</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0.5rem auto 0' }}>
              Daftarkan UMKM Anda sekarang untuk mulai mengelola produksi, stok bahan baku, dan tim operasional.
            </p>
          </div>
          <button className="btn btn-primary" onClick={openCreateModal} style={{ width: 'auto', padding: '0.75rem 2rem' }}>
            Daftarkan Sekarang
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* ── HERO SECTION ── */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '120px', background: 'linear-gradient(135deg, var(--primary) 0%, #4338CA 100%)', position: 'relative' }}>
              <button 
                onClick={openEditModal}
                style={{ position: 'absolute', right: '1.5rem', bottom: '-1.5rem', width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--primary)', boxShadow: 'var(--shadow-md)', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                title="Edit Profil"
              >
                <Edit2 size={20} />
              </button>
            </div>
            
            <div style={{ padding: '2rem', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{umkm.name}</h2>
                {/* <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'oklch(0.92 0.15 150 / 10%)', color: '#16A34A', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid oklch(0.92 0.15 150 / 20%)' }}>
                  <BadgeCheck size={14} /> Terverifikasi
                </span> */}
              </div>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '800px' }}>
                {umkm.description || 'Belum ada deskripsi bisnis.'}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2.5rem', padding: '1.5rem', backgroundColor: 'var(--nav-active)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ color: 'var(--primary)', flexShrink: 0 }}><MapPin size={24} /></div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lokasi Operasional</h4>
                    <p style={{ color: 'var(--text-main)', marginTop: '0.25rem', fontWeight: 500 }}>{umkm.address}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ color: 'var(--primary)', flexShrink: 0 }}><Phone size={24} /></div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kontak Bisnis</h4>
                    <p style={{ color: 'var(--text-main)', marginTop: '0.25rem', fontWeight: 500 }}>{umkm.phone || '-'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ color: 'var(--primary)', flexShrink: 0 }}><Calendar size={24} /></div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bergabung Sejak</h4>
                    <p style={{ color: 'var(--text-main)', marginTop: '0.25rem', fontWeight: 500 }}>{new Date(umkm.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── STAFF SECTION ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Tim Produksi</h3>
              <span className="badge" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                {umkm.staffs?.length || 0} Orang
              </span>
            </div>

            {(!umkm.staffs || umkm.staffs.length === 0) ? (
              <div className="card flex-center" style={{ padding: '3rem', backgroundColor: 'transparent', border: '2px dashed var(--border)', boxShadow: 'none' }}>
                <p style={{ color: 'var(--text-muted)' }}>Belum ada staff yang ditugaskan ke unit ini.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {umkm.staffs.map(staff => (
                  <div key={staff.id} className="card" style={{ marginBottom: 0, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '12px', backgroundColor: 'var(--nav-active)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, border: '1px solid var(--border)' }}>
                      {staff.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{staff.name}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Mail size={14} /> {staff.email}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '6px', backgroundColor: 'oklch(0.5 0.2 260 / 10%)', color: 'var(--primary)', textTransform: 'uppercase' }}>
                        {staff.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Modal CRUD UMKM */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Daftarkan UMKM Baru' : 'Edit Profil Bisnis'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Bisnis / UMKM</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ paddingLeft: '3rem' }}
                    placeholder="Contoh: Bakso Pak Joko"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nomor Telepon Bisnis</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{ paddingLeft: '3rem' }}
                    placeholder="Contoh: 081234567890"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Deskripsi Bisnis</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Ceritakan sedikit tentang produk atau keunggulan bisnis Anda..."
                ></textarea>
              </div>

              <div className="form-group">
                <label>Alamat Operasional</label>
                <textarea
                  className="form-control"
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Alamat lengkap lokasi produksi/toko..."
                ></textarea>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>
                  {modalMode === 'create' ? 'Simpan & Daftarkan' : 'Perbarui Profil'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
