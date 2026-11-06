# UI/UX Design Document
## Refurbished Laptop Store — Dark Theme E-commerce Website

**Version:** 1.0

---

## 1. Design Principles

- **Trust-first**: refurbished products need visual cues (condition grade badges, warranty stamps, real-looking product photos) to reduce buyer hesitation.
- **Dark, premium tech aesthetic**: fits a laptop/electronics brand, reduces eye strain, feels modern.
- **Clarity over decoration**: specs and price must be scannable in under 3 seconds per product card.
- **Frictionless ordering**: minimum steps from product page to order submission (no account creation).
- **Consistent across devices**: same visual language and hierarchy from mobile to desktop.

## 2. Color Palette (Dark Theme)

| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | #0B0F14 | Page background |
| `--bg-surface` | #131820 | Cards, panels |
| `--bg-surface-alt` | #1A2029 | Nested cards, table stripes |
| `--border` | #262D38 | Dividers, card borders |
| `--text-primary` | #F5F7FA | Headings, primary text |
| `--text-secondary` | #9AA4B2 | Descriptions, meta text |
| `--accent` | #3DDC97 | Primary CTA (Buy/Order/Save) — signals "good deal" |
| `--accent-alt` | #4F8CFF | Links, secondary actions |
| `--warning` | #F5A623 | Discount badges, limited stock |
| `--danger` | #FF5C5C | Out of stock, delete actions |
| `--grade-a` | #3DDC97 | Condition Grade A badge |
| `--grade-b` | #F5A623 | Condition Grade B badge |
| `--grade-c` | #9AA4B2 | Condition Grade C badge |

## 3. Typography

- **Font:** Inter or "Plus Jakarta Sans" (clean, modern, tech-friendly), fallback system sans-serif.
- **Scale:**
  - H1 (Hero): 40–56px / bold
  - H2 (Section titles): 28–32px / semibold
  - H3 (Card/product titles): 18–20px / semibold
  - Body: 15–16px / regular
  - Caption/meta: 12–13px / regular, `--text-secondary`
  - Admin footer link: 11–12px / regular, `--text-secondary`, low opacity (0.6) to stay unobtrusive

## 4. Layout & Grid

