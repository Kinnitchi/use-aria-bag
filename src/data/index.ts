import type { Model, Product, Slide } from "@/src/types";

export const models: Model[] = [
  {
    id: "tote",
    name: "Tote",
    description: "Espaçosa e versátil",
    fullDescription:
      "As bolsas Tote são perfeitas para o dia a dia. Com amplo espaço interno e design atemporal, são ideais para quem precisa carregar muitos itens com elegância.",
    image: "/images/tote.jpg",
    count: 12,
  },
  {
    id: "crossbody",
    name: "Crossbody",
    description: "Prática e elegante",
    fullDescription:
      "As bolsas Crossbody combinam praticidade e sofisticação. Com alça transversal, deixam as mãos livres enquanto você mantém seus pertences seguros e acessíveis.",
    image: "/images/crossbody.jpg",
    count: 8,
  },
  {
    id: "clutch",
    name: "Clutch",
    description: "Para ocasiões especiais",
    fullDescription:
      "As Clutches são o acessório perfeito para eventos especiais. Compactas e elegantes, complementam qualquer look de festa ou ocasião formal.",
    image: "/images/clutch.jpg",
    count: 6,
  },
  {
    id: "bucket",
    name: "Bucket",
    description: "Estilo descontraído",
    fullDescription:
      "As bolsas Bucket trazem um charme descontraído e moderno. Com formato único e fechamento prático, são perfeitas para looks casuais e sofisticados.",
    image: "/images/bucket.jpg",
    count: 10,
  },
  {
    id: "satchel",
    name: "Satchel",
    description: "Clássica e atemporal",
    fullDescription:
      "As Satchels são símbolo de elegância clássica. Com estrutura definida e alças superiores, são perfeitas para mulheres que apreciam o estilo tradicional.",
    image: "/images/satchel.jpg",
    count: 9,
  },
  {
    id: "hobo",
    name: "Hobo",
    description: "Conforto e estilo",
    fullDescription:
      "As bolsas Hobo combinam conforto e estilo em um design fluido e relaxado. Ideais para quem busca uma bolsa espaçosa com visual contemporâneo.",
    image: "/images/hobo.jpg",
    count: 7,
  },

  {
    id: "modern",
    name: "Modern",
    description: "Estilo contemporâneo",
    fullDescription:
      "As bolsas Modern trazem um design inovador e funcionalidade. Perfeitas para quem busca estar na vanguarda da moda.",
    image: "/images/hero-3.jpg",
    count: 5,
  },

  {
    id: "outono",
    name: "Outono",
    description: "Elegância Atemporal",
    fullDescription: "A coleção Outono traz peças que combinam elegância e conforto, perfeitas para a temporada.",
    image: "/images/hero-1.jpg",
    count: 7,
  },

  {
    id: "classica",
    name: "Clássica",
    description: "Sofisticação em Cada Detalhe",
    fullDescription:
      "A linha Clássica é a personificação da sofisticação, com peças que destacam o artesanato italiano de excelência.",
    image: "/images/hero-2.jpg",
    count: 4,
  },
];

export const products: Record<string, Product[]> = {
  tote: [
    { id: 1, name: "Tote Caramelo Classic", price: 1890, color: "Caramelo" },
    { id: 2, name: "Tote Noir Essential", price: 2150, color: "Preto" },
    { id: 3, name: "Tote Crème de la Crème", price: 1990, color: "Creme" },
  ],
  crossbody: [
    { id: 1, name: "Crossbody Midnight", price: 1290, color: "Preto" },
    { id: 2, name: "Crossbody Gold Chain", price: 1590, color: "Nude" },
    { id: 3, name: "Crossbody Petite", price: 990, color: "Caramelo" },
  ],
  clutch: [
    { id: 1, name: "Clutch Soirée", price: 890, color: "Nude" },
    { id: 2, name: "Clutch Velvet Night", price: 1190, color: "Preto" },
    { id: 3, name: "Clutch Crystal", price: 1490, color: "Prata" },
  ],
  bucket: [
    { id: 1, name: "Bucket Drawstring", price: 1690, color: "Caramelo" },
    { id: 2, name: "Bucket Mini", price: 1290, color: "Preto" },
    { id: 3, name: "Bucket Suede", price: 1890, color: "Terracota" },
  ],
  satchel: [
    { id: 1, name: "Satchel Heritage", price: 2490, color: "Vinho" },
    { id: 2, name: "Satchel Doctor", price: 2290, color: "Preto" },
    { id: 3, name: "Satchel Cambridge", price: 2690, color: "Marrom" },
  ],
  hobo: [
    { id: 1, name: "Hobo Slouchy", price: 1590, color: "Verde Oliva" },
    { id: 2, name: "Hobo Crescent", price: 1790, color: "Preto" },
    { id: 3, name: "Hobo Soft", price: 1490, color: "Nude" },
  ],
  modern: [
    { id: 1, name: "Modern Geometric", price: 1990, color: "Preto" },
    { id: 2, name: "Modern Minimalist", price: 1790, color: "Branco" },
    { id: 3, name: "Modern Sculptural", price: 2190, color: "Cinza" },
  ],
  outono: [
    { id: 1, name: "Outono Trench", price: 2990, color: "Bege" },
    { id: 2, name: "Outono Cashmere", price: 3490, color: "Caramelo" },
    { id: 3, name: "Outono Leather", price: 3990, color: "Marrom" },
  ],
  classica: [
    { id: 1, name: "Clássica Heritage", price: 2490, color: "Vinho" },
    { id: 2, name: "Clássica Doctor", price: 2290, color: "Preto" },
    { id: 3, name: "Clássica Cambridge", price: 2690, color: "Marrom" },
  ],
};

export const slides: Slide[] = [
  {
    id: "outono",
    image: "/images/hero-1.jpg",
    title: "Coleção Outono",
    subtitle: "Elegância Atemporal",
    description: "Descubra peças que transcendem as estações",
    index: 1,
  },
  {
    id: "classica",
    image: "/images/hero-2.jpg",
    title: "Linha Clássica",
    subtitle: "Sofisticação em Cada Detalhe",
    description: "Artesanato italiano de excelência",
    index: 2,
  },
  {
    id: "modern",
    image: "/images/hero-3.jpg",
    title: "Nova Coleção",
    subtitle: "Minimalismo Refinado",
    description: "Design contemporâneo para mulheres modernas",
    index: 3,
  },
];

export function getModelById(id: string) {
  return models.find((model) => model.id === id);
}

export function getProductsByModel(modelId: string) {
  return products[modelId as keyof typeof products] || [];
}
