import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuccessMessageComponent } from './../success-message/success-message.component';
import { ErrorMessageComponent } from './../error-message/error-message.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        SuccessMessageComponent,
        ErrorMessageComponent,
        ProfileComponent // Import the standalone component here
      ],
      providers: [ FormBuilder, UserService ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with user details', () => {
    const mockUserDetails = {
      name: 'John Doe',
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
      password: 'password123',
      profilePicture: 'data:image/jpeg;base64,...',
      isSubscribedToMails: true
    };

    spyOn(localStorage, 'getItem').and.returnValue('mockUserId');
    spyOn(userService, 'getUserDetails').and.returnValue(of(mockUserDetails));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.profileForm.value).toEqual(mockUserDetails);
    expect(component.previewImage).toBe(mockUserDetails.profilePicture);
  });

  it('should handle valid form submission', (done) => {
    spyOn(component, 'uploadImageToCloudinary').and.returnValue(Promise.resolve('http://example.com/image.jpg'));
    spyOn(userService, 'updateUserDetails').and.returnValue(of({}));

    component.profileForm.setValue({
      name: 'John Doe',
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
      password: 'password123',
      profilePicture: 'file-data',
      isSubscribedToMails: true
    });

    component.onSubmit();
    fixture.detectChanges();

    setTimeout(() => {
      expect(component.isLoading).toBeFalse();
      expect(component.responseMessage).toBe('Profile updated successfully.');
      done();
    }, 1600); // Wait a bit longer to account for the setTimeout in the component
  });




  it('should handle image upload failure', async () => {
    spyOn(component, 'uploadImageToCloudinary').and.returnValue(Promise.reject('Upload failed'));

    component.profileForm.setValue({
      name: 'John Doe',
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
      password: 'password123',
      profilePicture: new File([''], 'filename.png'),
      isSubscribedToMails: true
    });

    await component.onSubmit();
    fixture.detectChanges();

    expect(component.responseMessage).toBe('Failed to upload image. Please try again.');
  });


});
