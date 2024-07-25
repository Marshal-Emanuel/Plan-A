import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../Services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorMessageComponent } from './../error-message/error-message.component';
import { SuccessMessageComponent } from './../success-message/success-message.component';
import { HttpHandler } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    SuccessMessageComponent,
    ErrorMessageComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  previewImage: string | ArrayBuffer | null = null;
  isLoading: boolean = true;
  userId: string | null = '';
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  responseMessage: string = '';

  constructor(
    @Inject(FormBuilder) private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      profilePicture: [''],
      isSubscribedToMails: [false],
    });
  }

  ngOnInit(): void {
    this.userId = localStorage
      .getItem('userId')
      ?.replace(/"/g, '') ?? '';
    this.getUserDetails();
  }

  getUserDetails() {
    this.userService
      .getUserDetails(this.userId ?? '')
      .subscribe((response: any) => {
        console.log('User details fetched:', response);
        this.profileForm.patchValue(response);
        this.previewImage = response.profilePicture;
      });
  }

  async onSubmit(): Promise<void> {
    console.log('Form submission triggered');
    if (this.profileForm.valid) {
      this.isLoading = true;
      console.log('Form is valid, updating user profile...');

      if (this.profileForm.get('profilePicture')?.value) {
        try {
          const imageUrl = await this.uploadImageToCloudinary(
            this.profileForm.get('profilePicture')?.value
          );
          this.profileForm.patchValue({ profilePicture: imageUrl });
        } catch (error) {
          console.error('Failed to upload image to Cloudinary', error);
          this.responseMessage =
            'Failed to upload image. Please try again.';
          this.resetAndShowMessage(false);
          this.isLoading = false;
          return;
        }
      }

      setTimeout(() => {
        console.log('Profile form data:', this.profileForm.value);
        this.userService
          .updateUserDetails(this.userId ?? '', this.profileForm.value)
          .subscribe(
            (response: any) => {
              console.log('Update response:', response);
              this.responseMessage =
                'Profile updated successfully.';
              this.resetAndShowMessage(true);
              this.isLoading = false;
            },
            (error) => {
              console.error('Failed to update profile', error);
              this.responseMessage =
                'Failed to update profile. Please try again.';
              this.resetAndShowMessage(false);
              this.isLoading = false;
            }
          );
      }, 1500);
    } else {
      console.log('Form is invalid');
      this.responseMessage =
        'Form is invalid. Please check the fields and try again.';
      this.resetAndShowMessage(false);
    }
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
        this.profileForm.patchValue({
          profilePicture: e.target.result, // Update the form control with the file data
        });
      };
      reader.readAsDataURL(file);
    }
  }

  async uploadImageToCloudinary(
      file: File
  ): Promise<string> {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'shoppie'); // Your Cloudinary preset
      formData.append('cloud_name', 'dr0qq0taf'); // Your Cloudinary preset

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dr0qq0taf/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
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


  setAccountPending(): void {
    const userId = localStorage.getItem('userId')?.replace(/"/g, '') ?? '';
    const token = localStorage.getItem('token') ?? '';

    const headers = new Headers({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    // private apiUrl = 'http://localhost:4400';
    fetch(`http://localhost:4400/user/managerRequest/${userId}`, {

      method: 'PUT',
      headers: headers,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to set account pending');
      }
      return response.json();
    })
    .then(data => {
      console.log('Account pending request response:', data);
      this.responseMessage = 'Account upgrade request sent.';
      this.resetAndShowMessage(true);
    })
    .catch(error => {
      console.error('Failed to set account pending', error);
      this.responseMessage = 'Failed to send request. Please try again.';
      this.resetAndShowMessage(false);
    });
}
}
