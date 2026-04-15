import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Pages placeholders (will be implemented completely later)
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUserManagement from './pages/admin/UserManagement';

import OwnerDashboard from './pages/owner/Dashboard';
import UMKMManagement from './pages/owner/UMKMManagement';
import StaffManagement from './pages/owner/StaffManagement';
import BahanBakuManagement from './pages/owner/BahanBakuManagement';
import ProdukManagement from './pages/owner/ProdukManagement';

import StaffDashboard from './pages/staff/Dashboard';
import StaffBahanBakuList from './pages/staff/BahanBakuList';
import StaffProdukList from './pages/staff/ProdukList';
import KapasitasManagement from './pages/owner/KapasitasManagement';
import KapasitasInfo from './pages/staff/KapasitasInfo';
import PesananManagement from './pages/PesananManagement';
import JadwalProduksi from './pages/JadwalProduksi';
import DasborAnalitik from './pages/owner/DasborAnalitik';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Super Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUserManagement />} />
              </Route>

              {/* Owner Routes */}
              <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
                <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                <Route path="/owner/umkm" element={<UMKMManagement />} />
                <Route path="/owner/staff" element={<StaffManagement />} />
                <Route path="/owner/bahan-baku" element={<BahanBakuManagement />} />
                <Route path="/owner/produk" element={<ProdukManagement />} />
                <Route path="/owner/kapasitas" element={<KapasitasManagement />} />
                <Route path="/owner/pesanan" element={<PesananManagement />} />
                <Route path="/owner/jadwal-produksi" element={<JadwalProduksi />} />
                <Route path="/owner/analitik" element={<DasborAnalitik />} />
              </Route>

              {/* Staff Routes */}
              <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
                <Route path="/staff/dashboard" element={<StaffDashboard />} />
                <Route path="/staff/bahan-baku" element={<StaffBahanBakuList />} />
                <Route path="/staff/produk" element={<StaffProdukList />} />
                <Route path="/staff/kapasitas" element={<KapasitasInfo />} />
                <Route path="/staff/pesanan" element={<PesananManagement />} />
                <Route path="/staff/jadwal-produksi" element={<JadwalProduksi />} />
              </Route>
            </Route>
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
