import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private apiUrl = 'http://localhost:8080/api/inventory';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getInventory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  collectCoins(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/collect`, null, { headers: this.getHeaders() });
  }

  claimDailyCoins(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/daily`, null, { headers: this.getHeaders() });
  }
  getBalance(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/balance`, { headers: this.getHeaders() });
  }

  updateBalance(amount: number): Observable<any> {
    const params = new HttpParams().set('amount', amount);
    return this.http.post(`${this.apiUrl}/balance`, null, { headers: this.getHeaders(), params });
  }

  sellCard(userCardId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sell/${userCardId}`, null, { headers: this.getHeaders() });
  }
}
