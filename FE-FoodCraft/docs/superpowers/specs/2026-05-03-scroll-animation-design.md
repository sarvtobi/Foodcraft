# Design Spec: Scroll Reveal Animation for Landing Page

## Overview
Implement an elegant "Reveal on Scroll" effect for the FoodCraft landing page using the existing `motion` (Framer Motion) library. This will make the site feel more dynamic and professional as users explore the content.

## Proposed Components

### 1. `src/components/ScrollReveal.tsx`
A reusable wrapper component that detects when its children enter the viewport and triggers a transition.

**Properties:**
- `children`: ReactNode to be animated.
- `direction`: "up" | "down" | "left" | "right" | "none" (default: "up").
- `delay`: Number (default: 0).
- `duration`: Number (default: 0.5).

**Logic:**
- Uses `motion.div` from `motion/react`.
- `initial`: `opacity: 0` and a slight translation based on `direction`.
- `whileInView`: `opacity: 1`, `x: 0`, `y: 0`.
- `viewport`: `{ once: true, margin: "-100px" }` to ensure it only animates once and triggers slightly before entering the center screen.

## Integration Plan

### Landing Page Sections
Wrap the following sections in `src/pages/LandingPage.tsx`:
1. **Hero Content**: Immediate fade-in.
2. **Stats Section**: Slide up.
3. **Features Bento**: Staggered reveal for each card.
4. **Testimonials**: Fade in sections.
5. **FAQ**: Simple fade in.
6. **CTA**: Dynamic scaling or fade in.

## Benefits
- **Performance**: Framer Motion uses highly optimized hardware-accelerated transitions.
- **Maintainability**: Centralized logic in a single reusable component.
- **Consistency**: Uniform animation curves across the entire page.

## Testing & Verification
- Verify that elements do not "flicker" on load.
- Ensure animations only trigger once per session.
- Check mobile responsiveness (animations should be smooth on touch devices).