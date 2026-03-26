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
  id: number;
  name: string;
  price: number;
  color: string;
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
  productId: number;
  modelId: string;
  name: string;
  price: number;
  color: string;
  image: string;
  quantity: number;
}
