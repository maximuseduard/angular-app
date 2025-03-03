import { Product } from '@interfaces/product/product';

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;

  // relations
  product: Product;
}
