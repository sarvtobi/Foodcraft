# Scroll Reveal Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an elegant "Reveal on Scroll" effect for the FoodCraft landing page using Framer Motion.

**Architecture:** Create a reusable `<ScrollReveal />` wrapper component using `motion.div` from `motion/react` with `whileInView` triggers. Integrate this component into various sections of the `LandingPage` with staggered delays.

**Tech Stack:** React, Tailwind CSS, Framer Motion (`motion/react`)

---

### Task 1: Create ScrollReveal Component

**Files:**
- Create: `src/components/ScrollReveal.tsx`

- [ ] **Step 1: Create the ScrollReveal component**

Create `src/components/ScrollReveal.tsx` with the following content:

```tsx
import { motion, HTMLMotionProps } from "motion/react"
import { ReactNode } from "react"

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  direction?: "up" | "down" | "left" | "right" | "none"
  delay?: number
  duration?: number
  distance?: number
}

export const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 30,
  ...props
}: ScrollRevealProps) => {
  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { y: distance }
      case "down": return { y: -distance }
      case "left": return { x: distance }
      case "right": return { x: -distance }
      default: return { x: 0, y: 0 }
    }
  }

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...getInitialPosition() 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98] // Smooth cubic-bezier
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit Task 1**

```bash
git add src/components/ScrollReveal.tsx
git commit -m "feat: add reusable ScrollReveal component"
```

---

### Task 2: Integrate ScrollReveal into LandingPage Sections

**Files:**
- Modify: `src/pages/LandingPage.tsx`

- [ ] **Step 1: Import ScrollReveal in LandingPage**

Add the import at the top of `src/pages/LandingPage.tsx`:
```tsx
import { ScrollReveal } from '../components/ScrollReveal';
```

- [ ] **Step 2: Wrap Hero Section content**

Wrap the hero content (the logo badge, H1, and Paragraph) in `<ScrollReveal>`:

```tsx
// Inside LandingPage.tsx Hero section
<div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
  <ScrollReveal delay={0.1}>
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 border border-border backdrop-blur-sm text-sm font-medium text-slate-300 mb-8">
      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
      Platform #1 untuk UMKM Makanan
    </div>
  </ScrollReveal>
  
  <ScrollReveal delay={0.2}>
    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
      Kelola Produksi &amp; Bisnis <br className="hidden md:block"/>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-cyan-400">UMKM Anda</span>
    </h1>
  </ScrollReveal>
  
  <ScrollReveal delay={0.3}>
    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
      Dari manajemen produksi, pelacakan stok, hingga laporan keuangan — semua terintegrasi dalam satu dashboard yang modern dan mudah digunakan.
    </p>
  </ScrollReveal>
  
  <ScrollReveal delay={0.4} direction="up">
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      {/* ... buttons ... */}
    </div>
  </ScrollReveal>
</div>
```

- [ ] **Step 3: Wrap Hero Image**

```tsx
<ScrollReveal delay={0.5} direction="up" distance={50}>
  <div className="relative z-10 w-full max-w-5xl mx-auto mt-20 md:mt-24 perspective-[2000px]">
    {/* ... image div ... */}
  </div>
</ScrollReveal>
```

- [ ] **Step 4: Wrap Stats Section**

```tsx
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
```

- [ ] **Step 5: Wrap Features Bento Cards**

Add staggered animation to the feature cards:

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Card 1 */}
  <ScrollReveal delay={0.1} direction="up" className="md:col-span-2">
    <div className="group bg-muted/40 border border-border rounded-2xl p-8 ...">
      {/* ... card content ... */}
    </div>
  </ScrollReveal>

  {/* Card 2 */}
  <ScrollReveal delay={0.2} direction="up">
    <div className="group bg-muted/40 border border-border rounded-2xl p-8 ...">
      {/* ... card content ... */}
    </div>
  </ScrollReveal>

  {/* Card 3 */}
  <ScrollReveal delay={0.3} direction="up">
    <div className="group bg-muted/40 border border-border rounded-2xl p-8 ...">
      {/* ... card content ... */}
    </div>
  </ScrollReveal>

  {/* Card 4 */}
  <ScrollReveal delay={0.4} direction="up" className="md:col-span-2">
    <div className="group bg-muted/40 border border-border rounded-2xl p-8 ...">
      {/* ... card content ... */}
    </div>
  </ScrollReveal>
</div>
```

- [ ] **Step 6: Commit Task 2**

```bash
git add src/pages/LandingPage.tsx
git commit -m "feat: integrate scroll animations into LandingPage"
```

---

### Task 3: Final Verification

- [ ] **Step 1: Run build to ensure no regressions**

Run: `npm run build`
Expected: SUCCESS

- [ ] **Step 2: Clean up visual companion**

```bash
# Get the session dir from the server-info file found earlier
rm -rf .superpowers/brainstorm/
```
