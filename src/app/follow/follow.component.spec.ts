import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FollowComponent } from './follow.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { MessageService } from '../../services/message/message.service';
import { of } from 'rxjs';

describe('FollowComponent', () => {
  let component: FollowComponent;
  let fixture: ComponentFixture<FollowComponent>;
  let authServiceMock: Partial<AuthService>;
  let userServiceMock: Partial<UserService>;
  let messageServiceMock: Partial<MessageService>;

  beforeEach(async () => {
    authServiceMock = {
      getCurrentUserEmail: jasmine.createSpy().and.returnValue(of('test@example.com')),
      getCurrentUserId: jasmine.createSpy().and.returnValue(of('testUserId')),
    };

    userServiceMock = {
      getUserById: jasmine.createSpy().and.returnValue(of(null)),
      getUserByEmail: jasmine.createSpy().and.returnValue(of(null)),
      followUser: jasmine.createSpy().and.returnValue(Promise.resolve()),
    };

    messageServiceMock = {
      getChatByUserEmails: jasmine.createSpy().and.returnValue(of(null)),
      createChat: jasmine.createSpy().and.returnValue(Promise.resolve()),
    };

    await TestBed.configureTestingModule({
      declarations: [FollowComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize userEmail and userData', () => {
    expect(component.userEmail).toEqual('test@example.com');
    expect(component.userData).toBeNull();
    expect(userServiceMock.getUserById).toHaveBeenCalledWith('testUserId');
  });
});
