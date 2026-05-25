# Design Spec: Sliding Overlay Auth Layout

## Overview
Transform the separate Login and Register pages into a single, cohesive sliding layout. The "Sliding Overlay" style involves a container where a background panel (containing an image/dummy content) slides over the form area, while the forms themselves swap with smooth transitions.

## Proposed Architecture

### 1. Consolidating into `src/pages/auth/AuthPage.tsx`
Instead of having users navigate between two separate physical pages, we will use a single page component that manages the `isLogin` state. This allows for seamless Framer Motion transitions that are difficult to achieve across route changes.

### 2. Layout Structure
- **Main Container**: A centered card-like container with `relative` positioning and `overflow-hidden`.
- **Form Panels**: Two absolute-positioned panels (Login and Register) that slide left/right.
- **Overlay Panel**: A sliding container with a dummy image/background that moves from right to left (Register -> Login).

### 3. State Management
- `isLogin`: Boolean state to toggle between views.
- The URL routes `/login` and `/register` will still exist but will both render this component with the appropriate initial state.

## Transition Logic (Framer Motion)
- **Overlay**: `x` translation from `0%` (Register, right side) to `-100%` (Login, left side).
- **Forms**: Fade and slight slide animation to ensure they feel connected to the overlay movement.

## Integration Plan
1. Create `src/pages/auth/AuthPage.tsx` as the master component.
2. Refactor existing logic from `Login.tsx` and `Register.tsx` into this new component.
3. Update `App.tsx` routes to point to `AuthPage`.

## Benefits
- **UX**: Superior feel with fluid animations.
- **Speed**: No full page reload or component unmounting between auth states.
- **Modernity**: Aligns with top-tier SaaS landing page trends.

## Testing & Verification
- Verify form submission logic works for both Login and Register.
- Ensure validation errors are cleared when switching modes.
- Test mobile responsiveness (overlay may need to stack or disappear on very small screens).