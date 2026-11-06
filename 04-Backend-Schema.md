# Backend Schema Document
## Refurbished Laptop Store — Supabase (PostgreSQL) Schema

**Version:** 1.0

---

## 1. Overview

Two core tables (`products`, `orders`), Supabase Auth for the single admin user, and a public Storage bucket (`product-images`). Row Level Security (RLS) enforces that customers can only read active products and insert orders, while only the authenticated admin can write products and read/update orders.

## 2. Entity Relationship Summary

```
products (1) ────< (many) orders
   id  ◄────────────── product_id (FK)
```

- `orders.product_id` references `products.id`.
- No `users` table needed for customers (guest ordering); admin identity is handled entirely by Supabase Auth (`auth.users`).

## 3. Table: `products`

```sql
create table public.products (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,               -- url-friendly identifier, e.g. "dell-latitude-5490-i5"
  name            text not null,                       -- e.g. "Dell Latitude 5490"
  brand           text not null,                        -- e.g. "Dell", "HP", "Lenovo"
  model           text,
  category        text default 'laptop',                -- laptop, business, gaming, ultrabook, etc.
  condition_grade text not null default 'B'             -- 'A', 'B', 'C'
                    check (condition_grade in ('A','B','C')),
  price           numeric(10,2) not null,
  original_price  numeric(10,2),
  discount_percent int generated always as (
                    case when original_price is not null and original_price > 0
                      then round(((original_price - price) / original_price) * 100)
                      else 0 end
                  ) stored,
  stock_quantity  int not null default 1,
  is_active       boolean not null default true,
  is_featured     boolean not null default false,
  description     text,
  specs           jsonb default '{}'::jsonb,            -- { "cpu": "i5-8350U", "ram": "8GB", "storage": "256GB SSD",
                                                          --   "display": "14\" FHD", "gpu": "Intel UHD 620",
                                                          --   "battery_health": "85%", "os": "Windows 11",
                                                          --   "ports": ["USB-C","HDMI","USB-A x2"] }
  images          text[] default '{}',                  -- array of public Storage URLs
  warranty_months int default 3,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_products_active on public.products (is_active);
create index idx_products_brand on public.products (brand);
create index idx_products_category on public.products (category);

-- auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();
```

## 4. Table: `orders`

```sql
create table public.orders (
  id               uuid primary key default gen_random_uuid(),
  order_number     text unique not null default (
                     'ORD-' || to_char(now(), 'YYMMDD') || '-' ||
                     lpad(floor(random()*10000)::text, 4, '0')
                   ),
  product_id       uuid references public.products (id) on delete set null,
  product_name_snapshot text not null,       -- keep product name at time of order (in case product is later edited/deleted)
  product_price_snapshot numeric(10,2) not null,
  quantity         int not null default 1 check (quantity > 0),
  total_amount     numeric(10,2) generated always as (product_price_snapshot * quantity) stored,

  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text,
  delivery_address text not null,
  city             text not null,
  pincode          text not null,

  payment_preference text default 'COD' check (payment_preference in ('COD','Bank Transfer','UPI Manual')),
  notes            text,

  status           text not null default 'New'
                    check (status in ('New','Contacted','Confirmed','Delivered','Cancelled')),
  is_read          boolean not null default false,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_orders_status on public.orders (status);
create index idx_orders_created_at on public.orders (created_at desc);

create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();
```

> **Note:** `product_name_snapshot` and `product_price_snapshot` are captured at order time (set by the frontend on insert) so historical orders remain accurate even if a product's price changes or the product is later deleted.

## 5. Row Level Security (RLS)

Enable RLS on both tables:

```sql
alter table public.products enable row level security;
alter table public.orders enable row level security;
```

### 5.1 `products` policies

```sql
-- Public can read only active products
create policy "Public can view active products"
on public.products for select
to anon, authenticated
using (is_active = true);

-- Admin (authenticated) can read all products including inactive
create policy "Admin can view all products"
on public.products for select
to authenticated
using (true);

-- Only authenticated (admin) can insert
create policy "Admin can insert products"
on public.products for insert
to authenticated
with check (true);

-- Only authenticated (admin) can update
create policy "Admin can update products"
on public.products for update
to authenticated
using (true)
with check (true);

-- Only authenticated (admin) can delete
create policy "Admin can delete products"
on public.products for delete
to authenticated
using (true);
```

### 5.2 `orders` policies

