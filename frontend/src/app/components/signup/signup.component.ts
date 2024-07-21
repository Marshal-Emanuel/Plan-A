import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { gsap } from 'gsap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private http: HttpClient) {}
  
  [x: string]: any;
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;

  ngOnInit() {
    this.loadSVG().then(() => {
      this.setupAnimations();
    });
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

    // Hide all frames initially
    frames.forEach((frame, index) => {
      gsap.set(frame, { display: 'none' });
    });

    // Function to show the next frame
    const showNextFrame = () => {
      gsap.set(frames[currentFrame], { display: 'none' });
      currentFrame = (currentFrame + 1) % frames.length;
      gsap.set(frames[currentFrame], { display: 'block' });
    };

    // Loop through the frames
    gsap.timeline({ repeat: -1 })
      .to({}, { duration: 0.1, onRepeat: showNextFrame });

    // Additional animations for form elements
    gsap.from('.input-group', {
      opacity: 0,
      y: 20,
      stagger: 0.2,
      ease: "power2.out"
    });

    // Animate logo
    gsap.from('.logo', {
      duration: 1,
      opacity: 0,
      y: -50,
      ease: "bounce.out",
      delay: 1
    });

    // Animate title
    gsap.from('.title', {
      duration: 1,
      opacity: 0,
      y: -20,
      ease: "power2.out",
      delay: 1.5
    });
  }

  onSubmit(signupForm: NgForm) {
    this.passwordMismatch = this.password !== this.confirmPassword;
    if (signupForm.valid && !this.passwordMismatch) {
      const formData = signupForm.value;
      console.log('Form Submitted!', formData);

      // Exit animation
      gsap.to('.container', {
        x: 100,
        opacity: 0,
        duration: 1,
        onComplete: () => {
          // Logic to move to next form/page
          console.log('Animation complete, navigate to next page');
        }
      });
    } else {
      console.log('Form is invalid');
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
