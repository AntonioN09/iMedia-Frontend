import { of } from 'rxjs';
import { User } from 'src/models/user.model';
import { Follow } from 'src/models/follow.model';
import { Notification } from 'src/models/notification.model';
import { CV } from 'src/models/cv.model';
import { Timestamp } from '@firebase/firestore';
export class MockUserService {
  // Simulated users data
  private mockUsers: User[] = [
    { id: '1', email: 'test@example.com',},
    { id: '2', email: 'user2@example.com', /* other properties */ },
    // ... more users
  ];

  // Simulated follows data
  private mockFollows: Follow[] = [
    { user: 'user1@example.com', following: 'user2@example.com' },
    // ... more follows
  ];

  // Simulated notifications data
  private mockNotifications: Notification[] = [];

  // Simulated CVs data
  private mockCVs: CV[] = [
    { userId: '1', /* other properties */ },
    // ... more CVs
  ];

  getUsersSortedByEmail() {
    return of(this.mockUsers.sort((a, b) => a.email.localeCompare(b.email)));
  }

  followUser(userEmail: string | null, emailToFollow: string) {
    // Add mock follow logic
    // ...

    return Promise.resolve();
  }

  getFollowedUserEmails(userEmail: string) {
    const followedUserEmails = this.mockFollows
      .filter(follow => follow.user === userEmail)
      .map(follow => follow.following);
    return of(followedUserEmails);
  }

  getUserById(userId: string | null) {
    const user = this.mockUsers.find(user => user.id === userId);
    return of(user || null);
  }

  getUserByIdSync(userId: string | null) {
    // Sync methods in mock might just return data directly
    return this.mockUsers.find(user => user.id === userId) || null;
  }

  updateUser(user: User) {
    // Update mock user logic
    // ...

    return of(undefined);
  }

  notifyUser(user: User | null, message: string, receiverEmail: string) {
    // Add to mock notifications
    // ...

    return Promise.resolve();
  }

  removeUser(userId: string) {
    // Remove mock user logic
    // ...

    return of(undefined);
  }

  isAdmin() {
    // Simulate admin check logic
    // ...

    return of(false);
  }

  isMod() {
    // Simulate mod check logic
    // ...

    return of(false);
  }

  setAdmin(user: User) {
    // Update mock admin status
    // ...

    return of(undefined);
  }

  setMod(user: User) {
    // Update mock mod status
    // ...

    return of(undefined);
  }

  getCvByUserId(userId: string | null) {
    const cv = this.mockCVs.find(cv => cv.userId === userId);
    return of(cv || null);
  }

  updateCv(cv: CV) {
    // Update mock CV logic
    // ...

    return of(undefined);
  }
}
