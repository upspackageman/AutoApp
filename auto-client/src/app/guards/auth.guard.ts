import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from '../_services/admin-auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const adminService = inject(AdminAuthService);
  const router = inject(Router);

  return adminService.currentUser$.pipe(
    map(user => {
      if (user) {
        // User is authenticated
        return true;
      } else {
        // User is not authenticated, redirect to login page
        router.navigate(['/adminlogin']);
        return false;
      }
    })
  );
};
