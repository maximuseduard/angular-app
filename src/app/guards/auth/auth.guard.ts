import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { TokenService } from '@services/token/token.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { User } from '@interfaces/user/user';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private readonly _tokenService: TokenService,
    private readonly _router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    routeState: RouterStateSnapshot
  ): Observable<boolean> {
    return this._authGuardObservable(route, routeState);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    routeState: RouterStateSnapshot
  ): Observable<boolean> {
    return this._authGuardObservable(route, routeState);
  }

  private _authGuardObservable(
    route: ActivatedRouteSnapshot,
    routeState: RouterStateSnapshot
  ): Observable<boolean> {
    const localRoute: string = routeState.url.split('?')[0];
    const publicRoutes: string[] = ['/signup', '/login'];
    const isPublicRoute: boolean =
      publicRoutes.includes(localRoute) ||
      localRoute.startsWith('/login') ||
      localRoute.startsWith('/signup');

    const validSubject = new BehaviorSubject<boolean>(true);

    const token = this._tokenService.getAuthToken();

    if (!token) {
      validSubject.next(false);
    } else {
      const user: User = jwtDecode(token);

      if (user) {
        if (isPublicRoute) {
          this._router.navigate(['/orders']);

          validSubject.next(false);
        }
      } else if (!isPublicRoute) {
        this._router.navigate(['/login']);
        validSubject.next(false);
      }
    }

    return validSubject.asObservable();
  }
}
