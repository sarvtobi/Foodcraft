export interface User {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'owner' | 'staff';
  created_at?: string;
  updated_at?: string;
}

export interface UMKM {
  id: number;
  owner_id: number;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Staff {
  id: number;
  user_id: number;
  umkm_id: number;
  status: string;
  created_at?: string;
  updated_at?: string;
  user?: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

export interface BahanBaku {
  id: number;
  umkm_id: number;
  nama: string;
  satuan: string;
  stok: number;
  stok_minimum: number;
  created_at?: string;
  updated_at?: string;
}

export interface Resep {
  id: number;
  produk_id: number;
  bahan_baku_id: number;
  kuantitas: number;
  bahan_baku?: BahanBaku;
  created_at?: string;
  updated_at?: string;
}

export interface Produk {
  id: number;
  umkm_id: number;
  nama: string;
  harga: number;
  deskripsi: string | null;
  waktu_produksi?: number;
  resep?: Resep[];
  created_at?: string;
  updated_at?: string;
}

export interface Kapasitas {
  id?: number;
  umkm_id?: number;
  kapasitas_harian_menit: number;
  hari_operasi: string[];
  created_at?: string;
  updated_at?: string;
}
