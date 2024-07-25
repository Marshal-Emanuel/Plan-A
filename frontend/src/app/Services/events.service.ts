import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EventsService {
    private apiUrl = 'http://localhost:4400';

    constructor(private http: HttpClient) { }


    //get all events
    getAllEvents(headers: HttpHeaders): Observable<any> {
        return this.http.get(`${this.apiUrl}/event/getEvents`, { headers });
      }

    getEvents(): Observable<any> {
        return this.http.get(`${this.apiUrl}/event/getEvents`);
    }

    

    getEventDetails(eventId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/event/getEvent/${eventId}`);
    }

    createEvent(eventDetails: any): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(`${this.apiUrl}/event/createEvent`, eventDetails, { headers });
    }



    deleteEvent(eventId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        return this.http.delete(`${this.apiUrl}/event/deleteEvent/${eventId}`, { headers });
    }

    totalRSVPsManager(userId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
        console.log('userId:', userId);
        console.log('token:', token);

        return this.http.get(`${this.apiUrl}/event/totalRSVPsManager/${userId}`, { headers });
    }


    getManagerEventCount(managerId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(`${this.apiUrl}/event/managerEventCount/${managerId}`, { headers });
    }

    getSumOfPaidAmmountManager(managerId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(`${this.apiUrl}/reservation/getSumOfPaidAmountManager/${managerId}`, { headers });
    }


    getEventsByManagerId(managerId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(`${this.apiUrl}/event/managerEvents/${managerId}`, { headers });
    }

//get event by event id

getEventById(eventId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/event/getEvent/${eventId}`);
  }



//get people attending an event
getPeopleAttending(eventId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/event/getPeopleAttending/${eventId}`);
}

// cancel an event
cancelEvent(eventId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.put(`${this.apiUrl}/event/cancelEvent/${eventId}`, null, { headers });
  }

// update event
updateEvent(eventId: string, eventDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });
    
    return this.http.put(`${this.apiUrl}/event/updateEvent/${eventId}`, eventDetails, { headers });
}

//get events
getActiveEvents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/event/getActiveEvents`);
}


//get events pending approval
getPendingEvents(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/event/getPendingEvents`, { headers });
}


// get pending events
getPendingVerification(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/user/pendingUsers`, { headers });
}




}