- 12-column grid, max content width 1280px, centered with `px-4` (mobile) to `px-8` (desktop) gutters.
- Section vertical rhythm: 64px spacing between major sections on desktop, 40px on mobile.
- Product grid: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6`.

## 5. Key Screens

### 5.1 Home Page
- Sticky top nav (transparent → solid on scroll): Logo (left), nav links (Products, About, Contact), search icon.
- Hero section: headline + subtext + "Shop Refurbished Laptops" CTA button (`--accent` background) + hero image/illustration of a laptop.
- Trust strip: 4 icons in a row (Tested & Certified / Warranty Included / Free Delivery / Easy Returns) — collapses to 2x2 grid on mobile.
- "Best Deals" horizontally scrollable product carousel on mobile; grid on desktop.
- Category quick-filters as pill buttons (By Brand, Under ₹20,000, Business Laptops, Gaming, etc.)
- Footer: brand blurb, quick links, contact info, social icons, bottom bar with copyright + small "Admin" text link.

### 5.2 Product Listing Page
- Left sidebar filters (desktop) / bottom-sheet or slide-over filter panel (mobile), triggered by a "Filters" button with count badge.
- Filter groups: Brand (checkboxes), Price (range slider), RAM, Storage, Condition Grade, Screen Size.
- Sort dropdown top-right.
- Product Card:
  - Image (aspect-ratio 4:3, rounded corners `rounded-xl`)
  - Condition grade badge top-left overlay (colored pill: "Grade A")
  - Discount badge top-right overlay if applicable ("-15%")
  - Title (brand + model), key specs line (e.g. "i5 · 8GB · 256GB SSD")
  - Price row: current price bold, strikethrough original price, discount %
  - Hover (desktop): subtle lift + border glow in `--accent`
  - Full card tappable → product detail

### 5.3 Product Detail Page
- Two-column layout desktop (image gallery left ~50%, info right ~50%); stacked on mobile (image first, then info).
- Image gallery: main image + thumbnail strip below (swipeable on mobile).
- Info panel: Title, brand/model, condition grade badge, price block, short highlight bullets (top 4 specs), "Place Order" button (large, `--accent`, sticky at bottom on mobile).
- Below fold: Full specifications table (2-column key-value, zebra striped using `--bg-surface-alt`), Warranty & Return info accordion, Related products carousel.

### 5.4 Order Form (Modal or dedicated section)
- Triggered by "Place Order" — opens as a modal on desktop, full-screen sheet on mobile.
- Fields grouped: Contact Info (Name, Phone, Email) → Delivery Info (Address, City, Pincode) → Order Info (Quantity stepper, Payment Preference radio: COD / Bank Transfer / UPI manual, Notes textarea).
- Inline validation (red helper text under field, red border) — no blocking alert popups.
- Submit button shows loading spinner state; on success replaces form with a checkmark confirmation + Order ID + "Continue on WhatsApp" secondary button.

### 5.5 Admin — Hidden Login
- Footer link: plain text, small, muted color, no icon — intentionally blends in (e.g., sits next to the copyright line: `© 2026 LaptopHub · Admin`).
- Login screen: centered card (max-width 380px) on the dark background, logo mark, Email + Password fields, "Sign in" button, no "forgot password" prominence (optional small link), no sign-up link at all.

### 5.6 Admin Dashboard
- Left sidebar nav (collapsible to icon-only on tablet, bottom tab bar on mobile): Dashboard, Products, Orders, Logout.
- Dashboard cards: Total Products, Active Products, New Orders, Total Orders — 4-card grid (2x2 on mobile).
- Recent Orders table preview (last 5).

### 5.7 Admin — Product Management
- Table view (desktop): thumbnail, name, brand, price, stock status, active toggle, edit/delete icon buttons.
- Card/stacked view (mobile) replacing table rows.
- "+ Add Product" button top-right, opens a form page/modal with sections: Basic Info, Pricing, Specifications, Images (drag-drop upload with preview thumbnails + reorder), Status toggles (Active, Featured).
- Delete confirmation via inline confirm popover, not a jarring browser `confirm()`.

### 5.8 Admin — Orders
- Table: Order ID (short), Customer name, Phone, Product, Qty, Amount, Status (colored badge), Date.
- Status badge colors: New = `--accent-alt`, Contacted = `--warning`, Confirmed = `--accent`, Delivered = muted green, Cancelled = `--danger`.
- Row click → detail drawer/page with full customer + order info and a status dropdown to update.

## 6. Components Library (reusable)

- Button (primary/secondary/ghost/danger, with loading state)
- Badge/Pill (condition grade, discount, order status)
- Card (product card, stat card, admin list-item card)
- Input / Select / Textarea / Radio / Checkbox / Range slider (all dark-themed with `--accent` focus ring)
- Modal / Bottom Sheet (responsive: modal ≥768px, bottom sheet <768px)
- Toast notification (success/error, top-right desktop / top mobile)
- Table (responsive → card list under `md`)
- Empty states (no products, no orders) with illustration + helper text

## 7. Accessibility

- Minimum contrast ratio 4.5:1 for body text against dark backgrounds (verify `--text-secondary` on `--bg-primary`).
- All interactive elements keyboard-navigable, visible focus ring (`--accent`, 2px outline).
- Form fields have associated `<label>` elements, not placeholder-only.
- Alt text required for all product images (admin form should prompt for it, or auto-generate from product name).

## 8. Responsive Behavior Summary

| Breakpoint | Nav | Product Grid | Filters | Admin Layout |
|---|---|---|---|---|
| < 640px (mobile) | Hamburger menu | 1 column | Bottom sheet | Bottom tab bar |
| 640–1024px (tablet) | Full nav, condensed | 2–3 columns | Collapsible sidebar | Icon sidebar |
| > 1024px (desktop) | Full nav | 3–4 columns | Persistent sidebar | Full sidebar |

## 9. Motion & Interaction

- Subtle transitions only (150–250ms ease-in-out) for hover, modal open/close, accordion expand.
- No heavy animation that could slow perceived performance on low-end devices.
- Skeleton loaders (shimmer, `--bg-surface-alt` based) for product grid and admin tables while data loads.
