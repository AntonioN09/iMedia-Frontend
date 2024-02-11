import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service'
import { inject } from '@angular/core';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService: UserService = inject(UserService);
  const router: Router = inject(Router);

  return userService.isAdmin().pipe(take(1),
    map((isAuthenticated: boolean | null | undefined) => {
      if (isAuthenticated) {
        return true;
      } else {
        router.navigate(['/public/login']);
        return false;
      }
    })
  );
};
