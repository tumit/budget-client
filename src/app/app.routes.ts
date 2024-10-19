// app.routes.ts
import { Routes } from '@angular/router';
import { loggedInGuard } from './auth/guards/logged-in.guard';
import { DemoComponent } from './demo/demo.component';

export const routes: Routes = [
  { path: 'demo', component: DemoComponent },
  {
    path: 'budget',
    loadChildren: () => import('./budget/budget.routes'),
    canActivate: [loggedInGuard]
  },
  { path: 'auth', loadChildren: () => import('./auth/auth.routes') }
];
