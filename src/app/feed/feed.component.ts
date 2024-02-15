import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { PostService } from '../../services/post/post.service';
import { UserService } from '../../services/user/user.service';
import { User } from 'src/models/user.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  posts!: Observable<any[]>;
  userId!: string | null;
  userEmail!: string | null;
  userData!: User | null;
  filterForm!: FormGroup;

  constructor(public authService: AuthService, 
              public postService: PostService, 
              public userService: UserService,
              public router: Router,
              private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      category: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.authService.getCurrentUserEmail().subscribe((currentUserEmail) => {
      this.userEmail = currentUserEmail;
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

  redirectToProfile(userId: string | undefined): void {
    this.router.navigate(['private/profile', userId]);
  }

  filterByCategory(): void {
    if(this.filterForm.valid) {
      const category = this.filterForm.value.category;
      if(category == 'No filter'){
        this.posts = this.postService.getPostsByUserEmail(this.userEmail!);
      } else{
        this.posts = this.postService.getFilteredPostsByUserEmail(this.userEmail!, category);
      }
    }
  }
}