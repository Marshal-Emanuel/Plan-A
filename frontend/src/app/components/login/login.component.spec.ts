import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { UserService } from '../../Services/user.service';
import { AuthServiceTsService } from '../../Services/auth.service.ts.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: UserService;
  let authService: AuthServiceTsService;
  let router: Router;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule,
        LoginComponent
      ],
      providers: [
        UserService,
        AuthServiceTsService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthServiceTsService);
    router = TestBed.inject(Router);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should handle successful login', waitForAsync(() => {
    spyOn(userService, 'loginUser').and.returnValue(of({
      responseCode: 200,
      message: 'Login successful',
      token: 'dummyToken',
      role: 'user'
    }));
    spyOn(authService, 'getCheckDetails').and.returnValue(of({
      info: { userId: '123' }
    }));
    spyOn(localStorage, 'setItem');
    spyOn(component, 'performExitAnimation');
    spyOn(component, 'resetAndShowMessage');

    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    component.email = 'test@example.com';
    component.password = 'password';
    form.dispatchEvent(new Event('submit'));

    fixture.whenStable().then(() => {
      expect(userService.loginUser).toHaveBeenCalled();
      expect(authService.getCheckDetails).toHaveBeenCalledWith('dummyToken');
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'dummyToken');
      expect(localStorage.setItem).toHaveBeenCalledWith('role', 'user');
      expect(localStorage.setItem).toHaveBeenCalledWith('userId', '123');
      expect(component.performExitAnimation).toHaveBeenCalled();
      expect(component.resetAndShowMessage).toHaveBeenCalledWith(true);
    });
  }));

  it('should handle failed login', waitForAsync(() => {
    spyOn(userService, 'loginUser').and.returnValue(throwError({ error: { message: 'Login failed' } }));
    spyOn(component, 'resetAndShowMessage');

    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    component.email = 'test@example.com';
    component.password = 'wrongpassword';
    form.dispatchEvent(new Event('submit'));

    fixture.whenStable().then(() => {
      expect(userService.loginUser).toHaveBeenCalled();
      expect(component.resetAndShowMessage).toHaveBeenCalledWith(false);
      expect(component.responseMessage).toBe('Login failed. Please try again.');
    });
  }));

  it('should handle successful user details fetch after login', waitForAsync(() => {
    spyOn(userService, 'loginUser').and.returnValue(of({
      responseCode: 200,
      message: 'Login successful',
      token: 'dummyToken',
      role: 'user'
    }));
    spyOn(authService, 'getCheckDetails').and.returnValue(of({
      info: { userId: '123' }
    }));
    spyOn(localStorage, 'setItem');
    spyOn(component, 'performExitAnimation');
    spyOn(component, 'resetAndShowMessage');

    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    component.email = 'test@example.com';
    component.password = 'password';
    form.dispatchEvent(new Event('submit'));

    fixture.whenStable().then(() => {
      expect(authService.getCheckDetails).toHaveBeenCalledWith('dummyToken');
      expect(localStorage.setItem).toHaveBeenCalledWith('userId', '123');
      expect(component.performExitAnimation).toHaveBeenCalled();
      expect(component.resetAndShowMessage).toHaveBeenCalledWith(true);
    });
  }));

  it('should handle error in fetching user details after login', waitForAsync(() => {
    spyOn(userService, 'loginUser').and.returnValue(of({
      responseCode: 200,
      message: 'Login successful',
      token: 'dummyToken',
      role: 'user'
    }));
    spyOn(authService, 'getCheckDetails').and.returnValue(throwError({ error: { message: 'Error fetching user details' } }));
    spyOn(component, 'resetAndShowMessage');

    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    component.email = 'test@example.com';
    component.password = 'password';
    form.dispatchEvent(new Event('submit'));

    fixture.whenStable().then(() => {
      expect(authService.getCheckDetails).toHaveBeenCalledWith('dummyToken');
      expect(component.responseMessage).toBe('Login failed. Please try again.');
      expect(component.resetAndShowMessage).toHaveBeenCalledWith(false);
    });
  }));
});
