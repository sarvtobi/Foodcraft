import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, BarChart3, Warehouse, CalendarClock, ChevronDown, CheckCircle2 } from 'lucide-react';
import AnimatedLogo from '../components/AnimatedLogo';
import heroImg from '../assets/hero-dashboard.png';
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { ScrollReveal } from '../components/ScrollReveal';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Apakah FoodCraft cocok untuk usaha rumahan?",
      answer: "Sangat cocok! FoodCraft dirancang fleksibel, mulai dari skala dapur rumahan hingga pabrik UMKM menengah. Anda hanya menggunakan fitur yang Anda butuhkan."
    },
    {
      question: "Apakah data produksi dan resep saya aman?",
      answer: "Keamanan data adalah prioritas utama kami. Kami menggunakan enkripsi standar industri untuk memastikan bahwa resep rahasia dan data keuangan Anda tidak dapat diakses oleh pihak yang tidak berkepentingan."
    },
    {
      question: "Bagaimana jika saya tidak paham akuntansi?",
      answer: "Tidak masalah. Sistem kami otomatis mencatat biaya bahan baku dan operasional saat Anda memproses produksi, lalu menyajikannya dalam laporan laba/rugi yang sangat mudah dibaca orang awam."
    },
    {
      question: "Apakah ada batasan jumlah produk yang bisa dimasukkan?",
      answer: "Untuk paket gratis, Anda dapat memasukkan hingga 50 SKU produk dan bahan baku. Paket premium menawarkan kapasitas tak terbatas."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-300">
      {/* ========== NAVBAR ========== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'}`}>
        <a href="#" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <AnimatedLogo size={36} />
          <span>Food<span className="text-indigo-600 dark:text-indigo-400">Craft</span></span>
        </a>

        <ul className={`fixed inset-0 top-[72px] bg-background/95 backdrop-blur flex-col items-center gap-8 text-lg pt-12 transition-transform duration-300 md:static md:bg-transparent md:flex-row md:p-0 md:flex md:transform-none ${mobileOpen ? 'translate-x-0 flex' : 'translate-x-full hidden'}`}>
          <li><a href="#fitur" className="text-muted-foreground hover:text-foreground font-medium transition-colors" onClick={() => setMobileOpen(false)}>Fitur</a></li>
          <li><a href="#testimoni" className="text-muted-foreground hover:text-foreground font-medium transition-colors" onClick={() => setMobileOpen(false)}>Testimoni</a></li>
          <li><a href="#faq" className="text-muted-foreground hover:text-foreground font-medium transition-colors" onClick={() => setMobileOpen(false)}>FAQ</a></li>
        </ul>

        <div className="flex items-center gap-4">
          <div className={`fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border flex-col gap-4 md:static md:bg-transparent md:border-none md:p-0 md:flex-row md:flex items-center transition-transform duration-300 ${mobileOpen ? 'translate-y-0 flex' : 'translate-y-full hidden md:translate-y-0'}`}>
            <Link to="/login" className="text-muted-foreground hover:text-foreground font-medium text-center py-2 md:py-0 transition-colors">Masuk</Link>
            <Link to="/register" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-indigo-500/25 text-center">Coba Gratis</Link>
          </div>

          <AnimatedThemeToggler />

          <button className="md:hidden text-foreground p-2 z-50" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-current transform transition-transform ${mobileOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
              <span className={`w-full h-0.5 bg-current transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-current transform transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative pt-40 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center text-center">
        {/* Glow effect */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* <ScrollReveal delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm text-sm font-medium text-slate-300 mb-8">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
              Platform #1 untuk UMKM Makanan
            </div>
          </ScrollReveal> */}

          <ScrollReveal delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Kelola Produksi &amp; Bisnis <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-cyan-400">UMKM Anda</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              Dari manajemen produksi, pelacakan stok, hingga laporan keuangan — semua terintegrasi dalam satu dashboard yang modern dan mudah digunakan.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/register" className="px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transform hover:-translate-y-0.5">
                Mulai Gratis →
              </Link>
              <a href="#fitur" className="px-8 py-3.5 rounded-lg bg-muted/50 hover:bg-muted border border-border font-semibold transition-colors backdrop-blur-sm">
                Lihat Fitur
              </a>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.5} distance={50}>
          <div className="flex flex-col overflow-hidden">
            <ContainerScroll
              titleComponent={
                <>
                  <h1 className="text-4xl font-semibold text-black dark:text-white">
                    Dashboard <br />
                    <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                      FoodCraft
                    </span>
                  </h1>
                </>
              }
            >
              <img
                src={heroImg}
                alt="hero"
                height={720}
                width={1400}
                className="mx-auto rounded-2xl object-cover h-full object-left-top"
                draggable={false}
              />
            </ContainerScroll>
          </div>
        </ScrollReveal>
      </section>

      {/* ========== STATS ========== */}
      <section className="border-y border-border bg-muted/30 backdrop-blur-sm py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            { val: "500+", label: "UMKM Terdaftar" },
            { val: "10k+", label: "Produksi Dikelola" },
            { val: "99.9%", label: "Uptime Platform" }
          ].map((stat, i) => (
            <ScrollReveal key={i} delay={0.1 * i} direction="up">
              <div className="flex flex-col items-center py-4 md:py-0">
                <h3 className="text-4xl font-bold mb-2">{stat.val}</h3>
                <p className="text-muted-foreground font-medium tracking-wide uppercase text-sm">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ========== FEATURES BENTO ========== */}
      <section id="fitur" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="mb-16">
          <ScrollReveal>
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 border border-indigo-600/30 dark:border-indigo-400/30 rounded-full bg-indigo-600/10 dark:bg-indigo-400/10 mb-6">
              Fitur Utama
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Satu Platform,<br />Semua Kebutuhan UMKM.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">Kami mendesain fitur-fitur yang benar-benar Anda butuhkan untuk meningkatkan efisiensi dapur produksi tanpa kerumitan software enterprise.</p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 Large */}
          <ScrollReveal delay={0.1} className="md:col-span-2">
            <div className="group bg-muted/40 border border-border rounded-2xl p-8 hover:bg-muted/60 hover:border-border transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                <Package size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Manajemen Resep &amp; Produksi</h3>
              <p className="text-muted-foreground leading-relaxed">
                Standarisasi resep rahasia Anda. Sistem akan menghitung otomatis kebutuhan bahan baku berdasarkan target produksi harian, memastikan rasa tetap konsisten dan menekan pemborosan (waste).
              </p>
            </div>
          </ScrollReveal>

          {/* Card 2 */}
          <ScrollReveal delay={0.2}>
            <div className="group bg-muted/40 border border-border rounded-2xl p-8 hover:bg-muted/60 hover:border-border transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <Warehouse size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Inventaris Real-time</h3>
              <p className="text-muted-foreground leading-relaxed">
                Peringatan otomatis saat bahan baku menipis. Lacak stok masuk dan keluar secara akurat.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 3 */}
          <ScrollReveal delay={0.3}>
            <div className="group bg-muted/40 border border-border rounded-2xl p-8 hover:bg-muted/60 hover:border-border transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Laporan Keuangan Instan</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ketahui Harga Pokok Produksi (HPP) dan margin keuntungan setiap item secara otomatis.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 4 Large */}
          <ScrollReveal delay={0.4} className="md:col-span-2">
            <div className="group bg-muted/40 border border-border rounded-2xl p-8 hover:bg-muted/60 hover:border-border transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="w-12 h-12 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center text-sky-600 dark:text-sky-400 mb-6">
                <CalendarClock size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Jadwal &amp; Status Pesanan</h3>
              <p className="text-muted-foreground leading-relaxed">
                Pantau pesanan pelanggan dari status "Menunggu" hingga "Selesai". Pastikan pengiriman tepat waktu dengan visualisasi timeline produksi yang intuitif bagi tim dapur Anda.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section id="testimoni" className="py-24 px-6 border-t border-border bg-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Dipercaya oleh UMKM Lokal</h2>
              <p className="text-muted-foreground">Bergabunglah dengan ratusan pengusaha makanan lainnya.</p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-12 mb-16 opacity-30 grayscale items-center font-bold text-xl md:text-2xl tracking-widest uppercase">
              <span>KueNusantara</span>
              <span>SnackMaju</span>
              <span>RotiPagi</span>
              <span>DapurBunda</span>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                text: "Sejak pakai FoodCraft, saya tidak pernah lagi salah hitung bahan baku. Produksi jadi lebih terukur dan profit naik 15% bulan ini!",
                author: "Ahmad Santoso",
                role: "Pemilik RotiPagi, Bandung",
                initials: "AS"
              },
              {
                text: "Sangat mudah digunakan bahkan untuk staf dapur saya. Tidak ada lagi pesanan yang terlewat karena lupa dicek!",
                author: "Rina Marlina",
                role: "Pemilik KueNusantara, Jakarta",
                initials: "RM"
              },
              {
                text: "Laporan keuangan otomatis menghemat waktu saya 10 jam per minggu. Sangat direkomendasikan untuk UMKM!",
                author: "Budi Wibowo",
                role: "Pemilik SnackMaju, Surabaya",
                initials: "BW"
              }
            ].map((t, i) => (
              <ScrollReveal key={i} delay={0.1 * (i + 1)}>
                <div className="bg-muted/50 border border-border rounded-2xl p-8 h-full">
                  <div className="text-yellow-500 mb-4 text-sm">★★★★★</div>
                  <blockquote className="text-muted-foreground leading-relaxed mb-6">
                    "{t.text}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">{t.initials}</div>
                    <div>
                      <h4 className="font-semibold text-sm">{t.author}</h4>
                      <p className="text-muted-foreground text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <ScrollReveal>
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400 border border-cyan-600/30 dark:border-cyan-400/30 rounded-full bg-cyan-600/10 dark:bg-cyan-400/10 mb-6">
              Bantuan
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Pertanyaan yang sering diajukan seputar FoodCraft.</p>
          </ScrollReveal>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={0.05 * index}>
              <div className="border border-border rounded-2xl bg-muted/30 overflow-hidden transition-all duration-300">
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown className={`text-muted-foreground transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} size={20} />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${activeFaq === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-12 px-6 max-w-5xl mx-auto relative z-20">
        <ScrollReveal direction="none" distance={0}>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900/50 to-background border border-indigo-500/20 p-12 md:p-20 text-center">
            {/* Subtle grid pattern background for the CTA */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight relative z-10">Siap Tingkatkan Bisnis UMKM Anda?</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10">
              Mulai gratis hari ini tanpa kartu kredit. Upgrade kapan saja sesuai kebutuhan Anda saat bisnis semakin berkembang.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-all shadow-xl hover:scale-105 active:scale-95">
                Daftar Sekarang — Gratis!
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground relative z-10">
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400" /> Tanpa Kartu Kredit</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400" /> Setup dalam 5 menit</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400" /> Batal kapan saja</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ========== GIANT BRAND TEXT ========== */}
      <section className="w-full overflow-hidden flex justify-center pb-0 pt-20 -mb-8 relative z-0">
        <ScrollReveal direction="up" distance={100} duration={1}>
          <h1 className="text-[16vw] font-black leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-muted-foreground/20 to-background select-none whitespace-nowrap">
            FOODCRAFT
          </h1>
        </ScrollReveal>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-border bg-background pt-20 pb-10 px-6 relative z-10" id="kontak">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2">
              <ScrollReveal>
                <a href="#" className="flex items-center gap-2 text-xl font-bold mb-4">
                  <AnimatedLogo size={32} />
                  <span>Food<span className="text-indigo-600 dark:text-indigo-400">Craft</span></span>
                </a>
                <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
                  Platform manajemen produksi terintegrasi untuk UMKM makanan Indonesia. Kami percaya bisnis kecil layak mendapatkan alat teknologi terbaik.
                </p>
                <div className="flex gap-4">
                  {['IG', 'X', 'in', 'YT'].map((social) => (
                    <a key={social} href="#" className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all">
                      {social}
                    </a>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <div>
              <ScrollReveal delay={0.1}>
                <h4 className="font-semibold mb-6">Produk</h4>
                <ul className="space-y-4 text-muted-foreground">
                  <li><a href="#fitur" className="hover:text-foreground transition-colors">Fitur</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Harga</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Integrasi</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
                </ul>
              </ScrollReveal>
            </div>

            <div>
              <ScrollReveal delay={0.2}>
                <h4 className="font-semibold mb-6">Perusahaan</h4>
                <ul className="space-y-4 text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Tentang Kami</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Karir</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Kontak</a></li>
                </ul>
              </ScrollReveal>
            </div>

            <div>
              <ScrollReveal delay={0.3}>
                <h4 className="font-semibold mb-6">Newsletter</h4>
                <p className="text-muted-foreground text-sm mb-4">Dapatkan tips dan trik manajemen operasional bisnis FnB bulanan kami.</p>
                <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                  <input type="email" placeholder="email@anda.com" className="bg-muted border border-border rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
                  <button type="submit" className="bg-foreground text-background font-semibold rounded-lg px-4 py-2.5 hover:opacity-90 transition-colors">Langganan</button>
                </form>
              </ScrollReveal>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2026 FoodCraft. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground">Privasi</a>
              <a href="#" className="hover:text-foreground">Ketentuan Layanan</a>
              <a href="#" className="hover:text-foreground">Keamanan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
