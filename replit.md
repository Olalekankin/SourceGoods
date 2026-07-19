# Product Requirements Document
## Pre-Order Commerce Platform for Household & Sourced Items

**Version:** 1.0
**Status:** Draft for engineering review
**Owner:** Ola

---

## 1. Executive Summary

A pre-order-first e-commerce platform for household items sourced from manufacturers. Customers browse and pre-order products before (or as) they are sourced/fulfilled. Admins manage the full lifecycle — product creation with flexible attributes, order tracking, payments (Stripe + manual bank transfer), and fulfillment status — from an admin dashboard embedded in the same application (not a separate app), gated behind role-based auth.

**Core differentiators to build for:**
- Dynamic, per-product attributes (color/size/dimension/etc.) with reusable **attribute presets**
- Transparent order-status lifecycle (pre-order psychology requires trust)
- Dual payment paths: Stripe (card) + Bank Transfer (manual verification)
- Vibrant, Amazon-inspired UI built from a strict reusable component library

---

## 2. Goals & Non-Goals

**Goals**
- Let admins list products with variable attributes without schema changes per product type
- Let admins save attribute sets as reusable **presets** (e.g., "Kitchenware — Color/Size" preset)
- Support pre-order specific flows: MOQ thresholds, ETAs, status transparency
- Single deployable app where `/admin/*` is a protected section of the main Next.js app
- Strong typing end-to-end; no raw fetch/axios calls inside components or Redux slices
- Cloudinary-based image/video pipeline with automatic resizing/optimization

**Non-Goals (v1)**
- Multi-vendor marketplace (single-seller/admin-operated for v1)
- Subscription/recurring billing
- Native mobile app (responsive web only)
- Multi-currency (single currency at launch, structured to extend later)

---

## 3. Users & Roles

| Role | Description | Access |
|---|---|---|
| **Customer** | Browses, pre-orders, pays, tracks orders | Public + `/account/*` |
| **Admin** | Manages products, attributes, presets, orders, payments | `/admin/*` (route-guarded) |
| **Super Admin** (optional, v1.1) | Manages other admin accounts | `/admin/settings/users` |

Role is stored on the `User` document (`role: 'customer' | 'admin' | 'superadmin'`). Admin routes are protected client-side (redirect) **and** server-side (NestJS guard on every admin-scoped endpoint) — never trust client-side gating alone.

---

## 4. Tech Stack

| Layer | Choice |
|---|---|
| Frontend framework | Next.js (App Router) |
| Backend framework | NestJS |
| State management | Redux Toolkit (slices) |
| Styling | Tailwind CSS v4 |
| Database | MongoDB (Mongoose) |
| Media storage | Cloudinary (image + video, with transformation pipeline) |
| Payments | Stripe (card) + manual Bank Transfer flow |
| Auth | Email/password + Google OAuth (NextAuth or custom Passport strategy — see §8) |
| API contract typing | Shared TypeScript interfaces directory |

---

## 5. High-Level Architecture

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│        Next.js App          │  REST  │          NestJS API            │
│  (customer UI + /admin UI)  │◄──────►│  (modular, feature-based)      │
│  Redux Toolkit store        │  JSON  │  Mongoose / MongoDB            │
└─────────────────────────────┘        └──────────────────────────────┘
             │                                        │
             ▼                                        ▼
      Cloudinary (media)                     Stripe (payments/webhooks)
