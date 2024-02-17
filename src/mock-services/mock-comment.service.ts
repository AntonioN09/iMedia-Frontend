import { Observable, of } from 'rxjs';

export class MockCommentService {
  getCommentsByPostId(postId: string | null): Observable<any[]> {
    return of([]);
  }

  incrementCommentCount(postId: string): Observable<void> {
    return of();
  }

  addComment(comment: any): Observable<void> {
    return of();
  }

  likeComment(userId: string | undefined, commentId: string | undefined): Observable<void> {
    return of();
  }

  getCommentCountByPostId(postId: string): Observable<number> {
    return of(0);
  }
}