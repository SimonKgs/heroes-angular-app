import { CanActivateFn, CanMatchFn, Route, UrlSegment } from '@angular/router';
import { inject, Pipe } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


const checkAuthStatus = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthentication()
  .pipe(
    tap( isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/auth/login']);
      }
    })
  )
}

export const authCanGuard: CanActivateFn = (route, state) => {
  console.log('PUBLIC CAN GUARD');
  return checkAuthStatus()
  
};


export const authMatchGuard: CanMatchFn = (route: Route, segments: UrlSegment[]): Observable<boolean> => {
  console.log('PUBLIC CAN MATCH');
  return checkAuthStatus()
};