```

- Next.js handles both the storefront and the embedded admin dashboard (same app, `/admin` route group, protected).
- NestJS exposes a modular REST API — one module per feature (Auth, Products, Attributes, Orders, Payments, Media, Users).
- All frontend → backend calls go through a single **API service layer** (`/services`) — components and Redux slices never call `fetch`/`axios` directly.

---

## 6. Frontend Folder Structure (Next.js)

```
/src
├── app/                          # App Router routes
│   ├── (storefront)/
│   │   ├── page.tsx              # Home
│   │   ├── products/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── checkout/success/page.tsx
│   │   ├── checkout/failed/page.tsx
│   │   └── account/orders/page.tsx
│   ├── (admin)/
│   │   └── admin/
│   │       ├── layout.tsx        # Admin shell + guard
│   │       ├── dashboard/page.tsx
│   │       ├── products/page.tsx
│   │       ├── products/new/page.tsx
│   │       ├── products/[id]/edit/page.tsx
│   │       ├── attributes/presets/page.tsx
│   │       ├── orders/page.tsx
│   │       └── orders/[id]/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── callback/google/page.tsx
│   └── layout.tsx
│
├── components/
│   ├── ui/                       # Base reusable, variant-driven components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Badge/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Modal/
│   │   ├── Table/
│   │   ├── Toast/
│   │   ├── Tabs/
│   │   ├── StatusStepper/
│   │   └── FileUploader/
│   ├── storefront/                # Composed, feature-specific
│   │   ├── ProductCard/
│   │   ├── CartDrawer/
│   │   └── PriceTag/
│   └── admin/
│       ├── ProductAttributeBuilder/
│       ├── PresetSelector/
│       ├── OrderStatusUpdater/
│       └── MediaUploader/
│
├── store/
│   ├── index.ts                  # configureStore
│   ├── hooks.ts                  # typed useAppDispatch/useAppSelector
│   └── slices/
│       ├── authSlice.ts
│       ├── productSlice.ts
│       ├── attributeSlice.ts
│       ├── cartSlice.ts
│       ├── orderSlice.ts
│       └── uiSlice.ts            # toasts, modals, global loading
│
├── services/
│   ├── apiClient.ts              # makeAuthenticatedRequest lives here
│   ├── auth/
│   │   └── auth.api.ts           # login, register, google, refreshToken, logout
│   ├── products/
│   │   └── products.api.ts       # list, getBySlug, create, update, delete
│   ├── attributes/
│   │   └── attributes.api.ts     # presets CRUD
│   ├── orders/
│   │   └── orders.api.ts         # create, getMine, adminList, updateStatus
│   ├── payments/
│   │   └── payments.api.ts       # createIntent, confirmBankTransfer
│   └── media/
│       └── media.api.ts          # uploadSignature, delete
│
├── interfaces/
│   ├── user.interface.ts
│   ├── product.interface.ts
│   ├── attribute.interface.ts
│   ├── order.interface.ts
│   ├── payment.interface.ts
│   ├── media.interface.ts
│   └── api.interface.ts          # shared ApiResponse<T>, PaginatedResponse<T>
│
├── lib/
│   ├── constants.ts
│   ├── validators/                # zod schemas per feature
│   └── formatters.ts
│
├── styles/
│   └── globals.css               # Tailwind v4 entry + design tokens
│
└── config/
    └── env.ts                    # typed env access
```

**Key rule enforced by structure:** a component or slice may only import from `services/<feature>/<feature>.api.ts`. Nothing imports `apiClient` directly except the `*.api.ts` files.

---

## 7. The API Service Layer Pattern

`services/apiClient.ts` is the **only** place HTTP happens.

```ts
// services/apiClient.ts
import { ApiResponse } from '@/interfaces/api.interface';

interface RequestOptions extends RequestInit {
  auth?: boolean; // default true
}

export async function makeAuthenticatedRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { auth = true, headers, ...rest } = options;
  const token = auth ? getAccessToken() : null; // reads from memory/cookie store

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    credentials: 'include',
  });

  if (res.status === 401 && auth) {
    const refreshed = await tryRefreshToken();
    if (refreshed) return makeAuthenticatedRequest<T>(path, options);
  }

  const json = await res.json();
  if (!res.ok) throw new ApiError(json.message, res.status, json.errors);
  return json as ApiResponse<T>;
}
```

Each feature module wraps and **exports named functions only** — never the raw client:

```ts
// services/products/products.api.ts
import { makeAuthenticatedRequest } from '../apiClient';
import { Product, CreateProductDTO } from '@/interfaces/product.interface';
import { PaginatedResponse } from '@/interfaces/api.interface';

