import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FollowComponent } from './follow.component';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';

describe('FollowComponent', () => {
  let component: FollowComponent;
  let fixture: ComponentFixture<FollowComponent>;

  const authServiceMock = {
    getCurrentUserEmail: (): Observable<String | null> => of('user@example.com'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FollowComponent],
      imports: [
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
      ],
      providers: [AuthService, UserService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });  

  it('should have user email null, when user not authenticated', () => {
    spyOn(authServiceMock, 'getCurrentUserEmail').and.returnValue(of(null));
    component.ngOnInit();
    expect(component.userEmail == null).toBeTruthy();
  });
});
