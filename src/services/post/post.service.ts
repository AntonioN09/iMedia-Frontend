import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { Post } from '../../models/post.model';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class PostService {
  
  constructor(private firestore: AngularFirestore, private authService: AuthService, private userService: UserService) {}

  getPosts(): Observable<Post[]> {
    return this.firestore
      .collection<Post>('posts')
      .valueChanges({ idField: 'id' });
  }

  getPostsByUserId(userId: string | null): Observable<Post[]> {
    return this.firestore
      .collection<Post>('posts', (ref) =>
        ref.where('userId', '==', userId).orderBy('createDate', 'desc')
      )
      .valueChanges({ idField: 'id' });
  }

  getPostsSortedByLikes(): Observable<Post[]> {
    return this.firestore.collection<Post>('posts', ref => ref.orderBy('likes', 'desc')).valueChanges({ idField: 'id' });
  }

  getPostsSortedByTime(): Observable<Post[]> {
    return this.firestore.collection<Post>('posts', ref => ref.orderBy('createDate', 'desc')).valueChanges({ idField: 'id' });
  }

  getPostsByUserEmail(userEmail: string): Observable<any[]> {
    return this.userService.getFollowedUserEmails(userEmail).pipe(
      switchMap((followedUserEmails) => {
        if (followedUserEmails.length > 0) {
          return this.firestore
            .collection('posts', (ref) => ref.where('userEmail', 'in', followedUserEmails).orderBy('createDate', 'desc'))
            .valueChanges({ idField: 'id' });
        } else {
          return of([]);
        }
      })
    );
  }

  editPost(post: any): Observable<void> {
    console.log(post)
    return this.firestore.collection('posts').doc(post.id).get().pipe(
      switchMap((doc) => {
        if (doc.exists) {
          console.log(post.id)
          return this.firestore.collection('posts').doc(post.id).update({
            body: post.body,
          });
        } else {
          return Promise.reject('Document not found');
        }
      })
    );
  }

  addPost(post: Post): Promise<void> {
    return this.firestore.collection('posts').add(post).then(() => {});
  }

  likePost(postId: string | undefined): Observable<void> {
    return this.firestore.collection('posts').doc(postId).get().pipe(
      switchMap((doc) => {
        if (doc.exists) {
          const currentLikes = (doc.data() as Post)?.likes || 0;
          const updatedLikes = currentLikes + 1;

          return this.firestore.collection('posts').doc(postId).update({
            likes: updatedLikes,
          });
        } else {
          return Promise.reject('Document not found');
        }
      })
    );
  }
}