import { Injectable } from '@angular/core';

const AUTH_TOKEN = 'authToken';

@Injectable({ providedIn: 'root' })
export class TokenService {
  getAuthToken(): string | null {
    return window.localStorage.getItem(AUTH_TOKEN);
  }

  setAuthToken(token: string): void {
    token && window.localStorage.setItem(AUTH_TOKEN, token);
  }

  deleteAuthToken(): void {
    window.localStorage.removeItem(AUTH_TOKEN);
  }
}
