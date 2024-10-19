import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../models/logged-in-user';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export function rolesGuard(roles: Role[]): CanActivateFn {
  return  (route, state) => {

    const loggedInUser = inject(AuthService).loggedInUser

    if (loggedInUser && roles.includes(loggedInUser.userProfile.role)) {
      return true;
    }

    inject(Router).navigate(['/'])
    return true;
  };
  
}