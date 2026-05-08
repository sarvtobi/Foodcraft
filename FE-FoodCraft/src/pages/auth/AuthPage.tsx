import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/axios';
import AnimatedLogo from '@/components/AnimatedLogo';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setIsLogin(location.pathname === '/login');
    setError('');
    setSuccess('');
    setShowPassword(false);
  }, [location.pathname]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const toggleMode = () => {
    navigate(isLogin ? '/register' : '/login');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/api/login', {
        email: formData.email,
        password: formData.password,
      });
      const { token, user } = response.data;
      login(token, user);
      if (user.role === 'super_admin') navigate('/admin/dashboard');
      else if (user.role === 'owner') navigate('/owner/dashboard');
      else if (user.role === 'staff') navigate('/staff/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal login. Silahkan periksa kembali kredensial Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Kata sandi tidak cocok');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/api/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setSuccess('Registrasi berhasil! Mengarahkan ke login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal register. Silahkan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Form Panels ──────────────────────────────────────────────────────────

  const LoginForm = (
    <div className="flex flex-col justify-center h-full px-10 lg:px-14 py-10">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <AnimatedLogo size={40} />
        <span className="font-bold text-lg tracking-tight">FoodCraft</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Selamat Datang Kembali</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
        Masuk untuk melanjutkan perjalanan kuliner Anda dan kelola resep Anda.
      </p>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Alamat Email
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            {/* <button type="button" className="text-xs text-indigo-600 hover:text-indigo-500 font-medium">
              Lupa Password?
            </button> */}
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 accent-indigo-600 cursor-pointer"
          />
          <label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            Keep me logged in
          </label>
        </div> */}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Masuk...
            </>
          ) : (
            <>Masuk ke FoodCraft <span>→</span></>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Belum punya akun?{' '}
        <button type="button" onClick={toggleMode} className="text-indigo-600 font-semibold hover:underline">
          Daftar Disini
        </button>
      </p>
    </div>
  );

  const RegisterForm = (
    <div className="flex flex-col justify-center h-full px-10 lg:px-14 py-10">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <AnimatedLogo size={40} />
        <span className="font-bold text-lg tracking-tight">FoodCraft</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Buat Akun Baru</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        Masukkan detail Anda untuk memulai perjalanan Anda dengan kami.
      </p>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nama Lengkap</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <input
              id="name"
              type="text"
              required
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Alamat Email</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </span>
            <input
              id="email"
              type="email"
              required
              placeholder="owner@foodcraft.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* <div className="flex items-start gap-2 pt-1">
          <input
            id="terms"
            type="checkbox"
            required
            className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-indigo-600 cursor-pointer"
          />
          <label htmlFor="terms" className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer leading-relaxed">
            Saya setuju dengan{' '}
            <span className="text-indigo-600 hover:underline cursor-pointer font-medium">Syarat & Ketentuan</span>{' '}
            dan{' '}
            <span className="text-indigo-600 hover:underline cursor-pointer font-medium">Kebijakan Privasi</span>
          </label>
        </div> */}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Daftar...
            </>
          ) : (
            <>Daftar Sekarang <span>→</span></>
          )}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
        Sudah punya akun?{' '}
        <button type="button" onClick={toggleMode} className="text-indigo-600 font-semibold hover:underline">
          Login Disini
        </button>
      </p>
    </div>
  );

  // ─── Image Overlay Panels ─────────────────────────────────────────────────

  /** Panel shown on LOGIN: image on the RIGHT */
  const LoginImagePanel = (
    <div className="relative w-full h-full overflow-hidden">
      <img
        src="/img/content/login-content.png"
        alt="FoodCraft Login" 
        className="w-full h-full object-cover"
      />
      {/* Dark gradient overlay at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Testimonial card */}
      <div className="absolute bottom-8 left-6 right-6">
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20">
          <p className="text-white text-sm font-medium italic leading-relaxed mb-4">
            "Satu-satunya cara untuk menguasai seni memasak adalah dengan memulai menggunakan peralatan terbaik dan bergabung dengan komunitas yang menginspirasi."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              C
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Chef Julian</p>
              <p className="text-white/70 text-xs">FoodCraft Community Expert</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /** Panel shown on REGISTER: image on the LEFT */
  const RegisterImagePanel = (
    <div className="relative w-full h-full overflow-hidden">
      <img
        src="/img/content/register-content.png"
        alt="FoodCraft Register"
        className="w-full h-full object-cover"
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Overlay text */}
      <div className="absolute bottom-8 left-6 right-6">
        <h2 className="text-white text-2xl font-bold leading-tight mb-2">
          Perluas wawasan kuliner Anda.
        </h2>
        <p className="text-white/80 text-sm leading-relaxed">
          Bergabunglah dengan ribuan pemilik restoran yang mengelola impian mereka dengan FoodCraft.
        </p>
      </div>
    </div>
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
      <div className="relative w-full max-w-4xl h-[580px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700/50 flex flex-col md:flex-row">

        {/* ── MOBILE VIEW ── */}
        <div className="md:hidden w-full">
          {/* Image banner on mobile */}
          <div className="h-48 w-full overflow-hidden">
            {isLogin ? (
              <img src="/img/content/login-content.png" alt="Login" className="w-full h-full object-cover" />
            ) : (
              <img src="/img/content/register-content.png" alt="Register" className="w-full h-full object-cover" />
            )}
          </div>
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div key="login-m" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                {LoginForm}
              </motion.div>
            ) : (
              <motion.div key="register-m" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                {RegisterForm}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── DESKTOP VIEW ── */}
        <div className="hidden md:flex w-full h-full">

          {/* 
            Both forms always rendered (left/right slots).
            The image panel slides over them.

            LOGIN state  → image on RIGHT  → left slot shows login form
            REGISTER state → image on LEFT → right slot shows register form
          */}

          {/* LEFT SLOT */}
          <div className="w-1/2 flex-shrink-0 h-full relative">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: 0.3 }}
                  className="absolute inset-0"
                >
                  {LoginForm}
                </motion.div>
              ) : (
                <motion.div
                  key="register-img"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: 0.3 }}
                  className="absolute inset-0"
                >
                  {RegisterImagePanel}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT SLOT */}
          <div className="w-1/2 flex-shrink-0 h-full relative">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login-img"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: 0.3 }}
                  className="absolute inset-0"
                >
                  {LoginImagePanel}
                </motion.div>
              ) : (
                <motion.div
                  key="register-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: 0.3 }}
                  className="absolute inset-0"
                >
                  {RegisterForm}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── SLIDING IMAGE OVERLAY ─────────────────────────────────────────
              This panel slides on top of the above slots.
              LOGIN  → starts at right (left: 50%)
              REGISTER → slides to left (left: 0%)
          ─────────────────────────────────────────────────────────────────── */}
          <motion.div
            initial={false}
            animate={{ left: isLogin ? '50%' : '0%' }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
            className="absolute top-0 w-1/2 h-full z-20"
          >
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="slide-login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full"
                >
                  {LoginImagePanel}
                </motion.div>
              ) : (
                <motion.div
                  key="slide-register"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full"
                >
                  {RegisterImagePanel}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
