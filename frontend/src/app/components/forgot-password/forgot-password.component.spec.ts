import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: any;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ForgotPasswordComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should reset and show error message', (done) => {
    component.resetAndShowMessage(false);
    expect(component.showSuccessMessage).toBeFalse();
    expect(component.showErrorMessage).toBeFalse();

    setTimeout(() => {
      expect(component.showSuccessMessage).toBeFalse();
      expect(component.showErrorMessage).toBeTrue();
      done();
    }, 10);
  });

  it('should reset and show success message', (done) => {
    component.resetAndShowMessage(true);
    expect(component.showSuccessMessage).toBeFalse();
    expect(component.showErrorMessage).toBeFalse();

    setTimeout(() => {
      expect(component.showSuccessMessage).toBeTrue();
      expect(component.showErrorMessage).toBeFalse();
      done();
    }, 10);
  });




  it('should not submit form if email is empty', () => {
    component.email = '';
    component.onForgotPassword();

    httpMock.expectNone('http://localhost:4400/user/forgot-password');
  });
});