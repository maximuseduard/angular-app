import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '@services/token/token.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SystemAccessGuard {
  constructor(
    private readonly _router: Router,
    private readonly _tokenService: TokenService
  ) {}

  canActivate(): Observable<boolean> {
    const validSubject = new BehaviorSubject<boolean>(true);

    const token: string | null = this._tokenService.getAuthToken();

    if (!token) {
      this._router.navigate(['/']);
    }

    validSubject.next(!!token);

    return validSubject.asObservable();
  }
}
