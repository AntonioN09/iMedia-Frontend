import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;
  let firestoreMock: jasmine.SpyObj<AngularFirestore>;

  beforeEach(() => {
    const firestoreSpy = jasmine.createSpyObj('AngularFirestore', ['collection', 'doc']);
    
    TestBed.configureTestingModule({
      providers: [
        CommentService,
        { provide: AngularFirestore, useValue: firestoreSpy }
      ]
    });
    
    service = TestBed.inject(CommentService);
    firestoreMock = TestBed.inject(AngularFirestore) as jasmine.SpyObj<AngularFirestore>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCommentsByPostId', () => {
    it('should call firestore collection with correct parameters', () => {
      const postId = 'examplePostId';
      const comments: any = [];
      const collectionSpy = jasmine.createSpyObj('AngularFirestoreCollection', ['valueChanges']);
      collectionSpy.valueChanges.and.returnValue(of(comments));
      firestoreMock.collection.and.returnValue(collectionSpy);

      service.getCommentsByPostId(postId).subscribe(result => {
        expect(result).toEqual(comments);
      });

      expect(firestoreMock.collection).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Function));
      expect(firestoreMock.collection('comments').valueChanges).toHaveBeenCalledWith({ idField: 'id' });
    });
  });
});