```sql
-- Anyone (including anonymous customers) can insert an order
create policy "Anyone can place an order"
on public.orders for insert
to anon, authenticated
with check (true);

-- Only authenticated (admin) can view orders
create policy "Admin can view orders"
on public.orders for select
to authenticated
using (true);

-- Only authenticated (admin) can update order status
create policy "Admin can update orders"
on public.orders for update
to authenticated
using (true)
with check (true);

-- No public delete policy — orders are not deletable by default (data retention)
```

> Since there is a single admin account, all `authenticated` sessions are trusted as admin. If more admins are added later, add a `role` column check via a `profiles` table instead of trusting `authenticated` broadly.

## 6. Storage Bucket: `product-images`

```sql
-- Create bucket via Supabase Dashboard or SQL:
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;
```

**Storage policies:**

```sql
-- Public can view/download images
create policy "Public can view product images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');

-- Only authenticated (admin) can upload
create policy "Admin can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

-- Only authenticated (admin) can update/delete
create policy "Admin can modify product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images');

create policy "Admin can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images');
```

Suggested path convention: `product-images/{product_id}/{timestamp}-{filename}.webp`

## 7. Admin User Setup

- Create the single admin account manually via **Supabase Dashboard → Authentication → Users → Add User** (email + password), or via SQL using `auth.users` (not recommended manually — use the dashboard/API).
- Disable public sign-ups: **Authentication → Providers → Email → toggle off "Allow new users to sign up"**.
- No `role` column is required for v1 since there is only one admin; the `authenticated` role from Supabase Auth is sufficient for RLS checks.

## 8. Sample Dummy Product (Seed Data)

```sql
insert into public.products
(slug, name, brand, model, category, condition_grade, price, original_price,
 stock_quantity, is_active, is_featured, description, specs, images, warranty_months)
values
(
  'dell-latitude-5490-i5-8gb-256gb',
  'Dell Latitude 5490',
  'Dell',
  'Latitude 5490',
  'business',
  'A',
  18999.00,
  24999.00,
  5,
  true,
  true,
  'Reliable business laptop, fully tested and refurbished. Great battery life and durable build, ideal for everyday work and study.',
  '{
     "cpu": "Intel Core i5-8350U",
     "ram": "8GB DDR4",
     "storage": "256GB SSD",
     "display": "14-inch FHD (1920x1080)",
     "gpu": "Intel UHD Graphics 620",
     "battery_health": "88%",
     "os": "Windows 11 Pro",
     "ports": ["USB-C", "USB-A x2", "HDMI", "Ethernet", "SD Card Reader"]
   }'::jsonb,
  array[
    'https://your-project.supabase.co/storage/v1/object/public/product-images/sample/dell-latitude-5490-1.webp',
    'https://your-project.supabase.co/storage/v1/object/public/product-images/sample/dell-latitude-5490-2.webp'
  ],
  3
);
```

## 9. Example Queries (Frontend Usage Reference)

```js
// Fetch active products (public listing)
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('is_active', true)
  .order('created_at', { ascending: false });

// Fetch single product by slug
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('slug', slug)
  .single();

// Place an order (public insert)
const { data, error } = await supabase
  .from('orders')
  .insert({
    product_id: product.id,
    product_name_snapshot: product.name,
    product_price_snapshot: product.price,
    quantity: 1,
    customer_name: form.name,
    customer_phone: form.phone,
    customer_email: form.email,
    delivery_address: form.address,
    city: form.city,
    pincode: form.pincode,
    payment_preference: form.paymentPreference,
    notes: form.notes
  })
  .select()
  .single();

// Admin: fetch all orders (requires authenticated session)
const { data } = await supabase
  .from('orders')
  .select('*, products(name, images)')
  .order('created_at', { ascending: false });

// Admin: update order status
await supabase
  .from('orders')
  .update({ status: 'Confirmed' })
  .eq('id', orderId);
```

## 10. Supabase Free-Tier Capacity Notes

| Resource | Free Tier Limit | Notes |
|---|---|---|
| Database | 500 MB | Products + orders text/jsonb data is lightweight; thousands of rows fit easily |
| File Storage | 1 GB | Compress images to WebP, ~100–200KB each → ~5,000+ images fit |
| Auth MAU | 50,000 | Only 1 admin user, far under limit |
| Bandwidth | 5 GB/month | Sufficient for a small-to-medium storefront |
| API Requests | Unlimited (rate-limited) | No special handling needed for expected traffic |

Projects on the free tier pause after 7 days of inactivity — schedule a periodic ping (e.g. a free cron service hitting a lightweight query) if the store may go idle for a week or more.
