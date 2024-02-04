import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service'
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.css']
})
export class FollowComponent implements OnInit {
  followForm: FormGroup;
  userEmail!: string | null
  searchEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.followForm = this.fb.group({
      searchEmail: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUserEmail().subscribe((userEmail) => {
      this.userEmail = userEmail;
    });
  }

  followUser(): void {
    if (this.followForm.valid) {
      this.searchEmail = this.followForm.get('searchEmail')?.value;
      this.userService.followUser(this.userEmail, this.searchEmail)
        .then(() => {
          console.log(`Successfully followed user with email: ${this.searchEmail}`);
        })
        .catch((error) => {
          console.error(`Error following user: ${error}`);
        });
    }
  }
  
}
