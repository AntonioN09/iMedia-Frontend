import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post/post.service';
import { AuthService } from 'src/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/models/user.model';
import { UserService } from 'src/services/user/user.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.css']
})
export class RankComponent implements OnInit {
  posts!: Observable<any[]>;
  currentUserEmail!: string | null;
  postForm!: FormGroup;
  userId!: string | null;
  userData!: User | null;
  filterForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private userService: UserService, 
              private postService: PostService, 
              private authService: AuthService,
              private router: Router) {
    this.postForm = this.fb.group({
      body: ['', Validators.required],
    });

    this.filterForm = this.fb.group({
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUserEmail().subscribe((userEmail) => {
      this.currentUserEmail = userEmail;
    });
    
    this.posts = this.postService.getPostsSortedByLikes();
    console.log(this.posts.subscribe((posts) => {
      console.log(posts.length);
    }));
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

  editPost(post: any): void {
    if (this.postForm.valid) {
        const newPost: Post = {
          id: post.id,
          createDate: new Date(),
          body: this.postForm.value.body,
        }
        this.postService.editPost(newPost).subscribe();
    }
    this.toggleEdit(post);
  }
  
  toggleLike(postId: string | undefined): void {
    this.postService.likePost(this.userId!, postId).subscribe();
  }

  redirectToComments(postId: string | undefined): void {
    this.router.navigate(['private/comments', postId]);
  }

  redirectToProfile(userId: string | undefined): void {
    this.router.navigate(['private/profile', userId]);
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
  
  filterByCategory(): void {
    if(this.filterForm.valid) {
      const category = this.filterForm.value.category;
      if(category == 'No filter'){
        this.posts = this.postService.getPostsSortedByLikes();
      } else{
        this.posts = this.postService.getFilteredPostsSortedByLikes(category);
      }
    }
  }
}