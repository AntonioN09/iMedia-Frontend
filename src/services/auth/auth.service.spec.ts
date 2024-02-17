import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import firebase from 'firebase/compat/app';

describe('AuthService', () => {
  let service: AuthService;
  let afAuthMock: jasmine.SpyObj<AngularFireAuth>;
  let firestoreMock: jasmine.SpyObj<AngularFirestore>;

  beforeEach(() => {
    const afAuthSpy = jasmine.createSpyObj('AngularFireAuth', ['signInWithEmailAndPassword', 'createUserWithEmailAndPassword', 'signOut']);
    const firestoreSpy = jasmine.createSpyObj('AngularFirestore', ['collection', 'doc']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useValue: afAuthSpy },
        { provide: AngularFirestore, useValue: firestoreSpy }
      ]
    });
    
    service = TestBed.inject(AuthService);
    afAuthMock = TestBed.inject(AngularFireAuth) as jasmine.SpyObj<AngularFireAuth>;
    firestoreMock = TestBed.inject(AngularFirestore) as jasmine.SpyObj<AngularFirestore>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should call signInWithEmailAndPassword', async () => {
      afAuthMock.signInWithEmailAndPassword.and.returnValue(Promise.resolve({} as firebase.auth.UserCredential));

      await service.login('test@example.com', 'password');

      expect(afAuthMock.signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password');
    });
  });

  describe('register', () => {
    it('should call createUserWithEmailAndPassword and set user and cv documents in firestore', async () => {
      const userCredential = { user: { uid: '123' } } as firebase.auth.UserCredential;
      afAuthMock.createUserWithEmailAndPassword.and.returnValue(Promise.resolve(userCredential));

      const docMock: any = jasmine.createSpyObj('docMock', ['set']);
      const collectionMock: any = jasmine.createSpyObj('collectionMock', ['doc']);
      collectionMock.doc.and.returnValue(docMock);
      firestoreMock.collection.and.returnValue(collectionMock);

      await service.register('test@example.com', 'password');

      expect(afAuthMock.createUserWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password');
      expect(firestoreMock.collection).toHaveBeenCalledWith(jasmine.any(String));
      expect(collectionMock.doc).toHaveBeenCalledWith('123');
      expect(firestoreMock.collection).toHaveBeenCalledWith(jasmine.any(String));
      expect(collectionMock.doc).toHaveBeenCalledWith('123');
    });
  });
});
