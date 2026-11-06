# Technical Requirement Document (TRD)
## Refurbished Laptop Store — E-commerce Website

**Version:** 1.0
**Backend:** Supabase (Free Tier)
**Prepared for:** Antigravity Project Build

---

## 1. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend Framework | React (Vite) or Next.js | Next.js recommended for SEO (product pages need indexing) |
| Styling | Tailwind CSS | Utility-first, fast to theme dark mode |
| State Management | React Context / Zustand | Lightweight, no Redux needed |
| Backend / DB | Supabase (PostgreSQL) | Free tier: 500MB DB, 1GB storage, 50k MAU auth |
| Auth (Admin only) | Supabase Auth (email/password) | Single admin account |
| File Storage | Supabase Storage | Product images bucket |
| Hosting (Frontend) | Vercel / Netlify (free tier) | Auto CI/CD from GitHub |
| Image Optimization | next/image or manual resize before upload | Keep storage under free-tier limit |
| Icons | lucide-react | Lightweight icon set |
| Forms | React Hook Form + Zod | Validation for order form & admin forms |

## 2. Architecture Overview

```
┌─────────────────────────┐
│   Customer Browser      │
│  (Public Storefront)    │
└───────────┬──────────────┘
            │ HTTPS
            ▼
┌─────────────────────────┐        ┌──────────────────────┐
│  Frontend (Next.js/React)│◄──────►│  Supabase Auth        │
│  Hosted on Vercel        │        │  (Admin login only)   │
└───────────┬──────────────┘        └──────────────────────┘
            │ Supabase JS SDK (REST/Realtime)
            ▼
┌─────────────────────────────────────────────┐
│              Supabase (Backend)              │
│  ┌───────────────┐  ┌────────────────────┐   │
│  │ PostgreSQL DB  │  │ Storage (images)    │   │
│  │ - products     │  │ product-images/     │   │
│  │ - orders       │  └────────────────────┘   │
│  │ - admin (auth) │                            │
│  └───────────────┘                            │
└─────────────────────────────────────────────┘
```

## 3. Frontend Routing Structure

```
/                       → Home
/products               → Product listing + filters
/products/[slug]        → Product detail + order form
/about                  → About us
/contact                → Contact page
/warranty               → Warranty policy
/admin                  → Admin login (also linked as small footer text)
/admin/dashboard        → Stats overview (protected)
/admin/products         → Product list (protected)
/admin/products/new     → Add product (protected)
/admin/products/[id]/edit → Edit product (protected)
/admin/orders           → Orders list (protected)
/admin/orders/[id]      → Order detail (protected)
```

Route protection: a client-side (or Next.js middleware) check on `/admin/*` (excluding `/admin` login itself) verifying an active Supabase session; redirect to `/admin` if absent.

## 4. Admin Access Requirement (Hidden Login)

- No "Admin Login" item in the main navigation bar.
- A small text link, e.g. `© 2026 YourBrand · Admin`, placed in the footer at reduced font size (e.g. `text-xs text-gray-500`).
- Clicking opens `/admin` which renders a minimal centered login form (email + password) using the same dark theme.
- On successful `supabase.auth.signInWithPassword()`, redirect to `/admin/dashboard`.
- No public sign-up route exists; the admin account is created once manually via Supabase Dashboard.

## 5. Authentication & Authorization

- Supabase Auth handles admin login (email/password provider only; disable public sign-ups in Supabase Auth settings).
- Row Level Security (RLS) enabled on all tables.
  - `products`: public **read** access (only where `is_active = true`); **write** (insert/update/delete) restricted to `authenticated` role matching the admin user.
  - `orders`: public **insert** only (customers can create orders, cannot read others'); **read/update** restricted to `authenticated` (admin).
- Session managed via Supabase JS client (`@supabase/supabase-js`), stored in browser (httpOnly not available client-side, use Supabase's default secure storage handling).

## 6. Image Handling

- Bucket: `product-images` (public read bucket in Supabase Storage).
- Admin uploads images via the Add/Edit Product form → uploaded to `product-images/{product_id}/{filename}`.
- Public URL retrieved via `supabase.storage.from('product-images').getPublicUrl(path)` and stored in the `products.images` column (array of URLs).
- Recommend client-side image compression before upload (e.g. `browser-image-compression`) to conserve the 1GB free storage limit.

## 7. Order Submission Flow (No Payment Gateway)

1. Customer fills order form on Product Detail page.
2. Client validates fields (Zod schema: name, phone, email, address, city, pincode required).
3. `supabase.from('orders').insert({...})` — insert-only, anonymous key used (RLS allows public insert).
4. On success, show confirmation with generated `order_id` (UUID).
5. Optional: generate a `wa.me` deep link with a pre-filled message summarizing the order for the customer to send to the business WhatsApp number.
6. Admin sees new order in `/admin/orders` (sorted by `created_at DESC`, unread orders highlighted).

## 8. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
(Only the anon/public key is used client-side; RLS policies enforce access control. Never expose the `service_role` key in the frontend.)

## 9. Performance & SEO Requirements

- Lighthouse Performance score ≥ 85 on mobile.
- Lazy-load product images below the fold.
- Server-side rendering or static generation (Next.js `generateStaticParams`/ISR) for product pages for SEO indexing.
- Meta tags (title, description, OG image) per product page.
- Responsive images via `srcset` / Next.js Image component.

## 10. Responsiveness Requirements

- Breakpoints (Tailwind default): `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px.
- Mobile-first layout; product grid: 1 col (mobile) → 2 col (sm) → 3 col (md/lg) → 4 col (xl).
- Admin tables switch to stacked card view below `md` breakpoint.
- Touch-friendly tap targets (min 44x44px) throughout.

## 11. Deployment

- Frontend: Vercel free tier, connected to GitHub repo, auto-deploy on push to `main`.
- Backend: Supabase free-tier project (single project for DB, Auth, Storage).
- Domain: custom domain optional via Vercel DNS settings.

## 12. Security Considerations

- RLS enabled on every table — no table left with default open access.
- Rate-limit order submissions (basic client-side debounce + optionally Supabase Edge Function with rate limiting if abuse becomes an issue).
- Sanitize all form inputs; use parameterized queries via Supabase SDK (default behavior, no raw SQL from client).
- Admin route not indexed: add `robots.txt` disallow for `/admin` and `noindex` meta tag on admin pages.
- HTTPS enforced by default via Vercel + Supabase.

## 13. Testing Requirements

- Unit tests for form validation logic.
- Manual QA checklist: CRUD operations, order submission, RLS access checks (try reading orders/writing products with anon key — should fail), responsive check across breakpoints, dark theme contrast/accessibility check.

## 14. Browser/Device Support

- Latest 2 versions of Chrome, Safari, Firefox, Edge.
- iOS Safari and Android Chrome (mobile-first priority).
