// Hero Promo Types

export interface HeroPromo {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  media_url: string;
  media_type: "image" | "video";
  thumbnail_url?: string | null;
  button_text?: string | null;
  button_link?: string | null;
  display_order: number;
  duration_seconds: number;
  is_active: boolean;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateHeroPromoRequest {
  title: string;
  subtitle?: string;
  description?: string;
  media_url: string;
  media_type?: string;
  thumbnail_url?: string;
  button_text?: string;
  button_link?: string;
  display_order?: number;
  duration_seconds?: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

export interface UpdateHeroPromoRequest {
  title: string;
  subtitle?: string;
  description?: string;
  media_url: string;
  media_type?: string;
  thumbnail_url?: string;
  button_text?: string;
  button_link?: string;
  display_order?: number;
  duration_seconds?: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

// Feature Card Types

export interface FeatureCard {
  id: string;
  title: string;
  description?: string | null;
  image_url: string;
  button_text?: string | null;
  button_link?: string | null;
  display_order: number;
  is_active: boolean;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateFeatureCardRequest {
  title: string;
  description?: string;
  image_url: string;
  button_text?: string;
  button_link?: string;
  display_order?: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

export interface UpdateFeatureCardRequest {
  title: string;
  description?: string;
  image_url: string;
  button_text?: string;
  button_link?: string;
  display_order?: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

// Promo Video Types

export interface PromoVideo {
  id: string;
  title: string;
  description?: string | null;
  video_url: string;
  thumbnail_url: string;
  category?: string | null;
  display_order: number;
  is_active: boolean;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePromoVideoRequest {
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url: string;
  category?: string;
  display_order?: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

export interface UpdatePromoVideoRequest {
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url: string;
  category?: string;
  display_order?: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}
