import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { CV } from 'src/models/cv.model';
import { User } from 'src/models/user.model';
import { AuthService } from 'src/services/auth/auth.service';
import { PostService } from 'src/services/post/post.service';
import { UserService } from 'src/services/user/user.service';

@Component({
  selector: 'app-modify-cv',
  templateUrl: './modify-cv.component.html',
  styleUrls: ['./modify-cv.component.css']
})
export class ModifyCvComponent implements OnInit {
  cvForm!: FormGroup;
  currentUserId!: string | null;
  currentUserEmail!: string | null;
  cvData!: CV | null;

  constructor(private fb: FormBuilder, 
    private authService: AuthService, 
    private postService: PostService, 
    private userService: UserService) {
      this.authService.getCurrentUserEmail().subscribe((userEmail) => {
        this.currentUserEmail = userEmail;
      });
  
      this.authService.getCurrentUserId().pipe(
        switchMap((userId) => {
          this.currentUserId = userId;
          return this.postService.getPostsByUserId(userId);
        })
      ).subscribe(() => {
        this.userService.getCvByUserId(this.currentUserId).subscribe((cvData) => {
          this.cvData = cvData;
        });
      });
  }

  ngOnInit() {
    this.cvForm = this.fb.group({
      contact: [this.cvData?.contact],
      summary: [this.cvData?.summary],
      experience: [this.cvData?.experience],
      education: [this.cvData?.education],
      skills: [this.cvData?.skills],
      languages: [this.cvData?.languages]
    });
  }

  onSubmit(): void {
    console.log(this.cvData?.id);
    if (this.cvForm.valid) {
      const userId = this.currentUserId;
      if (userId) {
        const newCv: CV = {
          id: userId,
          userId: userId,
          contact: this.cvForm.value.contact,
          summary: this.cvForm.value.summary,
          experience: this.cvForm.value.experience,
          education: this.cvForm.value.education,
          skills: this.cvForm.value.skills,
          languages: this.cvForm.value.languages
        };

        this.userService.updateCv(newCv).subscribe(() => {
          
        });
      }
    }
  }
}
