import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { PostService } from './post.service';
import { UserService } from '../user/user.service';

describe('PostService', () => {
  let service: PostService;
  let firestoreMock: jasmine.SpyObj<AngularFirestore>;
  let userServiceMock: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const firestoreSpy = jasmine.createSpyObj('AngularFirestore', ['collection']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getFollowedUserEmails']);

    TestBed.configureTestingModule({
      providers: [
        PostService,
        { provide: AngularFirestore, useValue: firestoreSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    });
    
    service = TestBed.inject(PostService);
    firestoreMock = TestBed.inject(AngularFirestore) as jasmine.SpyObj<AngularFirestore>;
    userServiceMock = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPostById', () => {
    it('should call firestore collection with correct parameters', () => {
      const postId = 'examplePostId';
      const post = { id: postId, /* mock post data */ };
      const docSpy: jasmine.SpyObj<any> = jasmine.createSpyObj('DocumentReference', ['valueChanges']);
      docSpy.valueChanges.and.returnValue(of(post));
      const collectionSpy = jasmine.createSpyObj('AngularFirestoreCollection', ['doc']);
      collectionSpy.doc.and.returnValue(docSpy);
      firestoreMock.collection.and.returnValue(collectionSpy);

      service.getPostById(postId).subscribe(result => {
        expect(result).toEqual(post);
      });

      expect(firestoreMock.collection).toHaveBeenCalledWith(jasmine.any(String));
      expect(collectionSpy.doc).toHaveBeenCalledWith(postId);
    });
  });
});
