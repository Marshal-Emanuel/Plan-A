import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { SuccessMessageComponent } from '../success-message/success-message.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink, SuccessMessageComponent, ErrorMessageComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  newPassword: string = '';
  token: string = '';
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  responseMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onResetPassword() {
    if (this.token && this.newPassword) {
      this.http.post('http://localhost:4400/user/reset-password', { token: this.token, newPassword: this.newPassword })
        .subscribe({
          next: (response: any) => {
            console.log('Success:', response); // Log success message
            this.responseMessage = 'Password reset successfully!';
            this.resetAndShowMessage(true);
            // Navigate to login page after success
            this.router.navigate(['/login']);
          },
          error: (error: any) => {
            console.error('Error:', error); // Log error message
            this.responseMessage = 'Failed to reset password. Please try again.';
            this.resetAndShowMessage(false);
          }
        });
    }
  }

  resetAndShowMessage(isSuccess: boolean) {
    // Reset both message flags
    this.showSuccessMessage = false;
    this.showErrorMessage = false;
  
    // Set a small timeout to ensure the DOM updates
    setTimeout(() => {
      if (isSuccess) {
        this.showSuccessMessage = true;
      } else {
        this.showErrorMessage = true;
      }
    }, 10);
  }
}
