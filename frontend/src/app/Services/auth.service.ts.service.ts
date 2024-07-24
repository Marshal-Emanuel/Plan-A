import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceTsService {

  constructor(private http: HttpClient) { }

  getCheckDetails(token: string): Observable<any> {
    return this.http.get<any>('http://localhost:4400/auth/checkDetails', { headers: { 'token': token } });
  }
}
