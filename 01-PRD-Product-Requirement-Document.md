# Product Requirement Document (PRD)
## Refurbished Laptop Store — E-commerce Website

**Version:** 1.0
**Project Type:** Direct-order e-commerce website (no payment gateway)
**Prepared for:** Antigravity Project Build

---

## 1. Overview

A website to showcase and sell refurbished laptops. Customers browse products, view details, and place an order by submitting their details (no online payment). Orders are captured directly into a Supabase database. The business owner manages the product catalog through a hidden admin panel accessible from the same public interface.

## 2. Goals

- Present refurbished laptops professionally to build trust (condition grading, specs, images, warranty info).
- Let customers place orders without needing a payment gateway (Cash on Delivery / Bank Transfer / Pay on Pickup model).
- Give the owner a simple, no-code way to add/update/delete products.
- Deliver a fast, modern, dark-themed UI that works well on mobile, tablet, and desktop.
- Keep infrastructure cost at $0 using Supabase free tier.

## 3. Non-Goals

- No online payment processing (Razorpay/Stripe/PayPal etc.) in v1.
- No multi-vendor support.
- No user account/sign-up system for customers (guest checkout only).
- No shipment tracking integration in v1.

## 4. Target Users

| User Type | Description |
|---|---|
| Customer | Visitor browsing/buying refurbished laptops, no login required |
| Admin (Owner) | Single admin (business owner) managing inventory and viewing orders |

## 5. Key Features

### 5.1 Public Website (Customer-facing)

1. **Home Page**
   - Hero banner (brand tagline, CTA "Shop Now")
   - Featured/Best-deal laptops
   - Category strip (by brand / use-case / budget)
   - Trust badges (Warranty, Tested Battery, Free Delivery, etc.)

2. **Product Listing Page**
   - Grid of product cards (image, name, specs summary, price, discount %, condition grade badge e.g. "Grade A")
   - Filters: Brand, Price range, RAM, Storage, Screen size, Condition grade
   - Sort: Price low-high, high-low, Newest

3. **Product Detail Page**
   - Image gallery
   - Full specifications table (CPU, RAM, Storage, GPU, Display, Battery Health, OS, Ports)
   - Condition grade + what it means
   - Price, discount, warranty period
   - "Place Order" button → Order Form
   - Related products

4. **Order Form (No Payment Gateway)**
   - Fields: Name, Phone, Email, Delivery Address, City, Pincode, Quantity, Preferred Payment Mode (COD / UPI manual / Bank Transfer), Notes
   - On submit → saved to Supabase `orders` table
   - Confirmation screen: "Order Received — we'll contact you shortly" + Order ID
   - Optional: WhatsApp "Confirm via WhatsApp" button pre-filled with order summary

5. **Static Pages**
   - About Us, Contact Us, Warranty Policy, FAQ, Terms & Conditions

6. **Hidden Admin Access**
   - Small, low-emphasis text link in the footer, e.g. "Admin" — intentionally subtle, not a prominent nav item
   - Clicking opens a login form (email + password) on the same page/route (modal or `/admin` route)

### 5.2 Admin Panel (Owner-facing, behind login)

1. **Authentication**
   - Login via Supabase Auth (email/password)
   - Session persisted; logout option

2. **Dashboard**
   - Quick stats: Total products, Active products, New orders (unseen), Total orders

3. **Product Management (CRUD)**
   - Add Product: name, brand, model, price, original price, discount, condition grade, specs (CPU/RAM/Storage/GPU/Display/Battery/OS), stock quantity, images (upload/URLs), category, description, active/inactive toggle, featured toggle
   - Edit Product
   - Delete Product (soft delete preferred — `is_active = false`)
   - List/search/filter products in a table view

4. **Order Management**
   - View all orders in a table (newest first)
   - View order detail (customer info + product ordered + quantity + notes)
   - Update order status: New → Contacted → Confirmed → Delivered → Cancelled
   - Mark as read/unread

5. **(Optional v1.1) Basic settings**
   - Store contact number/WhatsApp number, business hours, address shown on Contact page

## 6. User Flows

**Customer purchase flow:**
Home → Browse/Filter → Product Detail → Place Order → Fill Form → Submit → Confirmation → (Owner contacts customer via phone/WhatsApp to finalize payment & delivery)

**Admin flow:**
Footer "Admin" link → Login → Dashboard → Products tab → Add/Edit/Delete → Orders tab → Update status

## 7. Success Metrics

- Order form completion rate
- Number of products listed
- Admin able to add a new product in under 2 minutes
- Site loads under 2.5s on 4G mobile (Lighthouse Performance > 85)
- Fully usable on screens from 320px to 4K

## 8. Constraints

- Zero/near-zero budget: Supabase free tier (500MB DB, 1GB file storage, 50k monthly active users on Auth)
- No payment gateway integration
- Single admin user (owner) — no role-based access needed initially

## 9. Assumptions

- Owner will manually contact customers post-order to confirm payment (COD/UPI/Bank Transfer) and arrange delivery/pickup.
- Product images will be uploaded by the admin (via Supabase Storage or external image URLs).
- Low-to-moderate traffic suitable for Supabase free tier.

## 10. Future Enhancements (Out of scope for v1)

- Payment gateway integration (Razorpay/UPI intent)
- Customer accounts + order history
- Email/SMS notifications on order status change
- Product reviews & ratings
- Wishlist / Compare laptops
- Multi-admin roles
