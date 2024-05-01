import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../api/usuario';


@Injectable({
 providedIn: 'root'
})
export class AuthService {
  
  private readonly API = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) { }

  getJwtToken(): any {
    return localStorage.getItem('accessToken');
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API}/authenticate`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
      }));
  }

  register(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${this.API}/register`, usuario);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>(`${this.API}/refresh-token`, { refreshToken })
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
      }));
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  isLoggedIn(): boolean {
    const token = this.getJwtToken();
    return !!token;
  }
}
