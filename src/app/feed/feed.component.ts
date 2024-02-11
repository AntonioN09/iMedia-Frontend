import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { PostService } from '../../services/post/post.service';
import { UserService } from '../../services/user/user.service';
import { User } from 'src/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  posts!: Observable<any[]>;
  userId!: string | null;
  userData!: User | null;

  constructor(private authService: AuthService, 
              private postService: PostService, 
              private userService: UserService,
              private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUserEmail().subscribe((currentUserEmail) => {
      if (currentUserEmail) {
        this.posts = this.postService.getPostsByUserEmail(currentUserEmail);
      } else {
        console.log('User not authenticated');
      }
    });

    this.authService.getCurrentUserId().subscribe((userId) => {
      this.userId = userId;
      if (this.userId) {
        this.userService.getUserById(this.userId).subscribe((userData) => {
          this.userData = userData;
        });
      }
    });
  }
  
  toggleLike(postId: string | undefined): void {
    this.postService.likePost(postId).subscribe();
  }

  redirectToComments(postId: string | undefined): void {
    this.router.navigate(['private/comments', postId]);
  }

  displayAvatar(userId: string | null): Observable<string | undefined> {
    return this.userService.getUserById(userId).pipe(
      map((userData) => userData?.avatar)
    );
  }
}