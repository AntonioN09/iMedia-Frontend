import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModDashboardComponent } from './mod-dashboard.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/user/user.service';
import { PostService } from '../../services/post/post.service';
import { of } from 'rxjs';

describe('ModDashboardComponent', () => {
  let component: ModDashboardComponent;
  let fixture: ComponentFixture<ModDashboardComponent>;
  let userServiceMock: Partial<UserService>;
  let authServiceMock: Partial<AuthService>;
  let postServiceMock: Partial<PostService>;

  beforeEach(async () => {
    userServiceMock = {
      getUserById: jasmine.createSpy().and.returnValue(of(null)),
      notifyUser: jasmine.createSpy().and.returnValue(of(undefined)),
      followUser: jasmine.createSpy().and.returnValue(Promise.resolve())
    };

    authServiceMock = {
      getCurrentUserEmail: jasmine.createSpy().and.returnValue(of('test@example.com')),
      getCurrentUserId: jasmine.createSpy().and.returnValue(of('testUserId'))
    };

    postServiceMock = {
      editPost: jasmine.createSpy().and.returnValue(of(undefined)),
      likePost: jasmine.createSpy().and.returnValue(of(undefined)),
      getPostsSortedByTime: jasmine.createSpy().and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      declarations: [ModDashboardComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: PostService, useValue: postServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentUserEmail', () => {
    expect(component.currentUserEmail).toEqual('test@example.com');
    expect(authServiceMock.getCurrentUserEmail).toHaveBeenCalled();
  });

  it('should initialize posts', () => {
    expect(component.posts).toBeTruthy();
    expect(postServiceMock.getPostsSortedByTime).toHaveBeenCalled();
  });

  it('should initialize userId and userData', () => {
    expect(component.userId).toEqual('testUserId');
    expect(userServiceMock.getUserById).toHaveBeenCalledWith('testUserId');
  });

  it('should toggle editing state', () => {
    const post = { editing: false };
    component.toggleEdit(post);
    expect(post.editing).toBe(true);
    component.toggleEdit(post);
    expect(post.editing).toBe(false);
  });
});
