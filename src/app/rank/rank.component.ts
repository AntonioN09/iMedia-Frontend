import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post/post.service';
import { AuthService } from 'src/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/models/user.model';
import { UserService } from 'src/services/user/user.service';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.css']
})
export class RankComponent implements OnInit {
  @Input() getposts: Post[] = [];
  posts: Post[] = [];
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
    this.postService.getPostsSortedByLikes().subscribe((posts) => {
      this.getposts = posts;
      
      this.posts = this.getposts.map((getPost) => {
        const createDate = getPost.createDate;

        return {
          id: getPost.id,
          title: getPost.title,
          body: getPost.body,
          likes: getPost.likes,
          userId: getPost.userId,
          userEmail: getPost.userEmail,
          createDate: createDate
        };
      });
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
    console.log(post)
    console.log(this.postForm)
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
    this.postService.likePost(postId).subscribe();
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