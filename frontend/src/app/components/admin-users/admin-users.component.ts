import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SuccessMessageComponent } from '../success-message/success-message.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { FormsModule } from '@angular/forms';

interface User {
  userId: string;
  name: string;
  phoneNumber: string;
  email: string;
  role: string;
  accountStatus: string;
  profilePicture: string | null;
  wallet: number;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, SuccessMessageComponent, ErrorMessageComponent],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  responseMessage: string = '';
  filterStatus: string = 'all';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<User[]>('http://localhost:4400/user/allUsers', { headers }).subscribe(
      (response) => {
        this.allUsers = response;
        this.filteredUsers = this.allUsers;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  filterUsers(): void {
    if (this.filterStatus === 'all') {
      this.filteredUsers = this.allUsers;
    } else if (this.filterStatus === 'pending') {
      this.getPendingUsers();
    } else {
      this.filteredUsers = this.allUsers.filter(user => user.accountStatus === this.filterStatus);
    }
  }

  getPendingUsers(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('http://localhost:4400/user/pendingUsers', { headers }).subscribe(
      (response) => {
        this.filteredUsers = response.users;
      },
      (error) => {
        console.error('Error fetching pending users:', error);
      }
    );
  }

  disableUser(userId: string): void {
    this.updateUserStatus(userId, 'disableUser');
  }

  enableUser(userId: string): void {
    this.updateUserStatus(userId, 'enableUser');
  }

  verifyAccount(userId: string): void {
    this.updateUserStatus(userId, 'approveRequest');
  }

  private updateUserStatus(userId: string, endpoint: string): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put<any>(`http://localhost:4400/user/${endpoint}/${userId}`, {}, { headers }).subscribe(
      (response) => {
        this.responseMessage = response.message;
        if (response.responseCode === 200) {
          this.resetAndShowMessage(true);
          this.getAllUsers(); // Refresh the user list
        } else {
          this.resetAndShowMessage(false);
        }
      },
      (error) => {
        console.error(`Error updating user status:`, error);
        this.responseMessage = 'Error updating user status. Please try again.';
        this.resetAndShowMessage(false);
      }
    );
  }

  resetAndShowMessage(isSuccess: boolean) {
    this.showSuccessMessage = false;
    this.showErrorMessage = false;

    setTimeout(() => {
      if (isSuccess) {
        this.showSuccessMessage = true;
      } else {
        this.showErrorMessage = true;
      }
    }, 10);

    setTimeout(() => {
      this.showSuccessMessage = false;
      this.showErrorMessage = false;
    }, 4000);
  }
}