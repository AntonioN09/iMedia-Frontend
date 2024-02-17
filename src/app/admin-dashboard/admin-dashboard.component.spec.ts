import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/user/user.service';
import { of } from 'rxjs';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let authServiceMock: Partial<AuthService>;
  let userServiceMock: Partial<UserService>;

  beforeEach(async () => {
    authServiceMock = {
      getCurrentUserEmail: jasmine.createSpy().and.returnValue(of('test@example.com')),
      getCurrentUserId: jasmine.createSpy().and.returnValue(of('testUserId'))
    };

    userServiceMock = {
      getUsersSortedByEmail: jasmine.createSpy().and.returnValue(of([])),
      getUserById: jasmine.createSpy().and.returnValue(of(null)),
      notifyUser: jasmine.createSpy().and.returnValue(Promise.resolve()),
      removeUser: jasmine.createSpy().and.returnValue(of(null)),
      setAdmin: jasmine.createSpy().and.returnValue(of(null)),
      setMod: jasmine.createSpy().and.returnValue(of(null))
    };

    await TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentUserEmail', () => {
    expect(component.currentUserEmail).toEqual('test@example.com');
  });

  it('should initialize users', () => {
    expect(component.users).toBeTruthy();
    expect(userServiceMock.getUsersSortedByEmail).toHaveBeenCalled();
  });

  it('should initialize userId and userData', () => {
    expect(component.userId).toEqual('testUserId');
    expect(userServiceMock.getUserById).toHaveBeenCalledWith('testUserId');
  });

  it('should toggle editing state', () => {
    const user = { editing: false };
    component.toggleWarn(user);
    expect(user.editing).toBe(true);
    component.toggleWarn(user);
    expect(user.editing).toBe(false);
  });

  it('should call notifyUser when warning a user', () => {
    const user = { email: 'test@example.com' };
    spyOnProperty(component.userForm, 'valid', 'get').and.returnValue(true);
    component.warnUser(user);
    expect(userServiceMock.notifyUser).toHaveBeenCalledOnceWith(null, jasmine.any(String), 'test@example.com');
  });

  it('should not call notifyUser if userForm is invalid', () => {
    spyOnProperty(component.userForm, 'valid', 'get').and.returnValue(false);
    component.warnUser({});
    expect(userServiceMock.notifyUser).not.toHaveBeenCalled();
  });

  it('should call removeUser', () => {
    component.removeUser('testUserId');
    expect(userServiceMock.removeUser).toHaveBeenCalledWith('testUserId');
  });

  it('should call setAdmin', () => {
    component.setAdmin({});
    expect(userServiceMock.setAdmin).toHaveBeenCalled();
  });

  it('should call setMod', () => {
    component.setMod({});
    expect(userServiceMock.setMod).toHaveBeenCalled();
  });
});
