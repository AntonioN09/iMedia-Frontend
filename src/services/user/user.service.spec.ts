import { TestBed } from '@angular/core/testing';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let firestoreMock: jasmine.SpyObj<AngularFirestore>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let collectionMock: jasmine.SpyObj<AngularFirestoreCollection>;

  beforeEach(() => {
    const firestoreSpy = jasmine.createSpyObj('AngularFirestore', ['collection']);
    const collectionSpy = jasmine.createSpyObj('AngularFirestoreCollection', ['valueChanges']);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AngularFirestore, useValue: firestoreSpy },
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['getCurrentUserId']) }
      ]
    });
    
    service = TestBed.inject(UserService);
    firestoreMock = TestBed.inject(AngularFirestore) as jasmine.SpyObj<AngularFirestore>;
    authServiceMock = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    collectionMock = collectionSpy as jasmine.SpyObj<AngularFirestoreCollection>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsersSortedByEmail', () => {
    it('should call firestore collection with correct parameters', () => {
      collectionMock.valueChanges.and.returnValue(of([]));
      firestoreMock.collection.and.returnValue(collectionMock);

      service.getUsersSortedByEmail().subscribe(users => {
        expect(users).toEqual([]);
      });

      expect(firestoreMock.collection).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Function));
    });
  });

  describe('getUserById', () => {
    it('should call firestore collection with correct parameters', () => {
      const userId = 'exampleUserId';
      const userData = { id: userId };
      collectionMock.valueChanges.and.returnValue(of([userData]));
      firestoreMock.collection.and.returnValue(collectionMock);

      service.getUserById(userId).subscribe(user => {
        expect(user?.id).toEqual(userData.id);
      });

      expect(firestoreMock.collection).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Function));
      expect(collectionMock.valueChanges).toHaveBeenCalled();
    });
  });  
});
