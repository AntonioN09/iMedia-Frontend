import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { adminGuard } from './admin.guard';
import { PostService } from 'src/services/post/post.service';
import { AuthService } from 'src/services/auth/auth.service';
import { UserService } from 'src/services/user/user.service';
import { MockPostService } from 'src/mock-services/mock-post.service';
import { MockAuthService } from 'src/mock-services/mock-auth.service';
import { MockUserService } from 'src/mock-services/mock-user.service';

describe('adminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
            { provide: PostService, useClass: MockPostService },
            { provide: AuthService, useClass: MockAuthService },
            { provide: UserService, useClass: MockUserService },
        ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

