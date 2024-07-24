import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:4400';

  constructor(private http: HttpClient) { }
  loginUser(loginData: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, loginData);
  }


  registerUser(userData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/register`, userData);
  }

  getUserDetails(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/getUser/${userId}`);
  }


  updateUserDetails(userId: string, userDetails: any): Observable<any> {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'token': ` ${token}`
    });

    return this.http.put(`${this.apiUrl}/user/updateUser/${userId}`, userDetails, { headers });
  }

  getUserBalance(userId: string, headers: HttpHeaders): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/balance/${userId}`, { headers });
  }

  topUpUserWallet(userId: string, amount: number, headers: HttpHeaders): Observable<any> {
    const requestData = { amount };
    return this.http.put(`${this.apiUrl}/user/topup/${userId}`, requestData, { headers });
  }


}
