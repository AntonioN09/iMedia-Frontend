import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Follow } from '../../models/follow.model';
import { Notification } from '../../models/notification.model';
import { User } from 'src/models/user.model';
import { CV } from 'src/models/cv.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  getUsersSortedByEmail(): Observable<User[]> {
    return this.firestore.collection<User>('users', ref => ref.orderBy('email')).valueChanges({ idField: 'id' });
  }

  followUser(userEmail: string | null, emailToFollow: string): Promise<void> {
    return this.firestore
      .collection('users', (ref) => ref.where('email', '==', emailToFollow))
      .get()
      .toPromise()
      .then((querySnapshot) => {
        if (!querySnapshot?.empty) {
          const userDoc = querySnapshot?.docs[0];
          const userId = userDoc?.id;
          return this.firestore
            .collection('followers')
            .doc(userId)
            .set({ user: userEmail, following: emailToFollow });
        } else {
          console.log(`User with email ${emailToFollow} not found`);
          return Promise.reject(`User with email ${emailToFollow} not found`);
        }
      });
  }

  getFollowedUserEmails(userEmail: string): Observable<string[]> {
    return this.firestore
      .collection<Follow>('followers', (ref) => ref.where('user', '==', userEmail))
      .get()
      .pipe(
        map((querySnapshot) => {
          const followedUserEmails: string[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data && data.following) {
              followedUserEmails.push(data.following);
            }
          });
          return followedUserEmails;
        })
      );
  }

  getUserById(userId: string | null): Observable<User | null> {
    return this.firestore
      .collection<User>('users', (ref) => ref.where('id', '==', userId))
      .valueChanges()
      .pipe(
        map((users) => {
          if (users.length > 0) {
            return users[0];
          } else {
            return null;
          }
        })
      );
  }

  getUserByEmail(userEmail: string | null): Observable<User | null> {
    return this.firestore
      .collection<User>('users', (ref) => ref.where('email', '==', userEmail))
      .valueChanges()
      .pipe(
        map((users) => {
          if (users.length > 0) {
            return users[0];
          } else {
            return null;
          }
        })
      );
  }

  getUserByIdSync(userId: string | null): User | null {
    if (!userId) {
      return null;
    }

    let user: User | null = null;
    this.firestore
      .collection<User>('users', (ref) => ref.where('id', '==', userId))
      .valueChanges()
      .pipe(
        map((users) => {
          if (users.length > 0) {
            user = users[0];
          }
        })
      )
      .subscribe();

    return user;
  }
  
  updateUser(user: User): Observable<void> {
    return this.firestore.collection('users').doc(user.id).get().pipe(
      switchMap((doc) => {
        if (doc.exists) {
          let usr = {
            bio: user.bio,
            avatar: user.avatar,
            age: user.age,
            occupation: user.occupation,
            personality: user.personality,
            technologies: user.technologies,
            goals: user.goals,
            frustrations: user.frustrations,
          }
          let usr2 = Object.fromEntries(Object.entries(usr).filter(([key, value]) => value !== null && value !== undefined && value !== ""));
          return this.firestore.collection('users').doc(user.id).update(usr2);
        } else {
          return Promise.reject('Document not found');
        }
      })
    );
  }

  updateCv(cv: CV): Observable<void> {
    return this.firestore.collection('cvs').doc(cv.id).get().pipe(
      switchMap((doc) => {
        if (doc.exists) {
          let cv1 = {
            name: cv.name,
            contact: cv.contact,
            summary: cv.summary,
            experience: cv.experience,
            education: cv.education,
            skills: cv.skills,
            languages: cv.languages
          }
          let cv2 = Object.fromEntries(Object.entries(cv1).filter(([key, value]) => value !== null && value !== undefined && value !== ""));
          return this.firestore.collection('cvs').doc(cv.id).update(cv2);
        } else {
          return Promise.reject('Document not found');
        }
      })
    );
  }

  notifyUser(sender: User | null, message: string, receiverEmail: string, receiverId: string): Promise<void> {
    this.incrementUnseenNotifications(receiverId).subscribe();
    
    const notification: Notification = {
      body: message,
      userId: sender?.id,
      userAvatar: sender?.avatar,
      senderEmail: sender?.email,
      receiverEmail: receiverEmail,
      createDate: new Date()
    }

    return this.firestore.collection('notifications').add(notification).then();
  }

  incrementUnseenNotifications(userId: string): Observable<any> {
    return this.firestore.collection('users').doc(userId).get().pipe(
      switchMap((doc) => {
        if (doc.exists) {
          const current = (doc.data() as User)?.unseenNotifications || 0;
          const updated = current + 1;
          return this.firestore.collection('users').doc(userId).update({
            unseenNotifications: updated,
          });
        } else {
          return Promise.reject('Document not found');
        }
      })
    );
  }

  resetUnseenNotifications(userId: string | null): Observable<any> {
    return this.firestore.collection('users').doc(userId!).get().pipe(
      switchMap((doc) => {
        if (doc.exists) {
          return this.firestore.collection('users').doc(userId!).update({
            unseenNotifications: 0,
          });
        } else {
          return Promise.reject('Document not found');
        }
      })
    );
  }

  removeUser(userId: string): Observable<void> {
    return from(this.firestore.doc(`users/${userId}`).delete()).pipe(
      catchError(error => {
        console.error('Error deleting user:', error);
        throw error;
      })
    );
  }

  isAdmin(): Observable<boolean | null | undefined> {
    return this.authService.getCurrentUserId().pipe(
      switchMap((userId) => {
        if (!userId) {
          return of(null);
        }
        return this.firestore.collection<User>('users', (ref) => ref.where('id', '==', userId)).valueChanges();
      }),
      map((users) => {
        if (users && users.length > 0) {
          return users[0].isAdmin;
        } else {
          return null;
        }
      })
    );
  }

  isMod(): Observable<boolean | null | undefined> {
    return this.authService.getCurrentUserId().pipe(
      switchMap((userId) => {
        if (!userId) {
          return of(null);
        }
        return this.firestore.collection<User>('users', (ref) => ref.where('id', '==', userId)).valueChanges();
      }),
      map((users) => {
        if (users && users.length > 0) {
          return users[0].isMod;
        } else {
          return null;
        }
      })
    );
  }
  
  setAdmin(user: User): Observable<void> {
    return this.firestore.collection('users').doc(user.id).get().pipe(
      switchMap((doc) => {
        if (doc.exists) {
          console.log(user);
          return this.firestore.collection('users').doc(user.id).update({
            isAdmin: !user.isAdmin
          });
        } else {
          return Promise.reject('Document not found');
        }
      })
    );
  }

  setMod(user: User): Observable<void> {
    return this.firestore.collection('users').doc(user.id).get().pipe(
      switchMap((doc) => {
        if (doc.exists) {
          console.log(user);
          return this.firestore.collection('users').doc(user.id).update({
            isMod: !user.isMod
          });
        } else {
          return Promise.reject('Document not found');
        }
      })
    );
  }

  getCvByUserId(userId: string | null): Observable<CV | null> {
    return this.firestore
      .collection<CV>('cvs', (ref) => ref.where('userId', '==', userId))
      .valueChanges()
      .pipe(
        map((cvs) => {
          if (cvs.length > 0) {
            return cvs[0];
          } else {
            return null;
          }
        })
      );
  }
}
