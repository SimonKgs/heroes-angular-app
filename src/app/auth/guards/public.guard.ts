import { CanActivateFn, CanMatchFn, Route, UrlSegment } from '@angular/router';
import { inject, Pipe } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


const checkAuthStatus = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthentication()
  .pipe(
    tap( isAuthenticated => {
      if (isAuthenticated) {        
        router.navigate(['./heroes/list']);
      }
    }),
    map( isAuthenticated => !isAuthenticated)
  )
}

export const publicCanGuard: CanActivateFn = (route, state) => {
  console.log('CAN GUARD');
  return checkAuthStatus()
  
};


export const publicMatchGuard: CanMatchFn = (route: Route, segments: UrlSegment[]): Observable<boolean> => {
  console.log('CAN MATCH');
  return checkAuthStatus()
};