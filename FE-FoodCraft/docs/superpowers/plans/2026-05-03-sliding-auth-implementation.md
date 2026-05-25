# Sliding Auth Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a modern sliding transition between Login and Register forms within a single cohesive page.

**Architecture:** Create `AuthPage.tsx` which manages an `isLogin` state. Use Framer Motion to animate an "overlay" panel and the forms themselves. The layout will swap between [Form Left | Image Right] (Register) and [Image Left | Form Right] (Login).

**Tech Stack:** React, Tailwind CSS, Framer Motion (`motion/react`), Lucide React.

---

### Task 1: Create Consolidated AuthPage Component

**Files:**
- Create: `src/pages/auth/AuthPage.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Implement AuthPage layout and logic**

Create `src/pages/auth/AuthPage.tsx`. This file will contain both Login and Register form logic merged into a responsive, animated container.

```tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/axios';
import AnimatedLogo from '../../components/AnimatedLogo';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setIsLogin(location.pathname === '/login');
    setError('');
    setSuccess('');
  }, [location.pathname]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const toggleMode = () => {
    const newPath = isLogin ? '/register' : '/login';
    navigate(newPath);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/api/login', { 
        email: formData.email, 
        password: formData.password 
      });
      const { token, user } = response.data;
      login(token, user);
      if (user.role === 'super_admin') navigate('/admin/dashboard');
      else if (user.role === 'owner') navigate('/owner/dashboard');
      else if (user.role === 'staff') navigate('/staff/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/api/register', { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password 
      });
      setSuccess('Registration successful! Switching to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl h-[600px] bg-background rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-border">
        
        {/* Forms Container */}
        <div className="flex-1 relative h-full">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col justify-center px-8 md:px-12 lg:px-16"
              >
                <div className="mb-8">
                  <AnimatedLogo size={64} className="mb-4" />
                  <h1 className="text-3xl font-bold">Welcome Back</h1>
                  <p className="text-muted-foreground">Login to manage your UMKM</p>
                </div>

                {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input id="email" type="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-border bg-muted/50 outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <input id="password" type="password" required value={formData.password} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-border bg-muted/50 outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]">
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
                
                <p className="mt-8 text-center text-sm">
                  Don't have an account? <button onClick={toggleMode} className="text-indigo-600 font-semibold hover:underline">Register here</button>
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col justify-center px-8 md:px-12 lg:px-16"
              >
                <div className="mb-6">
                  <AnimatedLogo size={64} className="mb-4" />
                  <h1 className="text-3xl font-bold">Create Account</h1>
                  <p className="text-muted-foreground">Start offering your food products</p>
                </div>

                {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">{error}</div>}
                {success && <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 text-sm mb-4">{success}</div>}

                <form onSubmit={handleRegister} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Full Name</label>
                    <input id="name" type="text" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-border bg-muted/50 outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Email address</label>
                    <input id="email" type="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-border bg-muted/50 outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Password</label>
                      <input id="password" type="password" required value={formData.password} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-border bg-muted/50 outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Confirm</label>
                      <input id="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-border bg-muted/50 outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] mt-2">
                    {isLoading ? 'Creating account...' : 'Register Now'}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm">
                  Already have an account? <button onClick={toggleMode} className="text-indigo-600 font-semibold hover:underline">Sign in here</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Overlay Panel (Visual/Image) */}
        <motion.div 
          animate={{ 
            x: isLogin ? '-100%' : '0%',
            order: isLogin ? -1 : 1
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="hidden md:flex flex-1 bg-indigo-600 relative overflow-hidden items-center justify-center text-white p-12 z-20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-800 opacity-90" />
          
          {/* Dummy visual content */}
          <div className="relative z-10 text-center">
            <motion.div
              key={isLogin ? 'v1' : 'v2'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold mb-4">
                {isLogin ? "Digitalisasi Dapur UMKM" : "Kembangkan Bisnis Anda"}
              </h2>
              <p className="text-indigo-100 text-lg">
                {isLogin 
                  ? "Kelola semua aspek produksi Anda dalam satu aplikasi modern." 
                  : "Bergabunglah dengan ribuan pemilik UMKM makanan lainnya."}
              </p>
            </motion.div>
            
            {/* Abstract dummy shapes for "image" */}
            <div className="mt-12 flex justify-center">
              <div className="w-64 h-64 bg-white/10 rounded-full blur-3xl absolute -top-20 -left-20 animate-pulse" />
              <div className="w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl absolute -bottom-10 -right-10 animate-pulse delay-700" />
              <div className="relative w-full max-w-[280px] aspect-square rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center">
                <div className="w-1/2 h-1/2 rounded-full border-4 border-dashed border-indigo-300/30 animate-spin-slow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatedLogo size={80} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update App.tsx Routing**

Modify `src/App.tsx` to point both routes to the new component.

```tsx
// Inside App.tsx imports
import AuthPage from './pages/auth/AuthPage';

// Inside Routes
<Route path="/login" element={<AuthPage />} />
<Route path="/register" element={<AuthPage />} />
```

- [ ] **Step 3: Commit Task 1**

```bash
git add src/pages/auth/AuthPage.tsx src/App.tsx
git commit -m "feat: implement sliding AuthPage layout"
```

---

### Task 2: Clean Up & Verification

- [ ] **Step 1: Delete obsolete files**

```bash
# In PowerShell
Remove-Item src/pages/auth/Login.tsx
Remove-Item src/pages/auth/Register.tsx
```

- [ ] **Step 2: Final Build Verification**

Run: `npm run build`
Expected: SUCCESS

- [ ] **Step 3: Commit Task 2**

```bash
git add .
git commit -m "cleanup: remove separate Login and Register files"
```
