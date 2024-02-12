import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post/post.service';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user/user.service';
import { User } from 'src/models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: string | null = null;
  userEmail: string | null = null;
  username: string | null = null;
  userData: User | null = null;
  posts!: Observable<any>;
  constructor(private authService: AuthService, private postService: PostService, private userService: UserService) {}

  ngOnInit(): void {
    this.authService.getCurrentUserEmail().subscribe((email) => {
      this.userEmail = email;
    });

    this.authService.getCurrentUsername().subscribe((username) => {
      this.username = username;
    });

    this.authService.getCurrentUserId().subscribe((userId) => {
      this.userId = userId;
      this.posts = this.postService.getPostsByUserId(userId);
      this.userService.getUserById(this.userId).subscribe((userData) => {
        console.log(userData);
        this.userData = userData;
      });
    });
  }
}
