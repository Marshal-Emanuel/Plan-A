import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnInit, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../../Services/user.service';
import { gsap } from 'gsap';
import { HttpClient } from '@angular/common/http';
import { SuccessMessageComponent } from '../success-message/success-message.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { AuthServiceTsService } from '../../Services/auth.service.ts.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SuccessMessageComponent, ErrorMessageComponent, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  email: string = '';
  password: string = '';
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  responseMessage: string = '';

  constructor(
      private userService: UserService,
      @Inject(Router) private router: Router,
      private http: HttpClient,
      private authService: AuthServiceTsService
    ) {}

  ngOnInit(): void {
    this.loadSVG().then(() => {
      this.setupAnimations();
    });
  }

  ngAfterViewInit(): void {
    // Any additional initialization after view init
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

    frames.forEach((frame) => {
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

  onSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      this.userService.loginUser({ email: this.email, password: this.password }).subscribe(
        response => {
          console.log('Login response', response);
          this.responseMessage = response.message;
  
          if (response.responseCode === 200) {
            // Store token and role in local storage
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.role);
            console.log("token res:", response.token)

            // Get user details and store userId in local storage
            this.authService.getCheckDetails(response.token).subscribe(
              detailsResponse => {
                console.log("auth res", detailsResponse.info.userId)
                localStorage.setItem('userId', detailsResponse.info.userId);
                this.resetAndShowMessage(true);
                setTimeout(() => {
                  this.performExitAnimation();
                }, 2000);
              },
              error => {
                console.error('Error fetching user details', error);
                this.responseMessage = 'Login failed. Please try again.';
                this.resetAndShowMessage(false);
              }
            );
          } else {
            this.resetAndShowMessage(false);
          }
        },
        error => {
          console.error('Login failed', error);
          this.responseMessage = 'Login failed. Please try again.';
          this.resetAndShowMessage(false);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  performExitAnimation() {
    gsap.to('.container', {
      x: 100,
      opacity: 0,
      duration: 1,
      onComplete: () => {
        const role = localStorage.getItem('role');
        switch (role) {
          case 'admin':
            this.router.navigate(['/adashboard']);
            break;
          case 'manager':
            this.router.navigate(['/manager']);
            break;
          default:
            this.router.navigate(['/events']);
            break;
        }
      }
    });
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