export const productsApi = {
  list: (params: ProductQuery) =>
    makeAuthenticatedRequest<PaginatedResponse<Product>>(`/products?${toQuery(params)}`, { auth: false }),

  getBySlug: (slug: string) =>
    makeAuthenticatedRequest<Product>(`/products/${slug}`, { auth: false }),

  create: (payload: CreateProductDTO) =>
    makeAuthenticatedRequest<Product>('/products', { method: 'POST', body: JSON.stringify(payload) }),

  update: (id: string, payload: Partial<CreateProductDTO>) =>
    makeAuthenticatedRequest<Product>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),

  remove: (id: string) =>
    makeAuthenticatedRequest<void>(`/products/${id}`, { method: 'DELETE' }),
};
```

Redux slices call `productsApi.list(...)` inside `createAsyncThunk` — never `fetch` directly:

```ts
// store/slices/productSlice.ts
export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (query: ProductQuery) => (await productsApi.list(query)).data
);
```

---

## 8. Authentication

**Methods:** Email/password + Google OAuth, both issuing the same JWT session shape.

**Flow:**
1. Frontend calls `authApi.registerWithEmail()` / `authApi.loginWithEmail()` / redirects to `authApi.googleAuthUrl()`.
2. NestJS `AuthModule` (Passport strategies: `LocalStrategy`, `GoogleStrategy`, `JwtStrategy`) issues a short-lived **access token** (returned in response body, held in memory/Redux) and a long-lived **refresh token** (httpOnly, secure cookie).
3. `apiClient` auto-refreshes on 401 via `/auth/refresh`.
4. Passwords hashed with bcrypt/argon2; Google accounts created with `provider: 'google'`, no password field.

**NestJS Auth module structure:**
```
/src/modules/auth
├── auth.controller.ts       # /auth/register, /login, /google, /google/callback, /refresh, /logout
├── auth.service.ts
├── strategies/
│   ├── local.strategy.ts
│   ├── google.strategy.ts
│   └── jwt.strategy.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
├── decorators/
│   └── roles.decorator.ts     # @Roles('admin')
└── dto/
```

Admin endpoints use `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('admin')`.

---

## 9. Backend Folder Structure (NestJS)

```
/src
├── main.ts
├── app.module.ts
├── modules/
│   ├── auth/                     # see §8
│   ├── users/
│   ├── products/
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── schemas/product.schema.ts
│   │   └── dto/
│   ├── attributes/
│   │   ├── attributes.controller.ts   # preset CRUD
│   │   ├── attributes.service.ts
│   │   └── schemas/attribute-preset.schema.ts
│   ├── orders/
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   └── schemas/order.schema.ts
│   ├── payments/
│   │   ├── payments.controller.ts     # /payments/stripe/intent, /payments/stripe/webhook, /payments/bank-transfer
│   │   ├── payments.service.ts
│   │   ├── stripe.service.ts
│   │   └── schemas/payment.schema.ts
│   ├── media/
│   │   ├── media.controller.ts        # /media/signature, /media/delete
│   │   └── cloudinary.service.ts
│   └── notifications/
│       ├── notifications.service.ts
│       └── templates/                 # order-confirmed.hbs, payment-failed.hbs, shipped.hbs...
├── common/
│   ├── guards/
│   ├── interceptors/                  # response envelope, logging
│   ├── filters/                       # global exception filter
│   └── decorators/
└── config/
    └── configuration.ts
