import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth,  private firestore: AngularFirestore) {
    this.user = this.afAuth.authState;
  }

  login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  register(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const userId = userCredential.user?.uid;
        if (userId) {
          const newUser: User = {
              id: userId,
              bio: "",
              age: "",
              occupation: "",
              personality: "",
              technologies: [],
              goals: [],
              frustrations: [],
              email: email,
              avatar: "../../assets/img/default.png"
          };
          this.firestore.collection('users').doc(userId).set(newUser);
        }

        return userCredential;
      });
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  isAuthenticated(): Observable<boolean> {
    return this.user.pipe(map(user => !!user));
  }

  isAdmin(): Observable<boolean> {
    return of(true);
  }

  isMod(): Observable<boolean> {
    return of(true);
  }

  getCurrentUserEmail(): Observable<string | null> {
    return this.user.pipe(map((user) => (user ? user.email : null)));
  }

  getCurrentUserId(): Observable<string | null> {
    return this.afAuth.authState.pipe(map((user) => (user ? user.uid : null)));
  }

  getCurrentUsername(): Observable<string | null> {
    return this.user.pipe(map((user) => (user ? this.extractUsername(user.email) : null)) );
  }

  private extractUsername(email: string | null): string | null {
    if(email == null){
      return null;
    }
    const atIndex = email.indexOf('@');
    return atIndex !== -1 ? email.substring(0, atIndex) : email;
  }
}
