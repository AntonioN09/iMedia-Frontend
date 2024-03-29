import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/models/user.model';
import { UserService } from 'src/services/user/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users!: Observable<any>;
  currentUserEmail!: string | null;
  userForm!: FormGroup;
  userId!: string | null;
  userData!: User | null;

  constructor(private fb: FormBuilder,
              private userService: UserService, 
              private authService: AuthService) {
    this.userForm = this.fb.group({
      warnMessage: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUserEmail().subscribe((userEmail) => {
      this.currentUserEmail = userEmail;
    });
    
    this.users =  this.userService.getUsersSortedByEmail();;

    this.authService.getCurrentUserId().subscribe((userId) => {
      this.userId = userId;
      if (this.userId) {
        this.userService.getUserById(this.userId).subscribe((userData) => {
          this.userData = userData;
        });
      }
    });
  }
  
  toggleWarn(user: any): void {
    if (user.editing) {
      user.editing = false;
    } else {
      user.editing = true;
    }
  }

  warnUser(user: any): void {
    if(this.userForm.valid){
      let message = this.userForm.value.warnMessage;
      this.userService.notifyUser(this.userData, message, user.email, user.id);
    }
    this.toggleWarn(user);
  }
  
  removeUser(userId: any): void {
    this.userService.removeUser(userId);
  }

  setAdmin(user: any): void {
    this.userService.setAdmin(user).subscribe();
  }

  setMod(user: any): void {
    this.userService.setMod(user).subscribe();
  }
}
