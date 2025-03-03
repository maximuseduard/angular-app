import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { User } from '@interfaces/user/user';
import { Observable } from 'rxjs';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly _http: HttpClient) {}

  login(email: string, password: string): Observable<{ accessToken: string }> {
    return this._http.post(`${API_URL}/auth/login`, {
      email,
      password,
    }) as Observable<{ accessToken: string }>;
  }

  create(body: User): Observable<User> {
    return this._http.post(`${API_URL}/users`, body) as Observable<User>;
  }

  find(): Observable<User[]> {
    return this._http.get(`${API_URL}/users`) as Observable<User[]>;
  }

  findOne(idUser: number): Observable<User[]> {
    return this._http.get(`${API_URL}/users/${idUser}`) as Observable<User[]>;
  }

  update(idUser: number, body: Partial<User>): Observable<User> {
    return this._http.put(
      `${API_URL}/users/${idUser}`,
      body
    ) as Observable<User>;
  }

  delete(idUser: number): Observable<User> {
    return this._http.delete(`${API_URL}/users/${idUser}`) as Observable<User>;
  }
}
