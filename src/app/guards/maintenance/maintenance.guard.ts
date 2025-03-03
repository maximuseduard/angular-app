import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MaintenanceGuard {
  // ! WARNING: changing this variable to "true" will block the app
  platformUnderMaintenance = false;

  constructor(private readonly _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    routeState: RouterStateSnapshot
  ): Observable<boolean> {
    const localRoute = routeState.url.split('?')[0];
    const isMaintenanceRoute: boolean = localRoute === '/maintenance';

    const validSubject = new BehaviorSubject<boolean>(true);

    if (this.platformUnderMaintenance) {
      if (!isMaintenanceRoute) {
        this._router.navigate(['/maintenance']);
      }
      validSubject.next(isMaintenanceRoute);
    } else {
      if (isMaintenanceRoute) {
        this._router.navigate(['/']);
      }
      validSubject.next(true);
    }

    return validSubject.asObservable();
  }
}
