import { useState, type FormEvent, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';
import { X, Camera, Eye, EyeOff } from 'lucide-react';
import { getStorageUrl } from '../lib/utils';
import type { User } from '../types';

interface ProfileUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProfileUpdateModal({ isOpen, onClose, onSuccess }: ProfileUpdateModalProps) {
  const { user, login, token } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Ukuran file maksimal 2MB');
        return;
      }
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('name', name);
      formData.append('email', email);
      if (password) formData.append('password', password);
      if (avatar) formData.append('avatar', avatar);

      const res = await api.post('/api/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const updatedUser: User = res.data.user || res.data.data;
      if (token && updatedUser) {
        login(token, updatedUser); 
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui profil.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview;
    if (user?.avatar) return getStorageUrl(user.avatar);
    return null;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Update Profil</h2>
          <button className="modal-close" onClick={onClose} type="button">
            <X size={24} />
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Avatar Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <div 
              style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--nav-active)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                border: '2px solid var(--border)',
                cursor: 'pointer'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {getAvatarUrl() ? (
                <img src={getAvatarUrl()!} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                <Camera color="white" size={24} />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
            <button 
              type="button" 
              className="link" 
              style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}
              onClick={() => fileInputRef.current?.click()}
            >
              Ganti Foto Profil
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="pname">Nama Lengkap</label>
            <input
              id="pname"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pemail">Email</label>
            <input
              id="pemail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ppassword">Password <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>(Opsional - Kosongkan jika tidak ingin diubah)</span></label>
            <div style={{ position: 'relative' }}>
              <input
                id="ppassword"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: 'auto' }}
            >
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

