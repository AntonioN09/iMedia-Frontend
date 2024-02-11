import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { Post } from '../../models/post.model';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Comment } from '../../models/comment.model';

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

  getCommentsByPostId(postId: string | null): Observable<any[]> {
    return this.firestore
      .collection<Comment>('comments', (ref) =>
        ref.where('postId', '==', postId).orderBy('createDate', 'desc')
      )
      .valueChanges({ idField: 'id' });
  }

  getPostsSortedByLikes(): Observable<any[]> {
    return this.firestore.collection<Post>('posts', ref => ref.orderBy('likes', 'desc')).valueChanges({ idField: 'id' });
  }

  getPostsSortedByTime(): Observable<any[]> {
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

  incrementCommentCount(postId: string): Observable<void> {
    return this.firestore.collection('posts').doc(postId).get().pipe(
      switchMap((doc) => {
        if (doc.exists) {
          const postData = doc.data() as { numComments?: number };
          const numComments = postData.numComments || 0; 
          const updatedNumComments = numComments + 1; 
          return from(this.firestore.collection('posts').doc(postId).update({ numComments: updatedNumComments }));
        } else {
          return Promise.reject('Document not found');
        }
      })
    );
  }

  addPost(post: Post): Promise<void> {
    return this.firestore.collection('posts').add(post).then(() => {});
  }

  addComment(comment: Comment): Observable<void> {
    return from(this.firestore.collection('comments').add(comment)).pipe(
      switchMap((docRef) => {
        return this.incrementCommentCount(comment.postId).pipe(
          catchError((error) => {
            console.error('Error incrementing comment count:', error);
            return [];
          })
        );
      })
    );
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

  likeComment(commentId: string | undefined): Observable<void> {
    return this.firestore.collection('comments').doc(commentId).get().pipe(
      switchMap((doc) => {
        if (doc.exists) {
          const currentLikes = (doc.data() as Comment)?.likes || 0;
          const updatedLikes = currentLikes + 1;

          return this.firestore.collection('comments').doc(commentId).update({
            likes: updatedLikes,
          });
        } else {
          return Promise.reject('Document not found');
        }
      })
    );
  }

  getCommentCountByPostId(postId: string): Observable<number> {
    return this.firestore.collection('comments', ref => ref.where('postId', '==', postId))
      .valueChanges()
      .pipe(
        map(comments => comments.length)
      );
  }
}