```

---

## 10. Data Models (MongoDB)

### 10.1 User
```ts
{
  _id, email, passwordHash?, provider: 'email' | 'google',
  name, avatarUrl?, role: 'customer' | 'admin' | 'superadmin',
  addresses: Address[], createdAt, updatedAt
}
```

### 10.2 AttributePreset  *(the reusable attribute-set feature)*
```ts
{
  _id,
  name: string,                 // e.g. "Kitchenware — Color/Size"
  attributes: [
    {
      key: string,               // "color"
      label: string,             // "Color"
      type: 'select' | 'color' | 'text' | 'number' | 'dimension',
      options?: string[],        // for select/color: ["Red","Blue"]
      unit?: string,              // for dimension/number: "cm", "kg"
      required: boolean
    }
  ],
  createdBy: ObjectId<User>,
  createdAt, updatedAt
}
```

### 10.3 Product
```ts
{
  _id, name, slug, description, category, brand?,
  basePrice: number, currency: 'NGN' | 'USD' (configurable),
  images: MediaAsset[], videos: MediaAsset[],
  attributePresetId?: ObjectId<AttributePreset>,   // if using a preset
  attributes: [                                     // resolved attribute values for THIS product
    { key: string, label: string, type: string, value: string | number, options?: string[] }
  ],
  variants: [                                       // generated combinations, each with own stock/price delta
    { sku, attributeValues: Record<string,string>, price?, stock: number, images?: MediaAsset[] }
  ],
  isPreOrder: boolean,
  moq?: number,                  // minimum order quantity to trigger sourcing
  currentPreOrderCount: number,
  estimatedShipDate?: Date,
  status: 'draft' | 'published' | 'archived',
  createdAt, updatedAt
}
```

### 10.4 MediaAsset (embedded)
```ts
{
  publicId: string,           // Cloudinary public_id
  url: string,                // secure_url, already transformed
  type: 'image' | 'video',
  width, height, format,
  role: 'primary' | 'gallery' | 'variant'
}
```

### 10.5 Order
```ts
{
  _id, orderNumber, userId,
  items: [{ productId, sku, name, attributeValues, unitPrice, quantity, imageUrl }],
  subtotal, shippingFee, total, currency,
  paymentMethod: 'stripe' | 'bank_transfer',
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
  fulfillmentStatus: 'pending' | 'sourcing' | 'shipped_from_supplier' | 'in_transit' | 'delivered' | 'cancelled',
  shippingAddress: Address,
  statusHistory: [{ status, note?, changedAt, changedBy }],
  createdAt, updatedAt
}
```

### 10.6 Payment
```ts
{
  _id, orderId, method: 'stripe' | 'bank_transfer',
  stripePaymentIntentId?, stripeStatus?,
  bankTransferProof?: MediaAsset,   // uploaded receipt image
  bankTransferVerifiedBy?: ObjectId<User>,
  amount, currency, status: 'pending' | 'succeeded' | 'failed' | 'awaiting_verification',
  createdAt, updatedAt
}
```

---

## 11. Product Attribute & Preset System (Core Feature)

**Problem it solves:** Products vary — a mug has color; a rug has size + dimension; a lamp might have none. Admin should not be forced into a rigid schema, and shouldn't have to redefine the same attribute set repeatedly.

**Flow (Admin → Upload Product):**
1. Admin starts "Add Product" → fills base info (name, description, category, price).
2. On the **Attributes** step, admin chooses:
   - **"Use a saved preset"** → `PresetSelector` dropdown (searchable) loads a saved `AttributePreset`, pre-filling the attribute *schema* (keys/types/options); admin then just fills in values per attribute.
   - **"Define custom attributes"** → `ProductAttributeBuilder` lets admin add rows: `label`, `type` (select/color/text/number/dimension), `options` (for select/color), `unit` (for dimension/number), `required`.
   - Optional: **"Save this attribute set as a preset"** checkbox + name field → persists to `AttributePreset` collection for reuse on future products.
3. If the product has multiple variable attributes with multiple values (e.g., Color × Size), the system auto-generates the **variant matrix** (Cartesian product) so admin can set stock/price-delta per variant.
4. Media step: admin uploads image(s) and/or video(s) per product, and optionally per-variant images.

**Why this design:** attribute *definitions* (presets) are decoupled from attribute *values* (per-product). This is the standard pattern for variable-attribute catalogs (similar in spirit to Shopify "Options" / Amazon "Variation Themes") — reusable structure, flexible values.

---

## 12. Media Pipeline (Cloudinary)

- Admin selects files in `MediaUploader` (drag-drop, accepts image + video, shows preview).
- Frontend requests a **signed upload signature** from `POST /media/signature` (NestJS signs with API secret — the secret never touches the browser).
- Frontend uploads directly to Cloudinary using the signature (keeps large files off our server).
- **Upload preset / transformation enforced server-side at signature-generation time**, so nothing bypasses sizing rules:
  - Product primary image: resized/cropped to `1000x1000`, `c_fill`, `q_auto`, `f_auto`
  - Gallery images: max `1200px` longest edge, `q_auto`, `f_auto`
  - Thumbnails: derived on the fly via Cloudinary URL transformation (`w_300,h_300,c_fill`) — not stored separately
  - Video: max `1080p`, `q_auto`, compressed via Cloudinary video pipeline, auto-generated thumbnail frame used as poster image
- On success, Cloudinary returns `public_id`, `secure_url`, `width`, `height`, `format` → saved into the product's `images[]`/`videos[]`.
- Deletion: `media.api.ts` → `POST /media/delete` → NestJS calls Cloudinary destroy API (never exposed to client directly, to protect credentials and prevent arbitrary deletes).

---

## 13. Payments

### 13.1 Stripe (Card)
1. Checkout → `paymentsApi.createStripeIntent(orderId)` → NestJS creates a `PaymentIntent`, returns `clientSecret`.
2. Frontend uses Stripe Elements to collect card details, confirms payment client-side.
3. Stripe webhook (`POST /payments/stripe/webhook`) is the **source of truth** — updates `Payment.status` and `Order.paymentStatus` on `payment_intent.succeeded` / `.payment_failed`. Client-side confirmation only drives immediate UI redirect; webhook drives actual state.
4. Redirect: `/checkout/success?orderId=...` or `/checkout/failed?orderId=...`.

### 13.2 Bank Transfer
1. Customer selects "Bank Transfer" → order created with `paymentStatus: 'pending'`, shown static bank details + unique reference (order number).
2. Customer uploads proof of payment (receipt image) via `MediaUploader` → stored as `Payment.bankTransferProof`.
3. Order enters `awaiting_verification`. Admin dashboard surfaces these in an **"Awaiting Verification"** queue.
4. Admin manually marks as **Verified** (`paymentStatus: 'paid'`) or **Rejected** → triggers customer email notification either way.

### 13.3 Success / Fail Pages
- `/checkout/success` — order summary, estimated ship date (if pre-order), "Track Order" CTA.
- `/checkout/failed` — reason (if available from Stripe error code), "Retry Payment" and "Contact Support" CTAs. Order preserved so retry doesn't create a duplicate.

---

## 14. Order & Pre-Order Lifecycle

**Fulfillment status states:** `pending → sourcing → shipped_from_supplier → in_transit → delivered` (+ `cancelled` branch), each with a timestamp and optional note, shown on a `StatusStepper` component both to customer (order tracking page) and admin (order detail).

**MOQ logic:** if `product.isPreOrder && product.moq` is set, product page shows a live counter ("34 of 50 pre-ordered — ships once MOQ is reached"). When `currentPreOrderCount >= moq` OR a configured cutoff date passes (whichever first), a scheduled job (NestJS `@Cron`) flips eligible orders to `sourcing` and notifies customers.

**Notifications** (email, via `NotificationsService`, triggered on state changes): order confirmed, payment received, payment failed, MOQ reached/sourcing started, shipped, delivered, bank transfer verified/rejected.

---

## 15. Admin Dashboard (embedded in main app)

Route: `/admin` (route group `(admin)`, guarded by `AdminGuard` — checks `role === 'admin'`, redirects to `/auth/login` otherwise, with return-to param).

**Pages:**
| Route | Purpose |
|---|---|
| `/admin/dashboard` | KPI cards (orders today, revenue, pending verifications, low stock), recent orders table |
| `/admin/products` | Paginated/searchable product table, status badges, quick actions |
| `/admin/products/new` | Multi-step form: Basic Info → Attributes (preset or custom) → Variants → Media → Review |
| `/admin/products/[id]/edit` | Same form, pre-filled |
| `/admin/attributes/presets` | List, create, edit, delete attribute presets |
| `/admin/orders` | Filterable table (status, payment method, date range) |
| `/admin/orders/[id]` | Full order detail, status updater, payment verification (bank transfer), refund trigger |

**Admin layout:** persistent left sidebar (nav), top bar (admin profile, notifications bell), content area — built from the same `ui/` component set as the storefront (no separate design system).

---

## 16. Design System & UI Guidelines

**Color direction — vibrant, Amazon-inspired:**
| Token | Use | Example |
|---|---|---|
| `--color-primary` | Primary actions | Deep orange/amber (`#FF9900`-family) |
| `--color-secondary` | Header/nav, dark contrast | Navy (`#131921`-family) |
| `--color-accent` | Highlights, badges, deals | Vibrant yellow |
| `--color-success` | Paid/delivered states | Green |
| `--color-danger` | Failed/cancelled states | Red |
| `--color-warning` | Pending/awaiting states | Amber |

