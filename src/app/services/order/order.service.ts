import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Order } from '@interfaces/order/order';
import { Observable } from 'rxjs';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private readonly _http: HttpClient) {}

  create(body: Order): Observable<Order> {
    return this._http.post(`${API_URL}/orders`, body) as Observable<Order>;
  }

  find(): Observable<Order[]> {
    return this._http.get(`${API_URL}/orders`) as Observable<Order[]>;
  }

  findOne(idOrder: number): Observable<Order[]> {
    return this._http.get(`${API_URL}/orders/${idOrder}`) as Observable<
      Order[]
    >;
  }

  update(idOrder: number, body: Partial<Order>): Observable<Order> {
    return this._http.put(
      `${API_URL}/orders/${idOrder}`,
      body
    ) as Observable<Order>;
  }

  delete(idOrder: number): Observable<Order> {
    return this._http.delete(
      `${API_URL}/orders/${idOrder}`
    ) as Observable<Order>;
  }
}
