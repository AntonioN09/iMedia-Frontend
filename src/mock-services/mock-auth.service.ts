import { of } from 'rxjs';

export class MockAuthService {
  user = of({ email: 'test@example.com', uid: '123' });

  login(email: string, password: string) {
    return Promise.resolve({
      user: { email: 'test@example.com', uid: '123' }
    });
  }
  
  register(email: string, password: string) {
    return Promise.resolve({
      user: { email: 'test@example.com', uid: '123' }
    });
  }

  signOut() {
    return Promise.resolve();
  }

  isAuthenticated() {
    return of(true);
  }

  getCurrentUserEmail() {
    return of('test@example.com');
  }

  getCurrentUserId() {
    return of('123');
  }

  getCurrentUsername() {
    return of('test');
  }
}