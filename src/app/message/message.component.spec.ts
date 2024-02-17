import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageComponent } from './message.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { MessageService } from '../../services/message/message.service';
import { UserService } from 'src/services/user/user.service';
import { of } from 'rxjs';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let authServiceMock: Partial<AuthService>;
  let messageServiceMock: Partial<MessageService>;
  let userServiceMock: Partial<UserService>;
  let activatedRouteMock: Partial<ActivatedRoute>;

  beforeEach(async () => {
    authServiceMock = {
      getCurrentUserId: jasmine.createSpy().and.returnValue(of('testUserId')),
      getCurrentUserEmail: jasmine.createSpy().and.returnValue(of('current@example.com'))
    };

    messageServiceMock = {
      addMessage: jasmine.createSpy().and.returnValue(Promise.resolve()),
      incrementNumberOfUnseenMessages: jasmine.createSpy().and.returnValue(of(undefined)),
      incrementUnseenMessagesOfUser: jasmine.createSpy().and.returnValue(of(undefined))
    };

    userServiceMock = {
      getUserById: jasmine.createSpy().and.returnValue(of(null)),
      getUserByEmail: jasmine.createSpy().and.returnValue(of(null))
    };

    activatedRouteMock = {
      params: of({ receiverEmail: 'test@example.com', chat: { id: 'chatId' } })
    };

    await TestBed.configureTestingModule({
      declarations: [MessageComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentUserEmail', () => {
    expect(component.currentUserEmail).toEqual('current@example.com');
  });

  it('should initialize currentUserId and userData', () => {
    expect(component.currentUserId).toEqual('testUserId');
    expect(userServiceMock.getUserById).toHaveBeenCalledWith('testUserId');
  });

  it('should not submit message if form is invalid', async () => {
    spyOnProperty(component.messageForm, 'valid', 'get').and.returnValue(false);
    await component.onSubmit();
    expect(messageServiceMock.addMessage).not.toHaveBeenCalled();
    expect(messageServiceMock.incrementNumberOfUnseenMessages).not.toHaveBeenCalled();
    expect(userServiceMock.getUserByEmail).not.toHaveBeenCalled();
    expect(messageServiceMock.incrementUnseenMessagesOfUser).not.toHaveBeenCalled();
  });
});
