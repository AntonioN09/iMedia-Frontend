import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post/post.service';
import { AuthService } from 'src/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/models/user.model';
import { UserService } from 'src/services/user/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mod-dashboard',
  templateUrl: './mod-dashboard.component.html',
  styleUrls: ['./mod-dashboard.component.css']
})
export class ModDashboardComponent implements OnInit {
  posts!: Observable<any>;
  currentUserEmail!: string | null;
  postForm!: FormGroup;
  userId!: string | null;
  userData!: User | null;

  constructor(private fb: FormBuilder,
              private userService: UserService, 
              private postService: PostService, 
              private authService: AuthService) {
    this.postForm = this.fb.group({
      body: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUserEmail().subscribe((userEmail) => {
      this.currentUserEmail = userEmail;
    });

    this.posts = this.postService.getPostsSortedByTime();

    this.authService.getCurrentUserId().subscribe((userId) => {
      this.userId = userId;
      if (this.userId) {
        this.userService.getUserById(this.userId).subscribe((userData) => {
          this.userData = userData;
        });
      }
    });
  }
  
  toggleEdit(post: any): void {
    if (post.editing) {
      post.body = post.editedBody;

      post.editing = false;
      post.editedBody = '';
    } else {
      post.editedBody = post.body;
      post.editing = true;
    }
  }

  moderatePost(post: any): void {
    if (this.postForm.valid) {
        const newPost: Post = {
          id: post.id,
          createDate: new Date(),
          body: this.postForm.value.body, 
        }
        this.postService.editPost(newPost).subscribe();
        const message: string = "The post '" + post.body + "' has been moderated";
        this.userService.notifyUser(this.userData, message, post.userEmail, post.userId);
    }

    this.toggleEdit(post);
  }
  
  
  toggleLike(postId: string | undefined): void {
    this.postService.likePost(this.userId!, postId).subscribe();
  }

  followUser(following: string | null | undefined): void {
    this.userService.followUser(this.currentUserEmail, following ? following : "")
      .then(() => {
        console.log(`Successfully followed user with email: ${following}`);
      })
      .catch((error) => {
        console.error(`Error following user: ${error}`);
      });
  }
  
}