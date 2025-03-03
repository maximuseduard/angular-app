import { ProductDetail } from './product-detail';
import { ProductImage } from './product-image';

export interface Product {
  id: number;
  name: string;

  // relations
  details: ProductDetail[];
  images: ProductImage[];
}
