export interface MyImage {
  id: string;
  sourceUrl: string;
  srcSet: string;
  title: string;
  uri: string;
  type: ImageType;
}

export interface GalleryImage {
  id: string;
  mediaItemUrl: string;
  title: string;
  altText: string;
  type: ImageType;
}

export interface ProductObject {
  averageRating: number;
  id: string;
  name: string;
  productId: number;
  slug: string;
  type: ProductType;
  description?: string;
  price?: string;
  regularPrice?: string;
  image?: MyImage;
  galleryImages?: GalleryImage[];
  externalUrl?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  image?: MyImage;
}

export interface CartObject {
  cartItems: CartItemObject[];
  total: string;
  subtotal: string;
  shippingTotal: string;
  discountTotal: string;
  productCount: number;
  shippingMethods: ShippingMethod[];
}

export interface CartItemObject {
  product: ProductObject;
  quantity: number;
  total: string;
  key: string;
  type: string;
}

export interface ShippingMethod {
  id: string;
  cost: string;
  label: string;
  methodId: string;
}

export interface PaymentMethod {
  description: string;
  icon: null;
  id: string;
  title: string;
}

export enum ProductType {
  ExternalProduct = 'ExternalProduct',
  GroupProduct = 'GroupProduct',
  SimpleProduct = 'SimpleProduct',
  VariableProduct = 'VariableProduct'
}

export enum ImageType {
  MediaItem = 'MediaItem'
}

export enum CategoryType {
  ProductCategory = 'ProductCategory'
}
