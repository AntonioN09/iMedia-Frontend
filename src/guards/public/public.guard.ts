import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs/operators';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService:AuthService = inject(AuthService);
  const router: Router = inject(Router);
  
  return authService.isAuthenticated().pipe(take(1),
    map((isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        return true;
      } else {
        router.navigate(['/private/feed']);
        return false;
      }
    })
  );
};