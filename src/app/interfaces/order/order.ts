import { OrderItem } from './order-item';

export enum OrderStatus {
  IN_PROCESSING = 'in_processing',
  PROCESSED = 'processed',
  CANCELED = 'canceled',
}

export interface Order {
  id: number;
  total: number;
  status: OrderStatus;

  // relations
  orderItems: OrderItem[];
}
