import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { requestInterceptor } from '@guards/request/request.interceptor';
import { RequestDestroyHook } from '@services/request-destroy-hook/request-destroy-hook.service';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([requestInterceptor])),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideToastr(),
    RequestDestroyHook,
  ],
};
