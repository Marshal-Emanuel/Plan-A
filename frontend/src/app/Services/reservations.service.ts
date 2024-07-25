import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  
  private apiUrl = 'http://localhost:4400/reservation';

  constructor(private http: HttpClient) { }
  createReservation(reservation: any, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/createReservation`, reservation, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }


  //get reservations for one user
  getReservationsForUser(userId: string, token: string): Observable<any> {
    const url = `${this.apiUrl}/getReservationsForUser/${userId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
    return this.http.get(url, { headers });
  }


  //get all reservations
  getAllReservations(token: string): Observable<any> {
    const url = `${this.apiUrl}/getAllReservations`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
    return this.http.get(url, { headers });
  }

  //get total paid amount for all events
  getTotalPaidAmountForAllEvents(token: string): Observable<any> {
    const url = `${this.apiUrl}/getTotalPaidAmountForAllEvents`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('token', token);
    return this.http.get(url, { headers });
  }

}
