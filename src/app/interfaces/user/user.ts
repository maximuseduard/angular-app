import { Order } from '@interfaces/order/order';

export interface User {
  id: number;
  name: string;
  email: string;
  birthdate: string;

  // relations
  orders: Order[];
}
