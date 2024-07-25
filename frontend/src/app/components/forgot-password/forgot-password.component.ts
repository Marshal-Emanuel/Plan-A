import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { SuccessMessageComponent } from '../success-message/success-message.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink, ErrorMessageComponent, SuccessMessageComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  responseMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onForgotPassword() {
    if (this.email) {
      this.http.post('http://localhost:4400/user/forgot-password', { email: this.email })
        .subscribe({
          next: (response: any) => {
            console.log('Success:', response); // Log success message
            this.responseMessage = 'Password reset link sent successfully!';
            this.resetAndShowMessage(true);
            // Navigate to reset password page or another page after success
            this.router.navigate(['/reset']);
          },
          error: (error: any) => {
            console.error('Error:', error); // Log error message
            this.responseMessage = 'Failed to send password reset link. Please try again.';
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
