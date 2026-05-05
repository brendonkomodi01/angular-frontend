import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  private apiUrl = 'http://localhost:8080/api/trade';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getAllActiveOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  createOffer(userCardId: number, price: number): Observable<any> {
    const params = new HttpParams()
      .set('userCardId', userCardId)
      .set('price', price);
    return this.http.post<any>(`${this.apiUrl}/create`, null, { headers: this.getHeaders(), params });
  }

  buyOffer(offerId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/buy/${offerId}`, null, { headers: this.getHeaders() });
  }
}
