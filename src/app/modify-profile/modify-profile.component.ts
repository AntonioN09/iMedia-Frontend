import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { User } from 'src/models/user.model';
import { AuthService } from 'src/services/auth/auth.service';
import { PostService } from 'src/services/post/post.service';
import { UserService } from 'src/services/user/user.service';

@Component({
  selector: 'app-modify-profile',
  templateUrl: './modify-profile.component.html',
  styleUrls: ['./modify-profile.component.css']
})
export class ModifyProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUserId!: string | null;
  currentUserEmail!: string | null;
  userData!: User | null;

  constructor(public fb: FormBuilder, 
    public authService: AuthService, 
    public postService: PostService, 
    public userService: UserService) {
      this.authService.getCurrentUserEmail().subscribe((userEmail) => {
        this.currentUserEmail = userEmail;
      });
  
      this.authService.getCurrentUserId().pipe(
        switchMap((userId) => {
          this.currentUserId = userId;
          return this.postService.getPostsByUserId(userId);
        })
      ).subscribe(() => {
        this.userService.getUserById(this.currentUserId).subscribe((userData) => {
          this.userData = userData;
        });
      });
  }

  ngOnInit() {
    this.profileForm = this.fb.group({
      // id: string,
      // email: string,
      // bio?: string,
      // avatar?: string,
      // age?: string,
      // occupation?: string,
      // personality?: string,
      // technologies?: string[],
      // goals?: string[],
      // frustrations?: string[]
      bio: [this.userData?.bio],
      avatar: [this.userData?.avatar],
      age: [this.userData?.age],
      occupation: [this.userData?.occupation],
      personality: [this.userData?.personality],
      technologies: [this.userData?.technologies],
      goals: [this.userData?.goals],
      frustrations: [this.userData?.frustrations],
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const userId = this.currentUserId;
      const userEmail = this.currentUserEmail;
      if (userId) {
        const newUser: User = {
          id: userId,
          email: userEmail ? userEmail : "",
          bio: this.profileForm.value.bio,
          avatar: this.profileForm.value.avatar,
          age: this.profileForm.value.age,
          occupation: this.profileForm.value.occupation,
          personality: this.profileForm.value.personality,
          technologies: this.profileForm.value.technologies,
          goals: this.profileForm.value.goals,
          frustrations: this.profileForm.value.frustrations,
        };

        this.userService.updateUser(newUser).subscribe(() => {
          
        });
      }
    }
  }
}
