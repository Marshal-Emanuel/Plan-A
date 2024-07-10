import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;

  onSubmit(signupForm: NgForm) {
    this.passwordMismatch = this.password !== this.confirmPassword;
    if (signupForm.valid && !this.passwordMismatch) {
      const formData = signupForm.value;
      console.log('Form Submitted!', formData);
    } else {
      console.log('Form is invalid');
      console.log('Form values:', signupForm.value);
      console.log('Form errors:', signupForm.errors);
      this.hideErrorMessage();
    }
  }

  hideErrorMessage() {
    setTimeout(() => {
      this.passwordMismatch = false;
      // Add logic to hide other error messages if needed
    }, 3000);
  }
}
