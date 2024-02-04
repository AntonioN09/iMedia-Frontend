import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankComponent } from './rank.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { PostService } from '../../services/post/post.service';
import { Post } from 'src/models/post.model';
import { Observable, of } from 'rxjs';

describe('RankComponent', () => {
  let component: RankComponent;
  let fixture: ComponentFixture<RankComponent>;

  const postServiceMock = {
    getPostsSortedByLikes: (): Observable<Post[]> => of({} as Post[]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RankComponent],
      imports: [
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
      ],
      providers: [PostService],
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RankComponent]
    });
    fixture = TestBed.createComponent(RankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have posts empty, if user has no posts', () => {
    spyOn(postServiceMock, 'getPostsSortedByLikes').and.returnValue(of({} as Post[]));
    component.ngOnInit();
    expect(component.posts.length == 0).toBeTruthy();
  });
});
