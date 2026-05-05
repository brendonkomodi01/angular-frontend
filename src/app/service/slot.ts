import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SlotService {

  private apiUrl = 'http://localhost:8080/api/slot';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  spin(bet: number, stickyWilds: {row: number, col: number}[] = []): Observable<any> {
    const params = new HttpParams().set('bet', bet);
    return this.http.post<any>(`${this.apiUrl}/spin`, stickyWilds, { headers: this.getHeaders(), params });
  }
}
