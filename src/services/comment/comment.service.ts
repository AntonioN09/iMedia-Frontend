import { Injectable } from '@angular/core';
import { Observable, catchError, from, map, switchMap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Comment } from '../../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private firestore: AngularFirestore) { }

  getCommentsByPostId(postId: string | null): Observable<any[]> {
    return this.firestore
      .collection<Comment>('comments', (ref) =>
        ref.where('postId', '==', postId).orderBy('createDate', 'desc')
      )
      .valueChanges({ idField: 'id' });
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
