import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { PostService } from '../../services/post/post.service';
import { UserService } from 'src/services/user/user.service';
import { Post } from '../../models/post.model';
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
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUserId().subscribe((userId) => {
      this.currentUserId = userId;
      if (this.currentUserId) {
        this.userService.getUserById(this.currentUserId).subscribe((userData) => {
          this.userData = userData;
        });
      }
    });

    this.authService.getCurrentUserEmail().subscribe((userEmail) => {
      this.currentUserEmail = userEmail;
    });
  }

  
  onSubmit(): void {
    if (this.postForm.valid) {
      const userId = this.currentUserId;
      const userEmail = this.currentUserEmail;
      const userAvatar = this.userData?.avatar;
      if (userId) {
        const newPost: Post = {
          body: this.postForm.value.body,
          likes: 0,
          userId: userId,
          userAvatar: userAvatar,
          userEmail: userEmail,
          createDate: new Date(),
          numComments: 0,
          category: this.postForm.value.category
        };

        this.postService.addPost(newPost).then(() => {
          this.postForm.reset();
        });
      }
    }
  }
}
