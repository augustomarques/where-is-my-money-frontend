import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const isAuthRoute = this.isAuthRoute(route);

    if(!isLoggedIn && isAuthRoute) {
      return true;
    }

    if(isLoggedIn && !isAuthRoute) {
      return true;
    }

    if(isLoggedIn && isAuthRoute) {
      this.router.navigate(['']);
      return false;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }

  private isAuthRoute(route: ActivatedRouteSnapshot): boolean {
    return (
      route.url[0] && 
      route.url[0].path && 
      (route.url[0].path.match("login") || route.url[0].path.match("register"))
    ) ? true : false;
  }
}