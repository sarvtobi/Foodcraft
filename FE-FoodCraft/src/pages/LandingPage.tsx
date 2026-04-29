import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, BarChart3, Warehouse, CalendarClock, ShieldCheck } from 'lucide-react';
import AnimatedLogo from '../components/AnimatedLogo';
import heroImg from '../assets/hero-dashboard.png';
import './LandingPage.css';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* ========== NAVBAR ========== */}
      <nav className={`lp-navbar ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className="lp-logo">
          <AnimatedLogo size={40} />
          <div className="lp-logo-text">Food<span>Craft</span></div>
        </a>

        <ul className={`lp-nav-links ${mobileOpen ? 'open' : ''}`}>
          <li><a href="#fitur">Fitur</a></li>
          <li><a href="#testimoni">Testimoni</a></li>
          <li><a href="#kontak">Kontak</a></li>
        </ul>

        <div className={`lp-nav-actions ${mobileOpen ? 'open' : ''}`}>
          <Link to="/login" className="lp-btn-login">Masuk</Link>
          <Link to="/register" className="lp-btn-cta">Coba Gratis</Link>
        </div>

        <button className="lp-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ========== HERO ========== */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-content">
            <div className="lp-hero-badge">
              <span className="dot" />
              Platform #1 untuk UMKM Makanan
            </div>
            <h1>
              Kelola Produksi &amp; Bisnis{' '}
              <span className="highlight">UMKM Anda</span> dalam Satu Platform
            </h1>
            <p className="lp-hero-sub">
              Dari manajemen produksi, pelacakan stok, hingga laporan keuangan — semua
              terintegrasi dalam satu dashboard yang mudah digunakan.
            </p>
            <div className="lp-hero-actions">
              <Link to="/register" className="lp-btn-hero primary">
                Mulai Gratis →
              </Link>
              <a href="#fitur" className="lp-btn-hero secondary">
                Lihat Fitur
              </a>
            </div>
          </div>

          <div className="lp-hero-visual">
            <div className="lp-hero-img-wrapper">
              <img src={heroImg} alt="FoodCraft Dashboard Preview" />
              <div className="lp-glass-card card-1">
                <div className="lp-glass-icon green">📈</div>
                <div className="info">
                  <h4>Produksi Hari Ini</h4>
                  <p>+24% meningkat</p>
                </div>
              </div>
              <div className="lp-glass-card card-2">
                <div className="lp-glass-icon blue">📦</div>
                <div className="info">
                  <h4>Stok Tersedia</h4>
                  <p>128 item aman</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section className="lp-stats">
        <div className="lp-stats-inner">
          <div className="lp-stat"><h3>500+</h3><p>UMKM Terdaftar</p></div>
          <div className="lp-stat"><h3>10,000+</h3><p>Produksi Dikelola</p></div>
          <div className="lp-stat"><h3>99.9%</h3><p>Uptime Platform</p></div>
        </div>
      </section>

      {/* ========== FEATURES BENTO ========== */}
      <section className="lp-features" id="fitur">
        <div className="lp-section-label">✦ Fitur Unggulan</div>
        <h2 className="lp-section-title">Semua yang Anda Butuhkan untuk Mengelola UMKM</h2>
        <p className="lp-section-subtitle">
          Dirancang khusus untuk pemilik usaha makanan — dari skala kecil hingga berkembang.
        </p>

        <div className="lp-bento">
          <div className="lp-bento-card large">
            <div className="lp-bento-icon purple">
              <Package size={24} />
            </div>
            <h3>Manajemen Produksi</h3>
            <p>
              Rencanakan, jadwalkan, dan pantau seluruh proses produksi makanan Anda secara
              real-time. Kelola batch produksi dan alur kerja dari satu tempat.
            </p>
          </div>

          <div className="lp-bento-card">
            <div className="lp-bento-icon emerald">
              <Warehouse size={24} />
            </div>
            <h3>Pelacakan Inventaris</h3>
            <p>
              Pantau stok bahan baku dan produk jadi dengan notifikasi otomatis saat stok menipis.
            </p>
          </div>

          <div className="lp-bento-card">
            <div className="lp-bento-icon amber">
              <BarChart3 size={24} />
            </div>
            <h3>Laporan Keuangan</h3>
            <p>
              Laporan pendapatan, pengeluaran, dan laba rugi yang lengkap dan otomatis setiap bulan.
            </p>
          </div>

          <div className="lp-bento-card">
            <div className="lp-bento-icon sky">
              <CalendarClock size={24} />
            </div>
            <h3>Jadwal Otomatis</h3>
            <p>
              Sistem penjadwalan cerdas yang mempertimbangkan kapasitas produksi dan deadline pesanan.
            </p>
          </div>

          <div className="lp-bento-card large">
            <div className="lp-bento-icon rose">
              <ShieldCheck size={24} />
            </div>
            <h3>Manajemen Kualitas &amp; Keamanan</h3>
            <p>
              Kontrol kualitas terintegrasi dengan checklist produksi dan audit trail.
              Data aman dengan enkripsi dan backup otomatis.
            </p>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="lp-testimonials" id="testimoni">
        <div className="lp-testimonials-inner">
          <div className="lp-section-label">💬 Testimoni</div>
          <h2 className="lp-section-title">Dipercaya oleh Pemilik UMKM</h2>
          <p className="lp-section-subtitle">
            Bergabunglah dengan ratusan pemilik usaha yang telah meningkatkan efisiensi produksinya.
          </p>

          <div className="lp-partners">
            <span className="lp-partner">🍞 RotiKita</span>
            <span className="lp-partner">🍰 KueNusantara</span>
            <span className="lp-partner">🥤 SegarJaya</span>
            <span className="lp-partner">🍪 SnackMaju</span>
            <span className="lp-partner">🧁 DapurIbu</span>
          </div>

          <div className="lp-testimonial-grid">
            <div className="lp-testimonial-card">
              <div className="lp-stars">★★★★★</div>
              <blockquote>
                "FoodCraft mengubah cara saya mengelola produksi roti. Sekarang semua terdata
                rapi dan saya bisa fokus mengembangkan usaha."
              </blockquote>
              <div className="lp-testimonial-author">
                <div className="lp-author-avatar av1">AS</div>
                <div className="lp-author-info">
                  <h4>Andi Surya</h4>
                  <p>Pemilik RotiKita, Bandung</p>
                </div>
              </div>
            </div>

            <div className="lp-testimonial-card">
              <div className="lp-stars">★★★★★</div>
              <blockquote>
                "Fitur pelacakan stok sangat membantu. Tidak ada lagi bahan baku yang kedaluwarsa
                karena lupa dicek!"
              </blockquote>
              <div className="lp-testimonial-author">
                <div className="lp-author-avatar av2">RM</div>
                <div className="lp-author-info">
                  <h4>Rina Marlina</h4>
                  <p>Pemilik KueNusantara, Jakarta</p>
                </div>
              </div>
            </div>

            <div className="lp-testimonial-card">
              <div className="lp-stars">★★★★★</div>
              <blockquote>
                "Laporan keuangan otomatis menghemat waktu saya 10 jam per minggu. Sangat
                direkomendasikan untuk UMKM!"
              </blockquote>
              <div className="lp-testimonial-author">
                <div className="lp-author-avatar av3">BW</div>
                <div className="lp-author-info">
                  <h4>Budi Wibowo</h4>
                  <p>Pemilik SnackMaju, Surabaya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="lp-cta-section">
        <div className="lp-cta-box">
          <h2>Siap Tingkatkan Bisnis UMKM Anda?</h2>
          <p>Mulai gratis hari ini tanpa kartu kredit. Upgrade kapan saja sesuai kebutuhan Anda.</p>
          <Link to="/register" className="lp-btn-cta-white">Daftar Sekarang — Gratis!</Link>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="lp-footer" id="kontak">
        <div className="lp-footer-inner">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <a href="#" className="lp-logo">
                <AnimatedLogo size={40} />
                <div className="lp-logo-text" style={{ color: 'white' }}>Food<span>Craft</span></div>
              </a>
              <p>Platform manajemen produksi terintegrasi untuk UMKM makanan Indonesia.</p>
            </div>

            <div className="lp-footer-col">
              <h4>Produk</h4>
              <ul>
                <li><a href="#fitur">Fitur</a></li>
                <li><a href="#">Harga</a></li>
                <li><a href="#">Integrasi</a></li>
                <li><a href="#">Changelog</a></li>
              </ul>
            </div>

            <div className="lp-footer-col">
              <h4>Perusahaan</h4>
              <ul>
                <li><a href="#">Tentang Kami</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Karir</a></li>
                <li><a href="#">Kontak</a></li>
              </ul>
            </div>

            <div className="lp-footer-col lp-newsletter">
              <h4>Newsletter</h4>
              <p>Dapatkan tips dan update terbaru untuk UMKM Anda.</p>
              <form className="lp-newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="email@anda.com" />
                <button type="submit">Langganan</button>
              </form>
            </div>
          </div>

          <div className="lp-footer-bottom">
            <p>© 2026 FoodCraft. All rights reserved.</p>
            <div className="lp-social-links">
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="Twitter">X</a>
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="YouTube">YT</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
