import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';
import { AuthService } from '../../services/auth/auth.service';
import { MessageService } from '../../services/message/message.service';
import { UserService } from '../../services/user/user.service';
import { of } from 'rxjs';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let authServiceMock: Partial<AuthService>;
  let messageServiceMock: Partial<MessageService>;
  let userServiceMock: Partial<UserService>;

  beforeEach(async () => {
    authServiceMock = {
      getCurrentUserEmail: jasmine.createSpy().and.returnValue(of('test@example.com')),
      getCurrentUserId: jasmine.createSpy().and.returnValue(of('testUserId'))
    };

    messageServiceMock = {
      getReceivedNotificationsByUserEmail: jasmine.createSpy().and.returnValue(of([]))
    };

    userServiceMock = {
      getUserById: jasmine.createSpy().and.returnValue(of(null)),
      resetUnseenNotifications: jasmine.createSpy().and.returnValue(of(undefined))
    };

    await TestBed.configureTestingModule({
      declarations: [NotificationComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize notifications', () => {
    expect(component.notifications).toBeTruthy();
    expect(messageServiceMock.getReceivedNotificationsByUserEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should initialize userId and userData', () => {
    expect(component.userId).toEqual('testUserId');
    expect(userServiceMock.getUserById).toHaveBeenCalledWith('testUserId');
    expect(userServiceMock.resetUnseenNotifications).toHaveBeenCalledWith('testUserId');
  });
});
