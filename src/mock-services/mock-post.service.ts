import { of } from 'rxjs';
import { Post } from 'src/models/post.model';
import { Timestamp } from '@firebase/firestore';

export class MockPostService {
  posts: Post[] = [
    { id: '1', body: 'Test post', userId: '123', likes: 3 }
  ];
  
  getPosts() {
    return of([{ id: '1', content: 'Test post' }]);
  }

  getPostsByUserId(userId: string | null) {
    return of([{ id: '1', content: 'Test post', userId: '123' }]);
  }

  getPostsSortedByLikes() {
    return of(this.posts);
  }

  getPostsSortedByTime() {
    return of(this.posts);
  }

  getPostsByUserEmail(userEmail: string) {
    return of([{ id: '1', content: 'Test post', userEmail: 'test@example.com', likes: 3, createDate: Timestamp.now() }]);
  }

  editPost(post: any) {
    return of(null);
  }

  addPost(post: Post) : Promise<void> {
    this.posts.push({ id: '1', body: 'Test post',
    userId: '123', likes: 3 });
    
    return Promise.resolve();
  }

  likePost(postId: string | undefined) {
    return of(null);
  }
}