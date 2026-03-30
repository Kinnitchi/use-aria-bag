// ─── Model & Product ─────────────────────────────────────────────────────────

export interface Model {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  image: string;
  count: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  color: string;
  colorHex?: string;
}

export interface SuggestedProduct {
  id: string;
  name: string;
  price: number;
  color: string;
  colorHex: string;
  modelSlug: string;
  modelName: string;
  modelImage: string;
}

export interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  index: number;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  cartId: string;
  productId: string;
  modelId: string;
  name: string;
  price: number;
  color: string;
  image: string;
  quantity: number;
}