Defined as Tailwind v4 `@theme` tokens in `globals.css` (CSS-first config, no `tailwind.config.js` needed):
```css
@import "tailwindcss";
@theme {
  --color-primary: #FF9900;
  --color-primary-dark: #E88A00;
  --color-secondary: #131921;
  --color-accent: #FFD814;
  --color-success: #16A34A;
  --color-danger: #DC2626;
  --color-warning: #F59E0B;
  --radius-base: 0.375rem; /* rounded-md — the ceiling, never exceeded */
}
```

**Roundness rule:** every component uses `rounded-md` (0.375rem) as the **maximum** — smaller (`rounded-sm`, `rounded`) is fine for dense UI (badges, chips), but nothing exceeds `rounded-md`. Enforced by only ever using the `--radius-base` token / `rounded-md` utility class in the `ui/` component set, never `rounded-lg/xl/2xl/full` (except perhaps circular avatars, which are an explicit, documented exception).

**Reusability rule:** any UI element appearing more than twice across the app must live in `components/ui/` as a variant-driven component (using `class-variance-authority` or equivalent), e.g.:

```ts
// components/ui/Button/Button.tsx
const buttonVariants = cva('rounded-md font-medium transition-colors', {
  variants: {
    variant: {
      primary: 'bg-primary text-white hover:bg-primary-dark',
      secondary: 'bg-secondary text-white hover:bg-secondary/90',
      outline: 'border border-secondary text-secondary hover:bg-secondary/5',
      danger: 'bg-danger text-white hover:bg-danger/90',
    },
    size: { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3 text-lg' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});
```

