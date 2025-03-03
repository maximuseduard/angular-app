import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Product } from '@interfaces/product/product';
import { Observable } from 'rxjs';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private readonly _http: HttpClient) {}

  create(body: Product): Observable<Product> {
    return this._http.post(`${API_URL}/products`, body) as Observable<Product>;
  }

  find(): Observable<Product[]> {
    return this._http.get(`${API_URL}/products`) as Observable<Product[]>;
  }

  findOne(idProduct: number): Observable<Product[]> {
    return this._http.get(`${API_URL}/products/${idProduct}`) as Observable<
      Product[]
    >;
  }

  update(idProduct: number, body: Partial<Product>): Observable<Product> {
    return this._http.put(
      `${API_URL}/products/${idProduct}`,
      body
    ) as Observable<Product>;
  }

  delete(idProduct: number): Observable<Product> {
    return this._http.delete(
      `${API_URL}/products/${idProduct}`
    ) as Observable<Product>;
  }
}
