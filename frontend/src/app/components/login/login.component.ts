import { CommonModule } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements AfterViewInit {

 constructor() {}

 ngAfterViewInit(): void {
  const script = document.createElement('script');
  script.src = 'https://static-bundles.visme.co/forms/vismeforms-embed.js';
  script.async = true;
  document.body.appendChild(script);

  window.addEventListener('message', this.handleMessage.bind(this), false);
}
ngOnDestroy(): void {
  // Clean up event listener when component is destroyed
  window.removeEventListener('message', this.handleMessage.bind(this), false);
}

handleMessage(event: MessageEvent): void {
  // Ensure the message is from the expected source
  if (event.origin !== 'https://my.visme.co') {
    console.log('Form Data:', event.data);
    return;
    console.log('Form Data:', event.data);
  }


  const formData = event.data;
  console.log('Form Data:', formData);

  // Forward data to your backend
  this.submitFormData(formData);
}
submitFormData(data: any): void {
  // Implement this method to send data to your backend
  // Example:
  // this.formSubmissionService.submitForm(data).subscribe(response => {
  //   console.log('Data submitted successfully', response);
  // }, error => {
  //   console.error('Error submitting data', error);
  // });
}


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
