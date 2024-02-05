import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/models/user.model';
import { UserService } from 'src/services/user/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  @Input() getusers: User[] = [];
  users: User[] = [];
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
    this.userService.getUsersSortedByEmail().subscribe((users) => {
      this.getusers = users;
      
      this.users = this.getusers.map((getUser) => {
        return {
          id: getUser.id,
          bio: getUser.bio,
          age: getUser.age,
          occupation: getUser.occupation,
          personality: getUser.personality,
          technologies: getUser.technologies,
          goals: getUser.goals,
          frustrations: getUser.frustrations,
          email: getUser.email,
          avatar: "../../assets/img/default.png",
          isAdmin: getUser.isAdmin,
          isMod: getUser.isMod
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
      this.userService.warnUser(user, message);
      console.log(message);
    }
    this.toggleWarn(user);
  }
  
  removeUser(userEmail: any): void {
    this.userService.removeUser(userEmail);
  }

  setAdmin(user: any): void {
    this.userService.setAdmin(user);
  }

  unsetAdmin(user: any): void {
    this.userService.unsetAdmin(user);
  }

  setMod(user: any): void {
    this.userService.setMod(user);
  }

  unsetMod(user: any): void {
    this.userService.unsetMod(user);
  }
}
