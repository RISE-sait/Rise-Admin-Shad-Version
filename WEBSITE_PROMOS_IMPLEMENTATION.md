# Website Promos Feature Implementation

## Goal
Allow admins to manage website content (hero banners and feature cards) from the admin panel instead of hardcoding in the website.

### What We're Building
1. **Hero Promos** - Rotating banners in hero section (like "Kapwa Tournament" that shows for 5 seconds)
2. **Feature Cards** - "Discover what Rise has to offer" section cards

### Features
- Start/end dates for auto-show/hide based on date
- Image upload to GCP storage
- Preview functionality in admin panel
- Display order control
- Active/inactive toggle

---

## Progress

### Backend (API) - COMPLETED
1. **Database Migration** - `20251127000000_create_website_promos.sql`
   - `website.hero_promos` table
   - `website.feature_cards` table
   - Both have: title, description, image_url, button_text, button_link, display_order, is_active, start_date, end_date

2. **SQLC Queries** - `/internal/domains/website_promo/persistence/sqlc/`
   - CRUD for hero_promos
   - CRUD for feature_cards
   - GetActive queries filter by is_active + date range

3. **DTOs** - `/internal/domains/website_promo/dto/promo_dto.go`
   - CreateHeroPromoRequest, UpdateHeroPromoRequest, HeroPromoResponse
   - CreateFeatureCardRequest, UpdateFeatureCardRequest, FeatureCardResponse

4. **Handler** - `/internal/domains/website_promo/handler/promo_handler.go`
   - Full CRUD for both hero promos and feature cards

5. **Routes** - Added to `/cmd/server/router/router.go`
   - Public: `GET /website/hero-promos/active`, `GET /website/feature-cards/active`
   - Admin CRUD: `/website/hero-promos/*`, `/website/feature-cards/*`

6. **Image Upload** - `/internal/domains/upload/handler/upload_handler.go`
   - `POST /upload/promo-image?type=hero|feature`
   - Uploads to `website-promos/{type}/` in GCP

---

### Admin Panel - COMPLETED
Created:
1. **Types** - `types/website-promo.ts`
   - HeroPromo, FeatureCard interfaces
   - Create/Update request types

2. **Service Functions** - `services/website-promo.ts`
   - Full CRUD for hero promos and feature cards
   - Image upload function

3. **Page** - `app/(dashboard)/manage/website-content/page.tsx`
   - Role-protected for ADMIN/SUPERADMIN only

4. **Components** - `components/website-content/`
   - `WebsiteContentPage.tsx` - Main page with tabs
   - `HeroPromoTable.tsx` - Table listing hero promos
   - `FeatureCardTable.tsx` - Table listing feature cards
   - `HeroPromoForm.tsx` - Create/edit form with image upload
   - `FeatureCardForm.tsx` - Create/edit form with image upload
   - `HeroPromoInfoPanel.tsx` - Details/Preview/Edit tabs with delete
   - `FeatureCardInfoPanel.tsx` - Details/Preview/Edit tabs with delete

5. **Navigation** - Added "Website Content" to sidebar (under Manage, admin only)

---

### Website (RisePublicWebsite) - NOT STARTED
Need to update:
1. `/app/page.tsx` - Fetch hero promos and feature cards from API
2. Replace hardcoded data with API data
3. Handle loading/error states

---

## API Endpoints Summary

### Public (no auth)
- `GET /website/hero-promos/active` - Get active hero promos for website
- `GET /website/feature-cards/active` - Get active feature cards for website

### Admin (requires admin/superadmin auth)
- `GET /website/hero-promos/` - Get all hero promos
- `GET /website/hero-promos/{id}` - Get single hero promo
- `POST /website/hero-promos/` - Create hero promo
- `PUT /website/hero-promos/{id}` - Update hero promo
- `DELETE /website/hero-promos/{id}` - Delete hero promo
- Same pattern for `/website/feature-cards/*`

### Image Upload
- `POST /upload/promo-image?type=hero|feature` - Upload promo image to GCP

---

## Data Structures

### Hero Promo
```typescript
{
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image_url: string;
  button_text?: string;
  button_link?: string;
  display_order: number;
  duration_seconds: number; // How long to show (default 5)
  is_active: boolean;
  start_date?: string; // ISO date
  end_date?: string;   // ISO date
  created_at: string;
  updated_at: string;
}
```

### Feature Card
```typescript
{
  id: string;
  title: string;
  description?: string;
  image_url: string;
  button_text?: string;
  button_link?: string;
  display_order: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}
```
