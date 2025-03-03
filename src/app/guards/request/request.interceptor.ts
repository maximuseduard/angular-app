import packageJson from '../../../../package.json';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from '@services/token/token.service';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { InjectionToken, inject } from '@angular/core';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

const handleError = (
  toastr: ToastrService,
  err: { message: string | unknown } | string
) => {
  if (typeof err === 'string') {
    toast(toastr, err, 'error');

    return;
  }

  if (err?.['message']) {
    const message =
      typeof err['message'] === 'string'
        ? err['message']
        : 'SYSTEM.TOAST.UNKNOWN';

    toast(toastr, message, 'error');
  }
};

const handleUnauthorized = (
  tokenService: TokenService,
  toastr: ToastrService
) => {
  tokenService.deleteAuthToken();

  toast(toastr, 'Must be logged in', 'info');
};

const handleForbidden = (toastr: ToastrService, error: Error) => {
  if (error.message === 'Unauthorized') {
    toast(toastr, 'Invalid access', 'error');
  } else {
    handleError(toastr, error);
  }
};

const handleBlob = (toastr: ToastrService, error: Blob) => {
  const reader = new FileReader();

  reader.onload = () => {
    if (reader.result !== null) {
      const errorObject = JSON.parse(reader.result.toString());

      handleError(toastr, errorObject);
    }
  };

  reader.readAsText(error);
};

const toast = (
  toastr: ToastrService,
  message: string,
  type: 'success' | 'info' | 'warning' | 'error'
) => {
  toastr[type](message);
};

const handleRequest = (req: HttpRequest<unknown>) => {
  req = req.clone({
    setHeaders: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
      Version: packageJson?.version || '1.0',
      authorization: `Bearer ${inject(TokenService).getAuthToken()}`,
    },
    withCredentials: true,
  });

  return req;
};

export const requestInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const timeOutValue = Number(req.headers.get('timeout') || 0);

  const tokenService = inject(TokenService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  req = handleRequest(req);

  return next(req).pipe(
    timeout(timeOutValue),
    catchError((error: HttpErrorResponse) => {
      // Client side error
      if (error.error instanceof ErrorEvent) {
        handleError(toastr, error.error);

        return throwError(() => error);
      }

      // Server side error
      if (error.error instanceof ProgressEvent) {
        handleError(toastr, 'Server error');

        return throwError(() => error);
      }

      if (error.status === 503) {
        router.navigate(['/maintenance']);

        return throwError(() => error);
      }

      // Auth error
      if (error.status === 401 && !req.url.includes('/users/login')) {
        if (req.url.includes('/users/current')) {
          return throwError(() => error);
        }

        handleUnauthorized(tokenService, toastr);

        return throwError(() => error);
      }

      if (error.status === 403) {
        handleForbidden(toastr, error.error);

        return throwError(() => error);
      }

      // File error
      if (error.error instanceof Blob) {
        handleBlob(toastr, error.error);

        return throwError(() => error);
      }

      handleError(toastr, error.error);

      return throwError(() => error);
    })
  );
};
