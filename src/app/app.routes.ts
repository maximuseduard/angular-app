import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from '@pages/errors/not-found/not-found.component';
import { MaintenanceComponent } from '@pages/errors/maintenance/maintenance.component';
import { ProfileComponent } from '@pages/profile/profile.component';
import { SignupComponent } from '@pages/signup/signup.component';
import { OrderListComponent } from '@pages/orders/order-list/order-list.component';
import { OrderFormComponent } from '@pages/orders/order-form/order-form.component';
import { ProductFormComponent } from '@pages/products/product-form/product-form.component';
import { ProductListComponent } from '@pages/products/product-list/product-list.component';
import { PageLayoutComponent } from './layout/page-layout/page-layout.component';
import { SidebarLayoutComponent } from './layout/sidebar-layout/sidebar-layout.component';
import { AuthGuard } from '@guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PageLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
      {
        path: '404',
        component: NotFoundComponent,
      },
      {
        path: 'maintenance',
        component: MaintenanceComponent,
      },
    ],
  },
  {
    path: '',
    component: SidebarLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'orders',
        component: OrderListComponent,
      },
      {
        path: 'orders/new',
        component: OrderFormComponent,
      },
      {
        path: 'orders/:id',
        component: OrderFormComponent,
      },
      {
        path: 'products',
        component: ProductListComponent,
      },
      {
        path: 'products/new',
        component: ProductFormComponent,
      },
      {
        path: 'products/:id',
        component: ProductFormComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
