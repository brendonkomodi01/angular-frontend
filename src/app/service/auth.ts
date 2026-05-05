import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);
    return this.http.post(`${this.apiUrl}/register`, null, { params });
  }

  login(username: string, password: string): Observable<string> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);
    return this.http.post(`${this.apiUrl}/login`, null, { params, responseType: 'text' });
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
