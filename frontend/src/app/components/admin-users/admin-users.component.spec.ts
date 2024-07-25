import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUsersComponent } from './admin-users.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { SuccessMessageComponent } from '../success-message/success-message.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { of } from 'rxjs';

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        AdminUsersComponent,
        SuccessMessageComponent,
        ErrorMessageComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all users on init', () => {
    const mockUsers = [
      { userId: '1', name: 'User 1', phoneNumber: '1234567890', email: 'user1@example.com', role: 'user', accountStatus: 'active', profilePicture: null, wallet: 100 },
      { userId: '2', name: 'User 2', phoneNumber: '0987654321', email: 'user2@example.com', role: 'admin', accountStatus: 'active', profilePicture: null, wallet: 200 }
    ];

    fixture.detectChanges(); // This will trigger ngOnInit

    const req = httpMock.expectOne('http://localhost:4400/user/allUsers');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    expect(component.allUsers).toEqual(mockUsers);
    expect(component.filteredUsers).toEqual(mockUsers);
  });

  it('should filter users', () => {
    component.allUsers = [
      { userId: '1', name: 'User 1', phoneNumber: '1234567890', email: 'user1@example.com', role: 'user', accountStatus: 'active', profilePicture: null, wallet: 100 },
      { userId: '2', name: 'User 2', phoneNumber: '0987654321', email: 'user2@example.com', role: 'admin', accountStatus: 'disabled', profilePicture: null, wallet: 200 }
    ];

    component.filterStatus = 'active';
    component.filterUsers();
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('User 1');

    component.filterStatus = 'all';
    component.filterUsers();
    expect(component.filteredUsers.length).toBe(2);
  });

  it('should get pending users', () => {
    const mockPendingUsers = {
      users: [
        { userId: '3', name: 'User 3', phoneNumber: '1112223333', email: 'user3@example.com', role: 'user', accountStatus: 'pending', profilePicture: null, wallet: 0 }
      ]
    };

    component.filterStatus = 'pending';
    component.filterUsers();

    const req = httpMock.expectOne('http://localhost:4400/user/pendingUsers');
    expect(req.request.method).toBe('GET');
    req.flush(mockPendingUsers);

    expect(component.filteredUsers).toEqual(mockPendingUsers.users);
  });




  it('should reset and show success message', (done) => {
    component.resetAndShowMessage(true);

    expect(component.showSuccessMessage).toBe(false);
    expect(component.showErrorMessage).toBe(false);

    setTimeout(() => {
      expect(component.showSuccessMessage).toBe(true);
      expect(component.showErrorMessage).toBe(false);

      setTimeout(() => {
        expect(component.showSuccessMessage).toBe(false);
        expect(component.showErrorMessage).toBe(false);
        done();
      }, 4000);
    }, 10);
  });

  it('should reset and show error message', (done) => {
    component.resetAndShowMessage(false);

    expect(component.showSuccessMessage).toBe(false);
    expect(component.showErrorMessage).toBe(false);

    setTimeout(() => {
      expect(component.showSuccessMessage).toBe(false);
      expect(component.showErrorMessage).toBe(true);

      setTimeout(() => {
        expect(component.showSuccessMessage).toBe(false);
        expect(component.showErrorMessage).toBe(false);
        done();
      }, 4000);
    }, 10);
  });
});