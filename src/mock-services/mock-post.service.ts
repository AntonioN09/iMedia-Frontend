import { of } from 'rxjs';
import { Post } from 'src/models/post.model';
import { Timestamp } from '@firebase/firestore';

export class MockPostService {
  getPosts() {
    return of([{ id: '1', content: 'Test post' }]);
  }

  getPostsByUserId(userId: string | null) {
    return of([{ id: '1', content: 'Test post', userId: '123' }]);
  }

  getPostsSortedByLikes() {
    return of([{ id: '1', content: 'Test post', likes: 10 }]);
  }

  getPostsSortedByTime() {
    return of([{ id: '1', content: 'Test post', createDate: new Date() }]);
  }

  getPostsByUserEmail(userEmail: string) {
    return of([{ id: '1', content: 'Test post', userEmail: 'test@example.com', likes: 3, createDate: Timestamp.now() }]);
  }

  editPost(post: any) {
    return of(null);
  }

  addPost(post: Post) {
    return Promise.resolve();
  }

  likePost(postId: string | undefined) {
    return of(null);
  }
}