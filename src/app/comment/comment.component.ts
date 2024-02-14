import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { CommentService } from '../../services/comment/comment.service';
import { UserService } from 'src/services/user/user.service';
import { Comment } from '../../models/comment.model';
import { User } from 'src/models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  @Input() postId!: string;
  commentForm!: FormGroup;
  currentUserId!: string | null;
  currentUserEmail!: string | null;
  userData!: User | null;
  comments!: Observable<any[]>;
  displayCount: number = 3;

  constructor(private route: ActivatedRoute, 
              private fb: FormBuilder, 
              private authService: AuthService, 
              private commentService: CommentService, 
              private userService: UserService) {
    this.route.params.subscribe(params => {
      this.postId = params['postId'];
    });

    this.commentForm = this.fb.group({
      body: ['', Validators.required],
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

    this.authService.getCurrentUserEmail().subscribe((currentUserEmail) => {
      if (currentUserEmail) {
        this.currentUserEmail = currentUserEmail;
        this.comments = this.commentService.getCommentsByPostId(this.postId);
      } else {
        console.log('User not authenticated');
      }
    });
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
      const userId = this.currentUserId;
      const userEmail = this.currentUserEmail;
      const userAvatar = this.userData?.avatar;
      if (userId) {
        const newComment: Comment = {
          postId: this.postId,
          body: this.commentForm.value.body,
          likes: 0,
          userId: userId,
          userAvatar: userAvatar,
          userEmail: userEmail,
          createDate: new Date(),
        };

        this.commentService.addComment(newComment).subscribe(() => {
          this.commentForm.reset();
        });
      }
    }
  }

  toggleLike(commentId: string | undefined): void {
    this.commentService.likeComment(commentId).subscribe();
  }

  showMore(): void {
    this.displayCount = this.displayCount + 3;
  }
}
