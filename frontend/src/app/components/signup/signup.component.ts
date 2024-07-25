
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { gsap } from 'gsap';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../Services/user.service';
import { User } from '../../interfaces/users';
import { SuccessMessageComponent } from '../success-message/success-message.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, SuccessMessageComponent, ErrorMessageComponent,RouterLink, NavbarComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private http: HttpClient, private userService: UserService, private router: Router
  ) { }

  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;
  isSubscribedToMails: boolean = false;
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  responseMessage: string = '';


  ngOnInit() {
    this.loadSVG().then(() => {
      this.setupAnimations();
    });
  }
  allPasswordRequirementsMet(): boolean {
    return this.hasMinLength() && this.hasUpperCase() && this.hasSpecialChar() && this.hasNumber();
  }


  loadSVG() {
    return this.http.get('assets/walking-character.svg', { responseType: 'text' })
      .toPromise()
      .then((svg: string | undefined) => {
        const walkingCharacter = document.getElementById('walkingCharacter');
        if (walkingCharacter && svg) {
          walkingCharacter.innerHTML = svg;
        }
      });
  }

  setupAnimations() {
    const frames = ['#frame1', '#frame2', '#frame3', '#frame4', '#frame5', '#frame6', '#frame7', '#frame8'];
    let currentFrame = 0;

    frames.forEach((frame, index) => {
      gsap.set(frame, { display: 'none' });
    });

    const showNextFrame = () => {
      gsap.set(frames[currentFrame], { display: 'none' });
      currentFrame = (currentFrame + 1) % frames.length;
      gsap.set(frames[currentFrame], { display: 'block' });
    };

    gsap.timeline({ repeat: -1 })
      .to({}, { duration: 0.1, onRepeat: showNextFrame });

    gsap.from('.input-group', {
      opacity: 0,
      y: 20,
      stagger: 0.2,
      ease: "power2.out"
    });

    gsap.from('.logo', {
      duration: 1,
      opacity: 0,
      y: -50,
      ease: "bounce.out",
      delay: 1
    });

    gsap.from('.title', {
      duration: 1,
      opacity: 0,
      y: -20,
      ease: "power2.out",
      delay: 1.5
    });
  }

  onSubmit(signupForm: NgForm) {
    if (signupForm.valid && !this.passwordMismatch) {
      const userData: User = {
        name: this.name,
        email: this.email,
        phoneNumber: this.phone,
        password: this.password,
        isSubscribedToMails: this.isSubscribedToMails
      };
  
      this.userService.registerUser(userData).subscribe(
        response => {
          console.log('User registration response', response);
          this.responseMessage = response.message;
  
          if (response.responseCode === 201) {
            this.resetAndShowMessage(true);
            setTimeout(() => {
              this.performExitAnimation();
            }, 2000);
          } else {
            this.resetAndShowMessage(false);
          }
        },
        error => {
          console.error('Registration failed', error);
          this.responseMessage = 'Registration failed. Please try again.';
          this.resetAndShowMessage(false);
        }
      );
    } else {
      console.log('Form is invalid');
      this.hideErrorMessage();
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
  
    // Hide the message after 4 seconds
    
  }
  

  
  


  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.password);
  }

  hasSpecialChar(): boolean {
    return /[!@#$&*]/.test(this.password);
  }

  hasNumber(): boolean {
    return /[0-9]/.test(this.password);
  }

  hasMinLength(): boolean {
    return this.password.length >= 8;
  }
  passwordTouched: boolean = false;


  performExitAnimation() {
    gsap.to('.container', {
      x: 100,
      opacity: 0,
      duration: 1,
      onComplete: () => {
        console.log('Animation complete, navigate to next page');
        this.router.navigate(['/login']);
      }
    });
  }

  hideErrorMessage() {
    setTimeout(() => {
      this.passwordMismatch = false;
    }, 3000);
  }
}
