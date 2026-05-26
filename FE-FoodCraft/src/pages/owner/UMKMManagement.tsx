import { useState, useEffect, useRef } from 'react';
import api from '../../lib/axios';
import { 
  Plus, X, Building2, Edit2, MapPin, Phone, 
  Mail, Calendar, Camera, Info, BadgeCheck 
} from 'lucide-react';

interface Staff {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  created_at: string;
}

interface UMKM {
  id: number;
  name: string;
  description: string;
  address: string;
  phone?: string;
  profile?: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: ''
  });
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const fetchUMKM = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/owner/umkm');
      const data = res.data.umkm || res.data.data || res.data;
      
      if (Array.isArray(data)) {
        setUmkm(data[0] || null);
      } else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        setUmkm(data);
      } else {
        setUmkm(null);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data UMKM');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUMKM();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB');
        return;
      }
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('address', formData.address);
      data.append('phone', formData.phone);
      if (profileFile) data.append('profile', profileFile);

      if (modalMode === 'create') {
        await api.post('/api/owner/umkm', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        data.append('_method', 'PUT');
        await api.post('/api/owner/umkm', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      setIsModalOpen(false);
      setFormData({ name: '', description: '', address: '', phone: '' });
      setProfileFile(null);
      setProfilePreview(null);
      fetchUMKM();
    } catch (err: any) {
      setError(err.message || `Gagal ${modalMode === 'create' ? 'membuat' : 'memperbarui'} UMKM`);
    } finally {
      setIsSubmitting(false);
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
    setProfilePreview(umkm.profile ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${umkm.profile}` : null);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ name: '', description: '', address: '', phone: '' });
    setProfileFile(null);
    setProfilePreview(null);
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

  const getProfileImg = () => {
    if (umkm?.profile) return `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${umkm.profile}`;
    return null;
  };

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
          
          {/* ── PROFILE HEADER ── */}
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Avatar Column */}
              <div 
                style={{ width: '150px', height: '150px', borderRadius: '24px', backgroundColor: 'var(--nav-active)', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', flexShrink: 0 }}
                onClick={openEditModal}
              >
                {getProfileImg() ? (
                  <img src={getProfileImg()!} alt="UMKM Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <Building2 size={64} />
                  </div>
                )}
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                  <Camera color="white" size={24} />
                </div>
              </div>

              {/* Info Column */}
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{umkm.name}</h2>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'oklch(0.92 0.15 150 / 10%)', color: '#16A34A', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid oklch(0.92 0.15 150 / 20%)' }}>
                        <BadgeCheck size={14} /> Terverifikasi
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                      {umkm.description || 'Belum ada deskripsi bisnis.'}
                    </p>
                  </div>
                  <button className="btn btn-outline" onClick={openEditModal} style={{ width: 'auto', gap: '0.5rem' }}>
                    <Edit2 size={16} /> Edit Profil
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--nav-active)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ color: 'var(--primary)', flexShrink: 0 }}><MapPin size={18} /></div>
                    <div>
                      <h4 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lokasi</h4>
                      <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>{umkm.address}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ color: 'var(--primary)', flexShrink: 0 }}><Phone size={18} /></div>
                    <div>
                      <h4 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kontak</h4>
                      <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>{umkm.phone || '-'}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ color: 'var(--primary)', flexShrink: 0 }}><Calendar size={18} /></div>
                    <div>
                      <h4 style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sejak</h4>
                      <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 }}>{new Date(umkm.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</p>
                    </div>
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
                    <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '12px', backgroundColor: 'var(--nav-active)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0 }}>
                      {staff.avatar ? (
                        <img 
                          src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${staff.avatar}`} 
                          alt={staff.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        staff.name.charAt(0).toUpperCase()
                      )}
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
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Daftarkan UMKM Baru' : 'Edit Profil Bisnis'}</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Profile Image Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                <div 
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--nav-active)', 
                    border: '2px dashed var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {profilePreview ? (
                    <img src={profilePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <Camera size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0 0.5rem' }}>Pilih Logo</p>
                    </>
                  )}
                  {profilePreview && (
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                      <Camera color="white" size={24} />
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <button type="button" className="link" onClick={() => fileInputRef.current?.click()} style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                  {profilePreview ? 'Ganti Logo Bisnis' : 'Unggah Logo Bisnis'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Nama Bisnis</label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      style={{ paddingLeft: '2.75rem' }}
                      placeholder="Nama UMKM Anda"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Nomor Telepon</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      style={{ paddingLeft: '2.75rem' }}
                      placeholder="0812..."
                    />
                  </div>
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
                  style={{ resize: 'none' }}
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
                  style={{ resize: 'none' }}
                ></textarea>
              </div>
              
              <div className="modal-footer" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: 'auto' }}>
                  {isSubmitting ? 'Memproses...' : (modalMode === 'create' ? 'Simpan & Daftarkan' : 'Perbarui Profil')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
