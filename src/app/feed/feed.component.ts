import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { PostService } from '../../services/post/post.service';
import { UserService } from '../../services/user/user.service';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  posts!: Observable<any[]>;
  userId!: string | null;
  userData!: User | null;

  constructor(private authService: AuthService, private postService: PostService, private userService: UserService) {}

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
    console.log(this.userData?.avatar);
  }

  displayAvatar(userId: string | null): Observable<string | undefined> {
    return this.userService.getUserById(userId).pipe(
      map((userData) => userData?.avatar)
    );
  }

  // displayAvatar(userId: string | null): string | undefined {
  //   return this.userService.getUserByIdSync(userId)?.avatar;
  // }
}