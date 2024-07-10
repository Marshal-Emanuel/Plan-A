import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;

  onSubmit(loginForm: NgForm) {
    this.passwordMismatch = this.password !== this.confirmPassword;
    if (loginForm.valid && !this.passwordMismatch) {
      const formData = loginForm.value;
      console.log('Form Submitted!', formData);
    } else {
      console.log('Form is invalid');
      console.log('Form values:', loginForm.value);
      console.log('Form errors:', loginForm.errors);
      this.hideErrorMessage();
    }
  }

  hideErrorMessage() {
    setTimeout(() => {
      this.passwordMismatch = false;
    }, 3000);
  }
}
