import {
  HeroPromo,
  FeatureCard,
  CreateHeroPromoRequest,
  UpdateHeroPromoRequest,
  CreateFeatureCardRequest,
  UpdateFeatureCardRequest,
} from "@/types/website-promo";
import getValue from "@/configs/constants";
import { addAuthHeader } from "@/lib/auth-header";

const API_BASE = getValue("API");

// ============ Hero Promos ============

export async function getAllHeroPromos(jwt: string): Promise<HeroPromo[]> {
  const response = await fetch(`${API_BASE}website/hero-promos/`, {
    method: "GET",
    ...addAuthHeader(jwt),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch hero promos: ${response.statusText}`);
  }

  const data = await response.json();
  return data || [];
}

export async function getActiveHeroPromos(): Promise<HeroPromo[]> {
  const response = await fetch(`${API_BASE}website/hero-promos/active`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch active hero promos: ${response.statusText}`);
  }

  const data = await response.json();
  return data || [];
}

export async function getHeroPromoById(id: string, jwt: string): Promise<HeroPromo> {
  const response = await fetch(`${API_BASE}website/hero-promos/${id}`, {
    method: "GET",
    ...addAuthHeader(jwt),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch hero promo: ${response.statusText}`);
  }

  return await response.json();
}

export async function createHeroPromo(
  promo: CreateHeroPromoRequest,
  jwt: string
): Promise<HeroPromo> {
  const response = await fetch(`${API_BASE}website/hero-promos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(promo),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to create hero promo: ${response.statusText}`);
  }

  return await response.json();
}

export async function updateHeroPromo(
  id: string,
  promo: UpdateHeroPromoRequest,
  jwt: string
): Promise<HeroPromo> {
  const response = await fetch(`${API_BASE}website/hero-promos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(promo),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to update hero promo: ${response.statusText}`);
  }

  return await response.json();
}

export async function deleteHeroPromo(id: string, jwt: string): Promise<void> {
  const response = await fetch(`${API_BASE}website/hero-promos/${id}`, {
    method: "DELETE",
    ...addAuthHeader(jwt),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to delete hero promo: ${response.statusText}`);
  }
}

// ============ Feature Cards ============

export async function getAllFeatureCards(jwt: string): Promise<FeatureCard[]> {
  const response = await fetch(`${API_BASE}website/feature-cards/`, {
    method: "GET",
    ...addAuthHeader(jwt),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch feature cards: ${response.statusText}`);
  }

  const data = await response.json();
  return data || [];
}

export async function getActiveFeatureCards(): Promise<FeatureCard[]> {
  const response = await fetch(`${API_BASE}website/feature-cards/active`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch active feature cards: ${response.statusText}`);
  }

  const data = await response.json();
  return data || [];
}

export async function getFeatureCardById(id: string, jwt: string): Promise<FeatureCard> {
  const response = await fetch(`${API_BASE}website/feature-cards/${id}`, {
    method: "GET",
    ...addAuthHeader(jwt),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch feature card: ${response.statusText}`);
  }

  return await response.json();
}

export async function createFeatureCard(
  card: CreateFeatureCardRequest,
  jwt: string
): Promise<FeatureCard> {
  const response = await fetch(`${API_BASE}website/feature-cards/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(card),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to create feature card: ${response.statusText}`);
  }

  return await response.json();
}

export async function updateFeatureCard(
  id: string,
  card: UpdateFeatureCardRequest,
  jwt: string
): Promise<FeatureCard> {
  const response = await fetch(`${API_BASE}website/feature-cards/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(card),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to update feature card: ${response.statusText}`);
  }

  return await response.json();
}

export async function deleteFeatureCard(id: string, jwt: string): Promise<void> {
  const response = await fetch(`${API_BASE}website/feature-cards/${id}`, {
    method: "DELETE",
    ...addAuthHeader(jwt),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to delete feature card: ${response.statusText}`);
  }
}

// ============ Image Upload ============

export async function uploadPromoImage(
  file: File,
  type: "hero" | "feature",
  jwt: string
): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE}upload/promo-image?type=${type}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to upload image: ${response.statusText}`);
  }

  const data = await response.json();
  return data.url;
}
