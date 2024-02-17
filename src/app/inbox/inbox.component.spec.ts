import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InboxComponent } from './inbox.component';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { MessageService } from '../../services/message/message.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('InboxComponent', () => {
  let component: InboxComponent;
  let fixture: ComponentFixture<InboxComponent>;
  let authServiceMock: Partial<AuthService>;
  let userServiceMock: Partial<UserService>;
  let messageServiceMock: Partial<MessageService>;

  beforeEach(async () => {
    authServiceMock = {
      getCurrentUserId: jasmine.createSpy().and.returnValue(of('testUserId')),
      getCurrentUserEmail: jasmine.createSpy().and.returnValue(of('test@example.com')),
    };

    userServiceMock = {
      getUserById: jasmine.createSpy().and.returnValue(of(null)),
    };

    messageServiceMock = {
      resetUnseenMessagesOfUser: jasmine.createSpy().and.returnValue(Promise.resolve()),
      getChatsSortedByLatestMessage: jasmine.createSpy().and.returnValue(of([])),
      getChatMessagesByUserEmail: jasmine.createSpy().and.returnValue(of([])),
      updateSeenStatusOfMessages: jasmine.createSpy().and.returnValue(of(undefined)),
      updateChat: jasmine.createSpy().and.returnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      declarations: [InboxComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize userId and userData', () => {
    expect(component.userId).toEqual('testUserId');
    expect(userServiceMock.getUserById).toHaveBeenCalledWith('testUserId');
  });

  it('should initialize currentUserEmail', () => {
    expect(component.currentUserEmail).toEqual('test@example.com');
  });

  it('should reset unseen messages of user', () => {
    expect(messageServiceMock.resetUnseenMessagesOfUser).toHaveBeenCalledWith('testUserId');
  });

  it('should set receiver email and update chat on selecting a chat', () => {
    const receiverEmail = 'receiver@example.com';
    const chat = { id: 'chatId', userEmail1: 'test@example.com', lastSeen2: new Date(), userEmails: [] };
    component.setReceiverEmail(receiverEmail, chat);
    expect(component.receiverEmail).toEqual(receiverEmail);
    expect(component.currentChat).toEqual(chat);
    expect(messageServiceMock.updateSeenStatusOfMessages).toHaveBeenCalledWith(receiverEmail, 'chatId');
    expect(messageServiceMock.updateChat).toHaveBeenCalledWith(chat, receiverEmail, undefined);
  });
});
