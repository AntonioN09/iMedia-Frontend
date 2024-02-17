import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { MessageService } from './message.service';
import { UserService } from '../user/user.service';

describe('MessageService', () => {
  let service: MessageService;
  let firestoreMock: jasmine.SpyObj<AngularFirestore>;
  let userServiceMock: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const firestoreSpy = jasmine.createSpyObj('AngularFirestore', ['collection', 'doc']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getFollowedUserEmails']);

    TestBed.configureTestingModule({
      providers: [
        MessageService,
        { provide: AngularFirestore, useValue: firestoreSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    });
    
    service = TestBed.inject(MessageService);
    firestoreMock = TestBed.inject(AngularFirestore) as jasmine.SpyObj<AngularFirestore>;
    userServiceMock = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getReceivedMessagesByUserEmail', () => {
    it('should call firestore collection with correct parameters', () => {
      const receiverEmail = 'test@example.com';
      const messages: any = [];
      const collectionSpy = jasmine.createSpyObj('AngularFirestoreCollection', ['valueChanges']);
      collectionSpy.valueChanges.and.returnValue(of(messages));
      firestoreMock.collection.and.returnValue(collectionSpy);

      service.getReceivedMessagesByUserEmail(receiverEmail).subscribe(result => {
        expect(result).toEqual(messages);
      });

      expect(firestoreMock.collection).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Function));
      expect(firestoreMock.collection('messages').valueChanges).toHaveBeenCalledWith({ idField: 'id' });
    });
  });
});
