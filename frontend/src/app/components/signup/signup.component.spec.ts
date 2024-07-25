import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SignupComponent } from './signup.component';
import { SuccessMessageComponent } from '../success-message/success-message.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../../Services/user.service';
import { of, throwError } from 'rxjs';
import { gsap } from 'gsap';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['registerUser']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        SuccessMessageComponent,
        ErrorMessageComponent,
        NavbarComponent,
        SignupComponent
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });




  it('should handle form submission with valid data', () => {
    userService.registerUser.and.returnValue(of({ responseCode: 201, message: 'Success' }));

    const signupForm = { valid: true } as NgForm;
    component.name = 'John Doe';
    component.email = 'john.doe@example.com';
    component.phone = '1234567890';
    component.password = 'Password123!';
    component.confirmPassword = 'Password123!';
    component.passwordMismatch = false;

    component.onSubmit(signupForm);

    expect(userService.registerUser).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      password: 'Password123!',
      isSubscribedToMails: false
    });
   
  });





  it('should reset and show the success message', (done) => {
    component.resetAndShowMessage(true);

    setTimeout(() => {
      expect(component.showSuccessMessage).toBeTrue();
      expect(component.showErrorMessage).toBeFalse();
      done();
    }, 10);
  });

  it('should reset and show the error message', (done) => {
    component.resetAndShowMessage(false);

    setTimeout(() => {
      expect(component.showSuccessMessage).toBeFalse();
      expect(component.showErrorMessage).toBeTrue();
      done();
    }, 10);
  });

  it('should validate password requirements correctly', () => {
    component.password = 'Password123!';

    expect(component.hasUpperCase()).toBeTrue();
    expect(component.hasSpecialChar()).toBeTrue();
    expect(component.hasNumber()).toBeTrue();
    expect(component.hasMinLength()).toBeTrue();
  });
});
