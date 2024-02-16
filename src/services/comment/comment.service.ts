import { Injectable } from '@angular/core';
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Comment } from '../../models/comment.model';
import { Like } from 'src/models/like.model';

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

  likeComment(userId: string | undefined, commentId: string | undefined): Observable<void> {
    const likeRef = this.firestore.collection('likes', ref =>
        ref.where('userId', '==', userId)
           .where('postId', '==', commentId)
           .limit(1)
    );
    return likeRef.get().pipe(
        switchMap((querySnapshot) => {
            if (!querySnapshot.empty) {
                return of();
            } else {
                const like: Like = {
                    userId: userId,
                    postId: commentId
                };
                const addLike = from(this.firestore.collection('likes').add(like));
                return addLike.pipe(
                    switchMap(() => {
                        return this.firestore.collection('comments').doc(commentId).get();
                    }),
                    switchMap((doc) => {
                        if (doc.exists) {
                            const currentLikes = (doc.data() as Comment)?.likes || 0;
                            const updatedLikes = currentLikes + 1;
                            return from(this.firestore.collection('comments').doc(commentId).update({
                                likes: updatedLikes,
                            }));
                        } else {
                            return Promise.reject('Document not found');
                        }
                    })
                );
            }
        }),
        catchError(error => {
            console.error('Error liking post:', error);
            return of(); 
        }),
        map(() => {})
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
