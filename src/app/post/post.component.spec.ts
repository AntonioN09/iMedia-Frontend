import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostComponent } from './post.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AuthService } from '../../services/auth/auth.service';
import { PostService } from '../../services/post/post.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from '../app-routing.module';
import { Observable, of } from 'rxjs';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;

  const authServiceMock = {
    getCurrentUserEmail: (): Observable<String | null> => of('user@example.com'),
    getCurrentUserId: (): Observable<String | null> => of('user123'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostComponent],
      imports: [
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        BrowserAnimationsModule,
        MatSlideToggleModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        AppRoutingModule,
      ],
      providers: [AuthService, PostService],
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostComponent]
    });
    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have user id null, when user not authenticated', () => {
    spyOn(authServiceMock, 'getCurrentUserId').and.returnValue(of(null));
    component.ngOnInit();
    expect(component.currentUserId == null).toBeTruthy();
  });
  // integration testing
  it('should have user email null, when user not authenticated', () => {
    spyOn(authServiceMock, 'getCurrentUserId').and.returnValue(of(null));
    component.ngOnInit();
    expect(component.currentUserEmail == null).toBeTruthy();
  });
});
