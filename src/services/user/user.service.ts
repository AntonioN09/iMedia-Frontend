import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Follow } from '../../models/follow.model'
import { User } from 'src/models/user.model';
import { CV } from 'src/models/cv.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: AngularFirestore) {}

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
          console.log(user);
          return this.firestore.collection('users').doc(user.id).update({
            bio: user.bio,
            avatar: user.avatar,
            age: user.age,
            occupation: user.occupation,
            personality: user.personality,
            technologies: user.technologies,
            goals: user.goals,
            frustrations: user.frustrations,
          });
        } else {
          return Promise.reject('Document not found');
        }
      })
    );
  }

  warnUser(user: User, message: String): void {

  }

  removeUser(userEmail: String | null): void {

  }
  
  setAdmin(user: User): void {

  }

  unsetAdmin(user: User): void {

  }

  setMod(user: User): void {

  }

  unsetMod(user: User): void {
    
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

  updateCv(cv: CV): Observable<void>{
    console.log(cv.id);
    return this.firestore.collection('cvs').doc(cv.id).get().pipe(
      switchMap((doc) => {
        if (doc.exists) {
          console.log(cv);
          return this.firestore.collection('cvs').doc(cv.id).update({
            contact: cv.contact,
            summary: cv.summary,
            experience: cv.experience,
            education: cv.education,
            skills: cv.skills,
            languages: cv.languages
          });
        } else {
          return Promise.reject('Document not found');
        }
      })
    );
  }
}
