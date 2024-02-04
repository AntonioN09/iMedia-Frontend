import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { PostService } from '../../services/post/post.service';
import { Post } from '../../models/post.model';
import { UserService } from 'src/services/user/user.service';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  postForm!: FormGroup;
  currentUserId!: string | null;
  currentUserEmail!: string | null;
  userData!: User | null;

  constructor(private fb: FormBuilder, 
              private authService: AuthService, 
              private postService: PostService, 
              private userService: UserService) {
    this.postForm = this.fb.group({
      body: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUserId().subscribe((userId) => {
      this.currentUserId = userId;
    });

    this.authService.getCurrentUserEmail().subscribe((userEmail) => {
      this.currentUserEmail = userEmail;
    });

    this.userService.getUserById(this.currentUserId).subscribe((userData) => {
      this.userData = userData;
    });
  }

  
  onSubmit(): void {
    if (this.postForm.valid) {
      const userId = this.currentUserId;
      const userEmail = this.currentUserEmail;
      if (userId) {
        const newPost: Post = {
          body: this.postForm.value.body,
          likes: 0,
          userId: userId,
          userEmail: userEmail,
          createDate: new Date(),
        };

        this.postService.addPost(newPost).then(() => {
          this.postForm.reset();
        });
      }
    }
  }
}
