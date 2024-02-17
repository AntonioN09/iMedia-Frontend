import { of } from 'rxjs';
import { User } from 'src/models/user.model';
import { Follow } from 'src/models/follow.model';
import { Notification } from 'src/models/notification.model';
import { CV } from 'src/models/cv.model';

export class MockUserService {
  private mockUsers: User[] = [
    { id: '1', email: 'user1@example.com' },
    { id: '2', email: 'user2@example.com' }
  ];

  private mockFollows: Follow[] = [
    { user: 'user1@example.com', following: 'user2@example.com' },
  ];

  private mockNotifications: Notification[] = [
    {id: '1', userId: '1', createDate: new Date()}
  ];

  private mockCVs: CV[] = [
    { userId: '1' }
  ];

  getUsersSortedByEmail() {
    return of(this.mockUsers.sort((a, b) => a.email.localeCompare(b.email)));
  }

  followUser(userEmail: string | null, emailToFollow: string) {
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

  getUserByEmail(userEmail: string | null) {
    const user = this.mockUsers.find(user => user.email === userEmail);
    return of(user || null);
  }

  getUserByIdSync(userId: string | null) {
    return this.mockUsers.find(user => user.id === userId) || null;
  }

  updateUser(user: User) {
    return of(undefined);
  }

  notifyUser(user: User | null, message: string, receiverEmail: string) {
    return Promise.resolve();
  }

  removeUser(userId: string) {
    return of(undefined);
  }

  isAdmin() {
    return of(false);
  }

  isMod() {
    return of(false);
  }

  setAdmin(user: User) {
    return of(undefined);
  }

  setMod(user: User) {
    return of(undefined);
  }

  getCvByUserId(userId: string | null) {
    const cv = this.mockCVs.find(cv => cv.userId === userId);
    return of(cv || null);
  }

  updateCv(cv: CV) {
    return of(undefined);
  }
}