Same pattern applies to `Badge` (status colors), `Card`, `Input`, `Select`, `Modal`, `Table`, `Toast`.

---

## 17. Non-Functional Requirements

- **Security:** helmet, rate limiting on auth endpoints, input validation via `class-validator` DTOs, Mongo injection protection via Mongoose sanitization, Stripe webhook signature verification, Cloudinary signed uploads only.
- **Performance:** MongoDB indexes on `slug`, `category`, `status` (products); `userId`, `orderNumber`, `fulfillmentStatus` (orders). Cloudinary handles image optimization/CDN.
- **Observability:** structured logging (NestJS interceptor), error tracking hook point (e.g., Sentry-ready).
- **Testing:** unit tests per NestJS service, e2e tests for critical flows (checkout, product creation with attributes).

---

## 18. Open Questions / Assumptions

1. Single currency at launch — confirm NGN vs USD as default (schema supports either).
2. Shipping fee: flat rate vs calculated — assumed flat/manual for v1.
3. Refunds: assumed manual admin-triggered for both Stripe and bank transfer in v1 (no automated refund rules engine).
4. Guest checkout: assumed **not supported** in v1 (auth required to order) — confirm.

---

## 19. Phased Rollout

| Phase | Scope |
|---|---|
| **Phase 1** | Auth (email + Google), product CRUD + attributes/presets, storefront browse/PDP, cart |
| **Phase 2** | Checkout, Stripe integration, bank transfer flow, order lifecycle + notifications |
| **Phase 3** | Admin dashboard KPIs, MOQ/pre-order automation, polish + variant matrix UI |