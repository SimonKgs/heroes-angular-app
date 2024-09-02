import { CanActivateFn, CanMatchFn, Route, UrlSegment } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';




export const authCanGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthentication().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        console.log('AUTH CAN GUARD AUTHENTICATED');
        console.log({route, state});
        
        return true;
      } else {
        router.navigate(['/auth/login']);
        console.log('AUTH CAN UNAUTHORIZED');
        return false;
      }
    })
  );
};


export const authMatchGuard: CanMatchFn = (route: Route, segments: UrlSegment[]): Observable<boolean> => {
    const authService = inject(AuthService);
    const router = inject(Router);
  
    return authService.checkAuthentication().pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          console.log('AUTH MATCH GUARD AUTHENTICATED');
          console.log({route, segments});

          return true;
        } else {
          router.navigate(['/auth/login']);
          console.log('AUTH MATCH UNAUTHORIZED');

          return false;
        }
      })
    );
  };